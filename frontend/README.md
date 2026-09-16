# HR Copilot — Frontend

A React + Tailwind chat interface for the Enterprise HR Policy Agentic RAG
Copilot backend (FastAPI + LangGraph). Built to match the existing API
exactly — see [API contract](#api-contract) below.

## Features

- ChatGPT/Claude-style layout: collapsible sidebar with conversation
  history (persisted in `localStorage`), main chat column, composer with
  autosizing input.
- Light and dark mode, toggle in the sidebar, persisted and applied
  before first paint (no flash).
- Renders answers as Markdown (tables, lists, code, links).
- Shows which source answered the question (private KB, web search,
  direct, or insufficient evidence), plus a collapsible reasoning trace
  and citation list, matching the `/api/chat` response fields.
- Admin panel ("Add to knowledge base") for uploading documents to
  `/api/ingest`, gated by the `X-Admin-Key` header your backend expects.
- Offline banner if the FastAPI backend can't be reached.

## Local development

```bash
cd frontend
npm install
npm run dev
```

This starts Vite on `http://localhost:5173` and proxies `/api/*` to
`http://127.0.0.1:8000` (see `vite.config.js`), so run your FastAPI
backend on port 8000 alongside it:

```bash
# from the project root, in another terminal
uvicorn main:app --reload
```

## Production build

```bash
cd frontend
npm install
npm run build
```

This outputs static files to `frontend/dist/`. The updated `main.py` at
the project root serves this folder directly, so in production you only
run the FastAPI server — no separate frontend server needed:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Then open `http://localhost:8000`.

## API contract

The frontend calls these endpoints exactly as implemented in
`api/routes.py`:

| Method | Path          | Body / Headers                          | Response                                                                 |
| ------ | ------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/health` | —                                         | `{ status, service }`                                                    |
| POST   | `/api/chat`   | `{ question: string }`                    | `{ answer, source_used, trace, citations, rewritten_query }`             |
| POST   | `/api/ingest` | multipart `file`, header `X-Admin-Key`    | `{ message, file, chunks, ids_created }`                                 |

If you change any field names or add endpoints on the backend, update
`src/lib/api.js` to match.
