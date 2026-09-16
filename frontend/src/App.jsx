import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatView from "./components/ChatView";
import IngestPanel from "./components/IngestPanel";
import { useTheme } from "./hooks/useTheme";
import { useConversations } from "./hooks/useConversations";
import { sendChatMessage, checkHealth, ApiError } from "./lib/api";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    conversations,
    activeConversation,
    activeId,
    startNewConversation,
    selectConversation,
    deleteConversation,
    addPendingExchange,
    resolveLastAssistantMessage,
  } = useConversations();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ingestOpen, setIngestOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [backendOffline, setBackendOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    checkHealth()
      .then(() => !cancelled && setBackendOffline(false))
      .catch(() => !cancelled && setBackendOffline(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSend = useCallback(
    async (question) => {
      const conversationId = addPendingExchange(question);
      setIsSending(true);
      const startedAt = performance.now();
      try {
        const result = await sendChatMessage(question);
        resolveLastAssistantMessage(conversationId, () => ({
          role: "assistant",
          answer: result.answer,
          sourceUsed: result.source_used,
          citations: result.citations ?? [],
          trace: result.trace ?? [],
          rewrittenQuery: result.rewritten_query,
          durationMs: performance.now() - startedAt,
        }));
        setBackendOffline(false);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Couldn't reach the HR Copilot backend. Check that the API server is running.";
        resolveLastAssistantMessage(conversationId, () => ({ role: "assistant", error: message }));
        if (!(err instanceof ApiError)) setBackendOffline(true);
      } finally {
        setIsSending(false);
      }
    },
    [addPendingExchange, resolveLastAssistantMessage],
  );

  const handleNewChat = () => {
    startNewConversation();
    setMobileSidebarOpen(false);
  };

  const handleSelect = (id) => {
    selectConversation(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-50 dark:bg-ink-950">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNewChat={handleNewChat}
          onDelete={deleteConversation}
          onOpenIngest={() => setIngestOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar
              collapsed={false}
              onToggleCollapsed={() => setMobileSidebarOpen(false)}
              conversations={conversations}
              activeId={activeId}
              onSelect={handleSelect}
              onNewChat={handleNewChat}
              onDelete={deleteConversation}
              onOpenIngest={() => {
                setIngestOpen(true);
                setMobileSidebarOpen(false);
              }}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>
        </div>
      )}

      <ChatView
        conversation={activeConversation}
        onSend={handleSend}
        isSending={isSending}
        onOpenSidebarMobile={() => setMobileSidebarOpen(true)}
        backendOffline={backendOffline}
      />

      {ingestOpen && <IngestPanel onClose={() => setIngestOpen(false)} />}
    </div>
  );
}
