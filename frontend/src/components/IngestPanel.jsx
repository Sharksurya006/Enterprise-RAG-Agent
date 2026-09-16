import { useRef, useState } from "react";
import { CheckCircle2, FileUp, Loader2, X } from "lucide-react";
import { ingestDocument, ApiError } from "../lib/api";

const ACCEPTED = ".pdf,.md,.txt,.docx";
const SESSION_KEY = "hr-copilot-admin-key";

export default function IngestPanel({ onClose }) {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? "");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
    setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !adminKey) return;
    sessionStorage.setItem(SESSION_KEY, adminKey);
    setStatus("loading");
    try {
      const result = await ingestDocument(file, adminKey);
      setStatus("success");
      setMessage(`Indexed "${result.file}" into ${result.chunks} chunk${result.chunks === 1 ? "" : "s"}.`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof ApiError ? err.message : "Something went wrong while indexing that file.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-5 shadow-panel dark:border-ink-700 dark:bg-ink-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink-900 dark:text-white">
            Add to knowledge base
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-100"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-key" className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">
              Admin key
            </label>
            <input
              id="admin-key"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Required to index new documents"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brass-300 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:placeholder:text-ink-500"
            />
          </div>

          <div>
            <label htmlFor="doc-file" className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">
              Document
            </label>
            <label
              htmlFor="doc-file"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-ink-300 px-3 py-3 text-sm text-ink-500 transition-colors hover:border-brass-300 hover:text-ink-700 dark:border-ink-600 dark:text-ink-400 dark:hover:border-brass-500 dark:hover:text-ink-100"
            >
              <FileUp className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {file ? file.name : "PDF, Markdown, plain text, or Word (.docx)"}
            </label>
            <input
              id="doc-file"
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {status === "success" && (
            <div className="flex items-start gap-2 rounded-lg border border-kb-light/30 bg-kb-light/10 px-3 py-2 text-sm text-kb-light dark:border-kb-dark/30 dark:bg-kb-dark/10 dark:text-kb-dark">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span>{message}</span>
            </div>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={!file || !adminKey || status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink-800 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400 dark:bg-brass-400 dark:text-ink-900 dark:disabled:bg-ink-700 dark:disabled:text-ink-500"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Indexing…
              </>
            ) : (
              "Index document"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
