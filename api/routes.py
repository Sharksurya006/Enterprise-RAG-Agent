from pathlib import Path
from starlette.concurrency import run_in_threadpool
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Annotated,List
from app.core.config import get_settings
from Agent.workflow import ask
from RAG.vector_store import add_documents
from RAG.Ingestion_pipeline import load_file, chunk_documents, SUPPORTED
from app.services.audit import write_audit
from GuardRails.rails import check_input, check_output
import logging 

router = APIRouter(prefix="/api")

settings = get_settings()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
	question : Annotated[str, Field(min_length=2, max_length = 3000)]


@router.get("/health")
def health():
	return {"status" : "ok", "service" : settings.app_name}


@router.post("/chat")
async def chat(payload: ChatRequest):
    try:
        try:
            blocked, msg = await check_input(payload.question)
        except Exception as exc:
            logger.warning("Input guardrail unavailable: %s", exc)
            raise HTTPException(
                status_code=503,
                detail="The safety check is temporarily unavailable. Please try again in a moment.",
            ) from exc
        if blocked:
            write_audit(payload.question, "guardrail_blocked", [], guardrail="input")
            return {"answer": msg, "source_used": "guardrail_blocked", "trace": [], "citations": [], "rewritten_query": payload.question}

        result = await run_in_threadpool(ask, payload.question)

        guardrail = None
        try:
            out_blocked, safe_answer = await check_output(payload.question, result["answer"])
            if out_blocked:
                result["answer"] = safe_answer
                result["source_used"] = "guardrail_blocked"
                result["citations"] = []
                guardrail = "output"
        except Exception as exc:
            logger.warning("Output guardrail unavailable, returning answer unchecked: %s", exc)
            guardrail = "output_unavailable"

        write_audit(payload.question, result["source_used"], result.get("trace", []), guardrail=guardrail)

        return {
            "answer": result["answer"],
            "source_used": result["source_used"],
            "trace": result.get("trace", []),
            "citations": result.get("citations", []),
            "rewritten_query": result.get("current_query", payload.question),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    
@router.post("/ingest")
async def ingest(file: UploadFile = File(...), x_admin_key:str = Header(default="")):
	if x_admin_key != settings.admin_api_key:
		raise HTTPException(status_code = 401, detail= "Invalid admin key")

	suffix = Path(file.filename or "").suffix.lower()

	if suffix not in SUPPORTED:
		raise HTTPException(status_code=400, detail=f"Supported:{','.join(sorted(SUPPORTED))}")

	upload_dir = Path(settings.upload_dir)
	upload_dir.mkdir(parents = True, exist_ok=True)
	dest = upload_dir / Path(file.filename).name
	dest.write_bytes(await file.read())
	docs = load_file(dest)
	chunks = chunk_documents(docs)
	ids = add_documents(chunks)

	return {"message" : "Document indexed", "file" : dest.name, "chunks" : len(chunks), "ids_created" : len(ids)}



