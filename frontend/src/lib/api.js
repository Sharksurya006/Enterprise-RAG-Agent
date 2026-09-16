// In dev, Vite proxies /api to the FastAPI backend (see vite.config.js).
// In production, main.py serves this build itself, so /api is same-origin.
const API_BASE = "";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorDetail(response) {
  try {
    const data = await response.json();
    return data.detail || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) throw new ApiError(await parseErrorDetail(response), response.status);
  return response.json();
}

export async function sendChatMessage(question) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new ApiError(await parseErrorDetail(response), response.status);
  return response.json();
}

export async function ingestDocument(file, adminKey) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE}/api/ingest`, {
    method: "POST",
    headers: { "X-Admin-Key": adminKey },
    body: formData,
  });
  if (!response.ok) throw new ApiError(await parseErrorDetail(response), response.status);
  return response.json();
}

export { ApiError };
