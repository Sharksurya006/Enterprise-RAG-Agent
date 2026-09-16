import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="group relative flex h-8 w-14 items-center rounded-full border border-ink-200 bg-ink-100 px-1 transition-colors dark:border-ink-700 dark:bg-ink-800"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-panel transition-transform duration-200 dark:bg-ink-600 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-ink-200" strokeWidth={2} />
        ) : (
          <Sun className="h-3.5 w-3.5 text-brass-400" strokeWidth={2} />
        )}
      </span>
    </button>
  );
}
