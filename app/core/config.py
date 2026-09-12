from pydantic_settings import BaseSettings,SettingsConfigDict
from functools import lru_cache
from pathlib import Path
import os



BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "Enterprise HR Policy Agentic RAG Copilot"
    app_env: str = "development"
    tavily_api_key: str = os.getenv("TAVILY_API_KEY")
    pinecone_api_key: str = os.getenv("PINECONE_API_KEY")
    pinecone_index_name: str = "hybrid-search-langchain-pinecone"
    pinecone_namespace: str = "company-hr-kb"
    embedding_model: str = "all-MiniLM-L6-v2"
    google_ai_model: str = "gemini-3.5-flash-lite"
    top_k: int = 8
    max_retries: int = 2
    admin_api_key: str = "change-me-in-production"
    audit_db_path: str = str(BASE_DIR / "Data" / "audit.db")
    upload_dir: str = str(BASE_DIR / "uploads")
    sample_kb_dir: str = str(BASE_DIR / "Data" / "sample_kb")
    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"), extra="ignore")




@lru_cache
def get_settings() -> Settings:
    return Settings()
