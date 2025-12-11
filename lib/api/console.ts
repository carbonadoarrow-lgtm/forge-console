import { apiClient } from "./client";
import {
  ConsoleChatSession,
  ConsoleMissionReport,
  ConsoleJob,
  ConsoleJobStatus,
} from "../types";

export const consoleApi = {
  getChatSessions: () =>
    apiClient.get<ConsoleChatSession[]>("/api/console/chat/sessions"),

  getMissionReports: (missionId: string) =>
    apiClient.get<ConsoleMissionReport[]>(
      `/api/console/missions/${missionId}/reports`,
    ),

  // Jobs endpoints
  listJobs: () => apiClient.get<ConsoleJob[]>("/api/console/jobs"),

  getJob: (id: string) =>
    apiClient.get<ConsoleJob>(`/api/console/jobs/${id}`),

  createJob: (job: ConsoleJob) =>
    apiClient.post<ConsoleJob>("/api/console/jobs", job),

  updateJobStatus: (id: string, status: ConsoleJobStatus) =>
    apiClient.patch<ConsoleJob>(`/api/console/jobs/${id}/status?status=${status}`),
};
