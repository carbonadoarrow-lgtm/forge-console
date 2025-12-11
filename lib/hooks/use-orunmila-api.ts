import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API_ENDPOINTS } from "../api-config"
import type { Skill, Mission, Run, Report, DailyState, CycleState, StructuralState } from "../types"

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
export function useOrunmilaSkills() {
  return useQuery({
    queryKey: ["orunmila", "skills"],
    queryFn: () => fetchJSON<Skill[]>(API_ENDPOINTS.orunmila.skills),
  })
}

export function useOrunmilaSkill(id: string) {
  return useQuery({
    queryKey: ["orunmila", "skills", id],
    queryFn: () => fetchJSON<Skill>(API_ENDPOINTS.orunmila.skill(id)),
    enabled: !!id,
  })
}

export function useRunOrunmilaSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postJSON<Run>(API_ENDPOINTS.orunmila.runSkill(id), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orunmila", "runs"] })
      queryClient.invalidateQueries({ queryKey: ["orunmila", "skills"] })
    },
  })
}

// Missions
export function useOrunmilaMissions() {
  return useQuery({
    queryKey: ["orunmila", "missions"],
    queryFn: () => fetchJSON<Mission[]>(API_ENDPOINTS.orunmila.missions),
  })
}

export function useOrunmilaMission(id: string) {
  return useQuery({
    queryKey: ["orunmila", "missions", id],
    queryFn: () => fetchJSON<Mission>(API_ENDPOINTS.orunmila.mission(id)),
    enabled: !!id,
  })
}

export function useRunOrunmilaMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postJSON<Run>(API_ENDPOINTS.orunmila.runMission(id), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orunmila", "runs"] })
      queryClient.invalidateQueries({ queryKey: ["orunmila", "missions"] })
    },
  })
}

// Runs
export function useOrunmilaRuns() {
  return useQuery({
    queryKey: ["orunmila", "runs"],
    queryFn: () => fetchJSON<Run[]>(API_ENDPOINTS.orunmila.runs),
  })
}

export function useOrunmilaRun(id: string) {
  return useQuery({
    queryKey: ["orunmila", "runs", id],
    queryFn: () => fetchJSON<Run>(API_ENDPOINTS.orunmila.run(id)),
    enabled: !!id,
  })
}

export function useOrunmilaRunLogs(id: string) {
  return useQuery({
    queryKey: ["orunmila", "runs", id, "logs"],
    queryFn: () => fetchJSON<{ logs: string[] }>(API_ENDPOINTS.orunmila.runLogs(id)),
    enabled: !!id,
    refetchInterval: 2000,
  })
}

// Reports
export function useOrunmilaReports() {
  return useQuery({
    queryKey: ["orunmila", "reports"],
    queryFn: () => fetchJSON<Report[]>(API_ENDPOINTS.orunmila.reports),
  })
}

export function useOrunmilaReport(id: string) {
  return useQuery({
    queryKey: ["orunmila", "reports", id],
    queryFn: () => fetchJSON<Report>(API_ENDPOINTS.orunmila.report(id)),
    enabled: !!id,
  })
}

// States
export function useDailyState() {
  return useQuery({
    queryKey: ["orunmila", "state", "daily"],
    queryFn: () => fetchJSON<DailyState>(API_ENDPOINTS.orunmila.dailyState),
  })
}

export function useDailyStateHistory() {
  return useQuery({
    queryKey: ["orunmila", "state", "daily", "history"],
    queryFn: () => fetchJSON<DailyState[]>(API_ENDPOINTS.orunmila.dailyStateHistory),
  })
}

export function useCycleState() {
  return useQuery({
    queryKey: ["orunmila", "state", "cycle"],
    queryFn: () => fetchJSON<CycleState>(API_ENDPOINTS.orunmila.cycleState),
  })
}

export function useStructuralState() {
  return useQuery({
    queryKey: ["orunmila", "state", "structural"],
    queryFn: () => fetchJSON<StructuralState>(API_ENDPOINTS.orunmila.structuralState),
  })
}

// Oracle Dashboard
export function useOracleDashboard() {
  return useQuery({
    queryKey: ["orunmila", "oracle", "dashboard"],
    queryFn: () =>
      fetchJSON<{
        dxy: number
        us10y: number
        vix: number
        regime: string
        stance: string
      }>(API_ENDPOINTS.orunmila.oracleDashboard),
  })
}
