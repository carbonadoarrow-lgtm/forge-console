"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consoleChatApi } from "../api/console-chat";
import { ConsoleChatSession, ConsoleChatMessage } from "../types";

/**
 * React Query hooks for Console Chat - operator chat with Forge OS.
 */

// Hook to list all console chat sessions
export function useConsoleChatSessions() {
  return useQuery({
    queryKey: ["console-chat", "sessions"],
    queryFn: () => consoleChatApi.listSessions(),
  });
}

// Hook to get a specific console chat session
export function useConsoleChatSession(sessionId: string | null) {
  return useQuery({
    queryKey: ["console-chat", "sessions", sessionId],
    queryFn: () => consoleChatApi.getSession(sessionId!),
    enabled: !!sessionId,
  });
}

// Hook to get messages for a console chat session
export function useConsoleChatMessages(sessionId: string | null) {
  return useQuery<ConsoleChatMessage[]>({
    queryKey: ["console-chat", "sessions", sessionId, "messages"],
    queryFn: () => consoleChatApi.listMessages(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 2000, // Auto-refresh every 2 seconds
  });
}

// Hook to create a new console chat session
export function useCreateConsoleChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title?: string; sphere?: string; context?: any }) =>
      consoleChatApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["console-chat", "sessions"] });
    },
  });
}

// Hook to send a message in a console chat session
export function useSendConsoleChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { sessionId: string; content: string }) =>
      consoleChatApi.sendMessage(vars.sessionId, vars.content),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["console-chat", "sessions", vars.sessionId, "messages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["console-chat", "sessions", vars.sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["console-chat", "sessions"] });
    },
  });
}

// Hook to mark a session as read
export function useMarkConsoleChatRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => consoleChatApi.markRead(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: ["console-chat", "sessions", sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["console-chat", "sessions"] });
    },
  });
}
