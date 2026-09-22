import { useEffect, useRef } from "react";
import { Menu, WifiOff } from "lucide-react";
import MessageBubble from "./MessageBubble";
import Composer from "./Composer";
import EmptyState from "./EmptyState";

export default function ChatView({ conversation, onSend, isSending, onOpenSidebarMobile, backendOffline }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages?.length, conversation?.id]);

  const messages = conversation?.messages ?? [];

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-ink-200 px-4 dark:border-ink-800 md:hidden">
        <button
          type="button"
          onClick={onOpenSidebarMobile}
          aria-label="Open menu"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <span className="font-serif text-base font-semibold text-ink-900 dark:text-white">WorkGuide AI</span>
      </header>

      {backendOffline && (
        <div className="flex items-center justify-center gap-2 border-b  dark:bg-brass-700/10">
          <WifiOff className="h-3.5 w-3.5" strokeWidth={1.75} />
          Can't reach the WorkGuide AI backend right now — check that the API server is running.
        </div>
      )}

      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onSuggestion={onSend} />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 md:px-6">
            {messages.map((message, i) => (
              <MessageBubble
                key={i}
                message={message}
                question={i > 0 ? messages[i - 1]?.content : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <Composer onSend={onSend} disabled={isSending} />
    </div>
  );
}
