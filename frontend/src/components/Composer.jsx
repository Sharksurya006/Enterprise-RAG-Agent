import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const MAX_LENGTH = 3000;
const MIN_LENGTH = 2;

export default function Composer({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const canSend = value.trim().length >= MIN_LENGTH && value.length <= MAX_LENGTH && !disabled;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl px-4 pb-4 pt-2 md:px-6">
      <div className="flex items-end gap-2 rounded-2xl border border-ink-200 bg-white px-3 py-2 shadow-panel transition-colors dark:border-ink-700 dark:bg-ink-900">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={MAX_LENGTH}
          placeholder="Ask about leave, benefits, payroll, remote work…"
          disabled={disabled}
          className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 text-ink-800 placeholder:text-ink-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 dark:text-ink-100 dark:placeholder:text-ink-500"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-800 text-white transition-colors disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400 dark:text-ink-900 dark:disabled:bg-ink-700 dark:disabled:text-ink-500"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-ink-400 dark:text-ink-500">
        HR Copilot answers from company policy first, and falls back to public search when needed. Verify anything
        that affects pay, leave, or legal standing with HR directly.
      </p>
    </form>
  );
}
