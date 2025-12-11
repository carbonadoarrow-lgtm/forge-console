"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat";
import { ChatSession, ChatMessage } from "../types";

// Hook to list all chat sessions
export function useChatSessions() {
  return useQuery({
    queryKey: ["chat", "sessions"],
    queryFn: () => chatApi.listSessions(),
  });
}

// Hook to get a specific session
export function useChatSession(sessionId: string | null) {
  return useQuery({
    queryKey: ["chat", "sessions", sessionId],
    queryFn: () => chatApi.getSession(sessionId!),
    enabled: !!sessionId,
  });
}

// Hook to get messages for a session
export function useChatMessages(sessionId: string | null) {
  return useQuery({
    queryKey: ["chat", "sessions", sessionId, "messages"],
    queryFn: () => chatApi.listMessages(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 2000, // Auto-refresh every 2 seconds
  });
}

// Hook to create a new session
export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title?: string; sphere?: string; context?: any }) =>
      chatApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "sessions"] });
    },
  });
}

// Hook to send a message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      chatApi.sendMessage(sessionId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "sessions", variables.sessionId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["chat", "sessions", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["chat", "sessions"] });
    },
  });
}
