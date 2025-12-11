import { apiClient } from "./client";
import { ChatSession, ChatMessage } from "../types";

export const chatApi = {
  // List all chat sessions
  listSessions: () =>
    apiClient.get<ChatSession[]>("/api/chat/sessions"),

  // Create a new chat session
  createSession: (data: { title?: string; sphere?: string; context?: any }) =>
    apiClient.post<ChatSession>("/api/chat/sessions", data),

  // Get a specific session
  getSession: (id: string) =>
    apiClient.get<ChatSession>(`/api/chat/sessions/${id}`),

  // List messages for a session
  listMessages: (sessionId: string) =>
    apiClient.get<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`),

  // Send a message in a session
  sendMessage: (sessionId: string, content: string) =>
    apiClient.post<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`, {
      content,
    }),

  // (Optional) stream URL helper
  getStreamUrl: (sessionId: string) =>
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    }/api/chat/sessions/${sessionId}/stream`,
};
