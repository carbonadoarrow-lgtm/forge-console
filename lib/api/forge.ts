import { apiClient } from './client';
import { Skill, Mission, Run, Report, Artifact, SystemStatus, MissionReport } from '../types';

// Forge Skills API
export const forgeSkillsApi = {
  getAll: () => apiClient.get<Skill[]>('/api/forge/skills'),
  getById: (id: string) => apiClient.get<Skill>(`/api/forge/skills/${id}`),
  run: (id: string, params?: any) => apiClient.post<Run>(`/api/forge/skills/${id}/run`, params),
};

// Forge Missions API
export const forgeMissionsApi = {
  getAll: () => apiClient.get<Mission[]>('/api/forge/missions'),
  getById: (id: string) => apiClient.get<Mission>(`/api/forge/missions/${id}`),
  run: (id: string, params?: any) => apiClient.post<Run>(`/api/forge/missions/${id}/run`, params),
};

// Forge Runs API
export const forgeRunsApi = {
  getAll: () => apiClient.get<Run[]>('/api/forge/runs'),
  getById: (id: string) => apiClient.get<Run>(`/api/forge/runs/${id}`),
  getLogs: (id: string) => apiClient.get<string>(`/api/forge/runs/${id}/logs`),
};

// Forge Reports API
export const forgeReportsApi = {
  getAll: () => apiClient.get<Report[]>('/api/forge/reports'),
  getById: (id: string) => apiClient.get<Report>(`/api/forge/reports/${id}`),
};

// Forge Artifacts API
export const forgeArtifactsApi = {
  getAll: (filters?: any) => apiClient.get<Artifact[]>('/api/forge/artifacts'),
  getById: (id: string) => apiClient.get<Artifact>(`/api/forge/artifacts/${id}`),
};

// Forge System API
export const forgeSystemApi = {
  getStatus: () => apiClient.get<SystemStatus>('/api/forge/system/status'),
};

// Forge Mission Reports API
export const forgeMissionReportsApi = {
  getReports: (missionId: string) =>
    apiClient.get<MissionReport[]>(`/api/forge/missions/${missionId}/reports`),
  generateReport: (missionId: string) =>
    apiClient.post<MissionReport>(`/api/forge/missions/${missionId}/reports/generate`),
};
