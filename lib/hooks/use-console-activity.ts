"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consoleApi } from "../api/console";
import {
  ConsoleChatSession,
  ConsoleMissionReport,
  ConsoleJob,
  ConsoleJobStatus,
} from "../types";

export function useConsoleChatSessions() {
  return useQuery<ConsoleChatSession[]>({
    queryKey: ["console-chat", "sessions"],
    queryFn: () => consoleApi.getChatSessions(),
  });
}

export function useConsoleMissionReports(missionId: string | null) {
  return useQuery<ConsoleMissionReport[]>({
    queryKey: ["console", "missions", missionId, "reports"],
    queryFn: () => consoleApi.getMissionReports(missionId!),
    enabled: !!missionId,
  });
}

export function useConsoleJobs() {
  return useQuery<ConsoleJob[]>({
    queryKey: ["console", "jobs"],
    queryFn: () => consoleApi.listJobs(),
    refetchInterval: 5000, // light polling
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ConsoleJobStatus }) =>
      consoleApi.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["console", "jobs"] });
    },
  });
}
