const SUGGESTIONS = [
  "How many paid leave days do I have this year?",
  "What's the process for expensing a work trip?",
  "Can I work remotely two days a week?",
  "What's our policy on parental leave?",
];

export default function EmptyState({ onSuggestion }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-[28px] font-medium leading-tight text-ink-900 dark:text-white">
        Ask about company policy.
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        Grounded in the HR knowledge base first, with public search as a fallback and citations either way.
      </p>
      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestion(s)}
            className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-left text-sm text-ink-600 shadow-panel transition-colors hover:border-brass-300 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:border-brass-500 dark:hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
