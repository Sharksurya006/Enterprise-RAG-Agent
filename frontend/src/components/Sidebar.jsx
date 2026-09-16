import { FileStack, PanelLeftClose, PanelLeftOpen, PenSquare, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function groupByRecency(conversations) {
  const now = Date.now();
  const day = 86_400_000;
  const groups = { Today: [], Yesterday: [], "Past week": [], Earlier: [] };
  for (const c of conversations) {
    const age = now - (c.updatedAt ?? c.createdAt ?? now);
    if (age < day) groups.Today.push(c);
    else if (age < day * 2) groups.Yesterday.push(c);
    else if (age < day * 7) groups["Past week"].push(c);
    else groups.Earlier.push(c);
  }
  return Object.entries(groups).filter(([, items]) => items.length > 0);
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onOpenIngest,
  theme,
  onToggleTheme,
}) {
  if (collapsed) {
    return (
      <div className="flex h-full w-14 flex-col items-center border-r border-ink-200 bg-white py-3 dark:border-ink-800 dark:bg-ink-900">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Expand sidebar"
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
        >
          <PanelLeftOpen className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New chat"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
        >
          <PenSquare className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[272px] shrink-0 flex-col border-r border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-lg font-semibold tracking-tight text-ink-900 dark:text-white">
            HR Copilot
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Collapse sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-100"
        >
          <PanelLeftClose className="h-4.5 w-4.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* New chat */}
      <div className="px-3 pt-4">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brass-300 hover:bg-brass-50 hover:text-ink-900 dark:border-ink-700 dark:text-ink-200 dark:hover:border-brass-600 dark:hover:bg-ink-800 dark:hover:text-white"
        >
          <PenSquare className="h-4 w-4" strokeWidth={1.75} />
          New conversation
        </button>
      </div>

      {/* History */}
      <nav className="scrollbar-thin mt-4 flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length === 0 ? (
          <p className="mt-6 px-1 text-sm leading-relaxed text-ink-400 dark:text-ink-500">
            Your past questions will show up here once you start a conversation.
          </p>
        ) : (
          groupByRecency(conversations).map(([label, items]) => (
            <div key={label} className="mb-4">
              <p className="mb-1.5 px-2 text-xs font-medium text-ink-400 dark:text-ink-500">{label}</p>
              <ul className="space-y-0.5">
                {items.map((c) => (
                  <li key={c.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className={`block w-full truncate rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                        c.id === activeId
                          ? "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white"
                          : "text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800/60"
                      }`}
                    >
                      {c.title || "New conversation"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      aria-label="Delete conversation"
                      className="absolute right-1.5 top-1.5 hidden rounded-md p-1.5 text-ink-400 hover:bg-ink-200 hover:text-ink-700 group-hover:block dark:hover:bg-ink-700 dark:hover:text-ink-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-ink-200 px-3 py-3 dark:border-ink-800">
        <button
          type="button"
          onClick={onOpenIngest}
          className="mb-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
        >
          <FileStack className="h-4 w-4" strokeWidth={1.75} />
          Add to knowledge base
        </button>
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs text-ink-400 dark:text-ink-500">
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}
