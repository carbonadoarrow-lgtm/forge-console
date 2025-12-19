import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orunmilaSkillsApi, orunmilaMissionsApi, orunmilaRunsApi, orunmilaReportsApi, orunmilaStateApi, orunmilaOracleApi } from '../api/orunmila';

// Skills Hooks
export const useOrunmilaSkills = () => {
  return useQuery({
    queryKey: ['orunmila', 'skills'],
    queryFn: orunmilaSkillsApi.getAll,
  });
};

export const useOrunmilaSkill = (id: string) => {
  return useQuery({
    queryKey: ['orunmila', 'skills', id],
    queryFn: () => orunmilaSkillsApi.getById(id),
    enabled: !!id,
  });
};

export const useRunOrunmilaSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params?: any }) =>
      orunmilaSkillsApi.run(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orunmila', 'runs'] });
      queryClient.invalidateQueries({ queryKey: ['orunmila', 'skills'] });
    },
  });
};

// Missions Hooks
export const useOrunmilaMissions = () => {
  return useQuery({
    queryKey: ['orunmila', 'missions'],
    queryFn: orunmilaMissionsApi.getAll,
  });
};

export const useOrunmilaMission = (id: string) => {
  return useQuery({
    queryKey: ['orunmila', 'missions', id],
    queryFn: () => orunmilaMissionsApi.getById(id),
    enabled: !!id,
  });
};

export const useRunOrunmilaMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params?: any }) =>
      orunmilaMissionsApi.run(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orunmila', 'runs'] });
      queryClient.invalidateQueries({ queryKey: ['orunmila', 'missions'] });
    },
  });
};

// Runs Hooks
export const useOrunmilaRuns = () => {
  return useQuery({
    queryKey: ['orunmila', 'runs'],
    queryFn: orunmilaRunsApi.getAll,
  });
};

export const useOrunmilaRun = (id: string) => {
  return useQuery({
    queryKey: ['orunmila', 'runs', id],
    queryFn: () => orunmilaRunsApi.getById(id),
    enabled: !!id,
  });
};

export const useOrunmilaRunLogs = (id: string) => {
  return useQuery({
    queryKey: ['orunmila', 'runs', id, 'logs'],
    queryFn: () => orunmilaRunsApi.getLogs(id),
    enabled: !!id,
    refetchInterval: 2000,
  });
};

// Reports Hooks
export const useOrunmilaReports = () => {
  return useQuery({
    queryKey: ['orunmila', 'reports'],
    queryFn: orunmilaReportsApi.getAll,
  });
};

export const useOrunmilaReport = (id: string) => {
  return useQuery({
    queryKey: ['orunmila', 'reports', id],
    queryFn: () => orunmilaReportsApi.getById(id),
    enabled: !!id,
  });
};

// State Hooks
export const useOrunmilaDailyState = () => {
  return useQuery({
    queryKey: ['orunmila', 'state', 'daily'],
    queryFn: orunmilaStateApi.getDaily,
  });
};

export const useOrunmilaDailyStateHistory = () => {
  return useQuery({
    queryKey: ['orunmila', 'state', 'daily', 'history'],
    queryFn: orunmilaStateApi.getDailyHistory,
  });
};

export const useOrunmilaCycleState = () => {
  return useQuery({
    queryKey: ['orunmila', 'state', 'cycle-4w'],
    queryFn: orunmilaStateApi.getCycle4W,
  });
};

export const useOrunmilaStructuralState = () => {
  return useQuery({
    queryKey: ['orunmila', 'state', 'structural'],
    queryFn: orunmilaStateApi.getStructural,
  });
};

// Oracle Dashboard Hook
export const useOrunmilaOracleDashboard = () => {
  return useQuery({
    queryKey: ['orunmila', 'oracle', 'dashboard'],
    queryFn: orunmilaOracleApi.getDashboard,
  });
};
