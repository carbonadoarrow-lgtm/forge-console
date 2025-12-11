import { apiClient } from './client';
import { Skill, Mission, Run, Report, DailyState, Cycle4WState, StructuralState } from '../types';

// Orunmila Skills API
export const orunmilaSkillsApi = {
  getAll: () => apiClient.get<Skill[]>('/api/orunmila/skills'),
  getById: (id: string) => apiClient.get<Skill>(`/api/orunmila/skills/${id}`),
  run: (id: string, params?: any) => apiClient.post<Run>(`/api/orunmila/skills/${id}/run`, params),
};

// Orunmila Missions API
export const orunmilaMissionsApi = {
  getAll: () => apiClient.get<Mission[]>('/api/orunmila/missions'),
  getById: (id: string) => apiClient.get<Mission>(`/api/orunmila/missions/${id}`),
  run: (id: string, params?: any) => apiClient.post<Run>(`/api/orunmila/missions/${id}/run`, params),
};

// Orunmila Runs API
export const orunmilaRunsApi = {
  getAll: () => apiClient.get<Run[]>('/api/orunmila/runs'),
  getById: (id: string) => apiClient.get<Run>(`/api/orunmila/runs/${id}`),
  getLogs: (id: string) => apiClient.get<string>(`/api/orunmila/runs/${id}/logs`),
};

// Orunmila Reports API
export const orunmilaReportsApi = {
  getAll: () => apiClient.get<Report[]>('/api/orunmila/reports'),
  getById: (id: string) => apiClient.get<Report>(`/api/orunmila/reports/${id}`),
};

// Orunmila State API
export const orunmilaStateApi = {
  getDaily: () => apiClient.get<DailyState>('/api/orunmila/state/daily'),
  getDailyHistory: () => apiClient.get<DailyState[]>('/api/orunmila/state/daily/history'),
  getCycle4W: () => apiClient.get<Cycle4WState>('/api/orunmila/state/cycle-4w'),
  getStructural: () => apiClient.get<StructuralState>('/api/orunmila/state/structural'),
};

// Orunmila Oracle Dashboard API
export const orunmilaOracleApi = {
  getDashboard: () => apiClient.get<any>('/api/orunmila/oracle/dashboard'),
};
