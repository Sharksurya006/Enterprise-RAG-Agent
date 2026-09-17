import { useState } from "react";
import { ChevronDown, Clock, FileText, Globe2, ListTree, MessageCircle, ShieldAlert } from "lucide-react";


function formatDuration(ms) {
  if (ms == null) return null;
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

const SOURCE_META = {
  private_kb: {
    label: "Company knowledge base",
    icon: FileText,
    className: "border-kb-light/30 bg-kb-light/10 text-kb-light dark:border-kb-dark/30 dark:bg-kb-dark/10 dark:text-kb-dark",
  },
  web_search: {
    label: "Public web search",
    icon: Globe2,
    className: "border-web-light/30 bg-web-light/10 text-web-light dark:border-web-dark/30 dark:bg-web-dark/10 dark:text-web-dark",
  },
  direct: {
    label: "Direct response",
    icon: MessageCircle,
    className: "border-ink-300 bg-ink-100 text-ink-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-300",
  },
  insufficient_evidence: {
    label: "Insufficient evidence",
    icon: ShieldAlert,
    className: "border-brass-300 bg-brass-50 text-brass-600 dark:border-brass-600 dark:bg-brass-700/20 dark:text-brass-200",
  },
};

function SourceBadge({ sourceUsed }) {
  const meta = SOURCE_META[sourceUsed];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      {meta.label}
    </span>
  );
}

export default function SourceTrace({ sourceUsed, citations = [], trace = [], rewrittenQuery, question, durationMs }) {
  const [open, setOpen] = useState(false);
  const hasTrace = trace.length > 0;
  const hasCitations = citations.length > 0;
  const wasRewritten = rewrittenQuery && rewrittenQuery !== question;
  const duration = formatDuration(durationMs);

  if (!sourceUsed && !hasCitations && !hasTrace) return null;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge sourceUsed={sourceUsed} />
        {hasCitations && (
          <span className="text-xs text-ink-400 dark:text-ink-500">
            {citations.length} citation{citations.length === 1 ? "" : "s"}
          </span>
        )}
        {(hasTrace || hasCitations) && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:text-ink-500 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            aria-expanded={open}
          >
            <ListTree className="h-3.5 w-3.5" strokeWidth={1.75} />
            {open ? "Hide reasoning" : "Show reasoning"}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {open && (
        <div className="mt-2 space-y-3 rounded-lg border border-ink-200 bg-ink-50/60 p-3 dark:border-ink-800 dark:bg-ink-900/60">
          {wasRewritten && (
            <div>
              <p className="mb-1 text-xs font-medium text-ink-400 dark:text-ink-500">Query rewritten for retrieval</p>
              <p className="font-mono text-xs text-ink-600 dark:text-ink-300">{rewrittenQuery}</p>
            </div>
          )}

          {hasTrace && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-ink-400 dark:text-ink-500">Agent steps</p>
              <ol className="space-y-1">
                {trace.map((step, i) => (
                  <li key={i} className="flex gap-2 font-mono text-xs text-ink-600 dark:text-ink-300">
                    <span className="text-ink-300 dark:text-ink-600">{String(i + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {hasCitations && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-ink-400 dark:text-ink-500">Sources</p>
              <ul className="space-y-1">
                {citations.map((citation, i) => (
                  <li key={i}>
                    {citation.url ? (
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brass-500 underline decoration-brass-300 underline-offset-2 hover:text-brass-600 dark:text-brass-200 dark:decoration-brass-500"
                      >
                        {citation.title || citation.url}
                      </a>
                    ) : (
                      <span className="text-xs text-ink-600 dark:text-ink-300">{citation.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
