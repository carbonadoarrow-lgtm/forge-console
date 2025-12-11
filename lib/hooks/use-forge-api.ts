import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API_ENDPOINTS } from "./api-config"
import type { Skill, Mission, Run, Report, Artifact } from "./types"

// Fetch utilities
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

async function postJSON<T>(url: string, data: any): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Skills
export function useForgeSkills() {
  return useQuery({
    queryKey: ["forge", "skills"],
    queryFn: () => fetchJSON<Skill[]>(API_ENDPOINTS.forge.skills),
  })
}

export function useForgeSkill(id: string) {
  return useQuery({
    queryKey: ["forge", "skills", id],
    queryFn: () => fetchJSON<Skill>(API_ENDPOINTS.forge.skill(id)),
    enabled: !!id,
  })
}

export function useRunForgeSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postJSON<Run>(API_ENDPOINTS.forge.runSkill(id), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forge", "runs"] })
      queryClient.invalidateQueries({ queryKey: ["forge", "skills"] })
    },
  })
}

// Missions
export function useForgeMissions() {
  return useQuery({
    queryKey: ["forge", "missions"],
    queryFn: () => fetchJSON<Mission[]>(API_ENDPOINTS.forge.missions),
  })
}

export function useForgeMission(id: string) {
  return useQuery({
    queryKey: ["forge", "missions", id],
    queryFn: () => fetchJSON<Mission>(API_ENDPOINTS.forge.mission(id)),
    enabled: !!id,
  })
}

export function useRunForgeMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postJSON<Run>(API_ENDPOINTS.forge.runMission(id), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forge", "runs"] })
      queryClient.invalidateQueries({ queryKey: ["forge", "missions"] })
    },
  })
}

// Runs
export function useForgeRuns() {
  return useQuery({
    queryKey: ["forge", "runs"],
    queryFn: () => fetchJSON<Run[]>(API_ENDPOINTS.forge.runs),
  })
}

export function useForgeRun(id: string) {
  return useQuery({
    queryKey: ["forge", "runs", id],
    queryFn: () => fetchJSON<Run>(API_ENDPOINTS.forge.run(id)),
    enabled: !!id,
  })
}

export function useForgeRunLogs(id: string) {
  return useQuery({
    queryKey: ["forge", "runs", id, "logs"],
    queryFn: () => fetchJSON<{ logs: string[] }>(API_ENDPOINTS.forge.runLogs(id)),
    enabled: !!id,
    refetchInterval: 2000, // Poll every 2 seconds for active runs
  })
}

// Reports
export function useForgeReports() {
  return useQuery({
    queryKey: ["forge", "reports"],
    queryFn: () => fetchJSON<Report[]>(API_ENDPOINTS.forge.reports),
  })
}

export function useForgeReport(id: string) {
  return useQuery({
    queryKey: ["forge", "reports", id],
    queryFn: () => fetchJSON<Report>(API_ENDPOINTS.forge.report(id)),
    enabled: !!id,
  })
}

// Artifacts
export function useForgeArtifacts() {
  return useQuery({
    queryKey: ["forge", "artifacts"],
    queryFn: () => fetchJSON<Artifact[]>(API_ENDPOINTS.forge.artifacts),
  })
}

// System Status
export function useForgeSystemStatus() {
  return useQuery({
    queryKey: ["forge", "system", "status"],
    queryFn: () =>
      fetchJSON<{ status: string; subsystems: Record<string, string> }>(
        API_ENDPOINTS.forge.systemStatus
      ),
  })
}
