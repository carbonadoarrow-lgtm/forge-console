"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forgeMissionReportsApi } from "../api/forge";
import { MissionReport } from "../types";

// Hook to get all reports for a mission
export function useMissionReports(missionId: string | null) {
  return useQuery({
    queryKey: ["forge", "missions", missionId, "reports"],
    queryFn: () => forgeMissionReportsApi.getReports(missionId!),
    enabled: !!missionId,
  });
}

// Hook to generate a new mission report
export function useGenerateMissionReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (missionId: string) => forgeMissionReportsApi.generateReport(missionId),
    onSuccess: (_, missionId) => {
      queryClient.invalidateQueries({ queryKey: ["forge", "missions", missionId, "reports"] });
    },
  });
}
