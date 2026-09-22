import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle } from "lucide-react";
import SourceTrace from "./SourceTrace";

function AssistantMark() {
  return (
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brass-300 bg-brass-50 font-serif text-xs font-semibold text-brass-600 dark:border-brass-600 dark:bg-ink-800 dark:text-brass-200">
      AI
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="thinking-dot h-1.5 w-1.5 rounded-full bg-ink-300 dark:bg-ink-600"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function MessageBubble({ message, question }) {
  if (message.role === "user") {
    return (
      <div className="message-enter flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-md bg-ink-800 px-4 py-2.5 text-[15px] leading-6 text-ink-50 dark:bg-ink-700">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant turn
  return (
    <div className="message-enter flex gap-3">
      <AssistantMark />
      <div className="min-w-0 flex-1 pt-0.5">
        {message.pending ? (
          <ThinkingIndicator />
        ) : message.error ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>{message.error}</span>
          </div>
        ) : (
          <>
            <div className="prose-copilot">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.answer}</ReactMarkdown>
            </div>
            <SourceTrace
              sourceUsed={message.sourceUsed}
              citations={message.citations}
              trace={message.trace}
              rewrittenQuery={message.rewrittenQuery}
              durationMs={message.durationMs}
              question={question}
            />
          </>
        )}
      </div>
    </div>
  );
}
