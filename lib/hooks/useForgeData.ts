import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forgeSkillsApi, forgeMissionsApi, forgeRunsApi, forgeReportsApi, forgeArtifactsApi, forgeSystemApi } from '../api/forge';

// Skills Hooks
export const useForgeSkills = () => {
  return useQuery({
    queryKey: ['forge', 'skills'],
    queryFn: forgeSkillsApi.getAll,
  });
};

export const useForgeSkill = (id: string) => {
  return useQuery({
    queryKey: ['forge', 'skills', id],
    queryFn: () => forgeSkillsApi.getById(id),
    enabled: !!id,
  });
};

export const useRunForgeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params?: any }) =>
      forgeSkillsApi.run(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forge', 'runs'] });
      queryClient.invalidateQueries({ queryKey: ['forge', 'skills'] });
    },
  });
};

// Missions Hooks
export const useForgeMissions = () => {
  return useQuery({
    queryKey: ['forge', 'missions'],
    queryFn: forgeMissionsApi.getAll,
  });
};

export const useForgeMission = (id: string) => {
  return useQuery({
    queryKey: ['forge', 'missions', id],
    queryFn: () => forgeMissionsApi.getById(id),
    enabled: !!id,
  });
};

export const useRunForgeMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params?: any }) =>
      forgeMissionsApi.run(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forge', 'runs'] });
      queryClient.invalidateQueries({ queryKey: ['forge', 'missions'] });
    },
  });
};

// Runs Hooks
export const useForgeRuns = () => {
  return useQuery({
    queryKey: ['forge', 'runs'],
    queryFn: forgeRunsApi.getAll,
  });
};

export const useForgeRun = (id: string) => {
  return useQuery({
    queryKey: ['forge', 'runs', id],
    queryFn: () => forgeRunsApi.getById(id),
    enabled: !!id,
  });
};

export const useForgeRunLogs = (id: string) => {
  return useQuery({
    queryKey: ['forge', 'runs', id, 'logs'],
    queryFn: () => forgeRunsApi.getLogs(id),
    enabled: !!id,
    refetchInterval: 2000, // Poll every 2 seconds for active runs
  });
};

// Reports Hooks
export const useForgeReports = () => {
  return useQuery({
    queryKey: ['forge', 'reports'],
    queryFn: forgeReportsApi.getAll,
  });
};

export const useForgeReport = (id: string) => {
  return useQuery({
    queryKey: ['forge', 'reports', id],
    queryFn: () => forgeReportsApi.getById(id),
    enabled: !!id,
  });
};

// Artifacts Hooks
export const useForgeArtifacts = (filters?: any) => {
  return useQuery({
    queryKey: ['forge', 'artifacts', filters],
    queryFn: () => forgeArtifactsApi.getAll(filters),
  });
};

// System Hooks
export const useForgeSystemStatus = () => {
  return useQuery({
    queryKey: ['forge', 'system', 'status'],
    queryFn: forgeSystemApi.getStatus,
    refetchInterval: 30000, // Poll every 30 seconds
  });
};
