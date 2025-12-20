import { apiClient } from "./client";
import {
  ConsoleChatSession,
  ConsoleMissionReport,
  ConsoleJob,
  ConsoleJobStatus,
} from "../types";

export const consoleApi = {
  getChatSessions: () =>
    apiClient.get<ConsoleChatSession[]>("/chat/sessions"),

  getMissionReports: (missionId: string) =>
    apiClient.get<ConsoleMissionReport[]>(
      `/forge/missions/${missionId}/reports`,
    ),

  // Jobs endpoints - using /forge/jobs as that's what the backend provides
  listJobs: () => apiClient.get<ConsoleJob[]>("/forge/jobs"),

  getJob: (id: string) =>
    apiClient.get<ConsoleJob>(`/forge/jobs/${id}`),

  createJob: (job: ConsoleJob) =>
    apiClient.post<ConsoleJob>("/forge/jobs", job),

  updateJobStatus: (id: string, status: ConsoleJobStatus) =>
    apiClient.patch<ConsoleJob>(`/forge/jobs/${id}/status?status=${status}`),
};
