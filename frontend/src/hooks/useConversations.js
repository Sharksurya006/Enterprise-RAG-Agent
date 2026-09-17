import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hr-copilot-conversations";
const TITLE_MAX_LENGTH = 48;

function makeId() {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function deriveTitle(question) {
  const trimmed = question.trim().replace(/\s+/g, " ");
  if (trimmed.length <= TITLE_MAX_LENGTH) return trimmed;
  return `${trimmed.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`;
}

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeId, setActiveId] = useState(() => conversations[0]?.id ?? null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const startNewConversation = useCallback(() => {
    setActiveId(null);
  }, []);

  const selectConversation = useCallback((id) => {
    setActiveId(id);
  }, []);

  const deleteConversation = useCallback(
    (id) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveId((current) => (current === id ? null : current));
    },
    [],
  );

  const renameConversation = useCallback((id, title) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  
  const resolveLastAssistantMessage = useCallback((conversationId, updater) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages];
        const lastIndex = messages.length - 1;
        if (lastIndex < 0 || messages[lastIndex].role !== "assistant") return c;
        const resolved = updater(messages[lastIndex]);
        if (resolved === null) {
          messages.pop();
        } else {
          messages[lastIndex] = resolved;
        }
        return { ...c, messages, updatedAt: Date.now() };
      }),
    );
  }, []);

    const addPendingExchange = useCallback(
    (question) => {
      // Decide the id synchronously, before touching state.
      const conversationId = activeId ?? makeId();

      setConversations((prev) => {
        const userMessage = { role: "user", content: question, createdAt: Date.now() };
        const placeholder = { role: "assistant", pending: true, createdAt: Date.now() };

        if (activeId) {
          return prev.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, userMessage, placeholder], updatedAt: Date.now() }
              : c,
          );
        }

        const newConversation = {
          id: conversationId,
          title: deriveTitle(question),
          messages: [userMessage, placeholder],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return [newConversation, ...prev];
      });
      setActiveId(conversationId);
      return conversationId;
    },
    [activeId],
  );

  return {
    conversations,
    activeConversation,
    activeId,
    startNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    addPendingExchange,
    resolveLastAssistantMessage,
  };
}