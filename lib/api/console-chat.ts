import { apiClient } from "./client";
import { ConsoleChatSession, ConsoleChatMessage } from "../types";

/**
 * Console Chat API - Operator chat interface with Forge OS.
 *
 * This is separate from mission/context-specific chat - it's dedicated for
 * operators to interact with Forge OS for general queries, troubleshooting,
 * and advisory conversations.
 */
export const consoleChatApi = {
  // List all console chat sessions
  listSessions: () =>
    apiClient.get<ConsoleChatSession[]>("/console/chat/sessions"),

  // Create a new console chat session
  createSession: (data: { title?: string; sphere?: string; context?: any }) =>
    apiClient.post<ConsoleChatSession>("/console/chat/sessions", data),

  // Get a specific console chat session
  getSession: (sessionId: string) =>
    apiClient.get<ConsoleChatSession>(`/api/console/chat/sessions/${sessionId}`),

  // List messages for a console chat session
  listMessages: (sessionId: string) =>
    apiClient.get<ConsoleChatMessage[]>(
      `/api/console/chat/sessions/${sessionId}/messages`
    ),

  // Send a message in a console chat session
  sendMessage: (sessionId: string, content: string) =>
    apiClient.post<ConsoleChatMessage[]>(
      `/api/console/chat/sessions/${sessionId}/messages`,
      { content }
    ),

  // Mark a session as read
  markRead: (sessionId: string) =>
    apiClient.post(`/api/console/chat/sessions/${sessionId}/mark-read`),
};
