// Core types for Forge Console

export type Sphere = 'forge' | 'orunmila';

export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export type SkillType = 'runtime' | 'infra' | 'ingest' | 'analysis' | 'xau' | 'macro';

export type MissionType = 'pipeline' | 'nightly' | 'weekly' | 'daily' | 'cycle';

export type ReportType = 'run' | 'daily' | 'nyo' | 'weekly' | 'postmortem' | 'diagnostic' | 'infra';

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  sphere: Sphere;
  lastRunTime?: string;
  lastRunStatus?: RunStatus;
  tags?: string[];
  config?: Record<string, any>;
  linkedMissions?: string[];
  canRun?: boolean;
  canEditConfig?: boolean;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  sphere: Sphere;
  lastRunTime?: string;
  lastRunStatus?: RunStatus;
  skills?: string[];
  steps?: MissionStep[];
  canRun?: boolean;
}

export interface MissionStep {
  order: number;
  skillId: string;
  skillName: string;
  dependsOn?: number[];
}

export interface Run {
  id: string;
  type: 'skill' | 'mission';
  name: string;
  sphere: Sphere;
  status: RunStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  triggerSource: 'manual' | 'scheduled' | 'api';
  skillId?: string;
  missionId?: string;
  reportId?: string;
  artifactIds?: string[];
  error?: string;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  sphere: Sphere;
  content: string;
  contentType: 'markdown' | 'json' | 'text' | 'html';
  relatedSkillId?: string;
  relatedMissionId?: string;
  relatedRunId?: string;
  createdAt: string;
  artifacts?: Artifact[];
}

export interface Artifact {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  createdAt: string;
  runId?: string;
  skillId?: string;
  missionId?: string;
}

export interface DailyState {
  date: string;
  regime: string;
  stance: string;
  confidence: number;
  keyLevels: {
    resistance: number[];
    support: number[];
  };
  technicalSnapshot: {
    d1: string;
    h4: string;
    h1: string;
    m15: string;
  };
  institutionalZones?: Array<{
    level: number;
    type: 'supply' | 'demand';
    strength: 'strong' | 'medium' | 'weak';
  }>;
  tradeIdeas?: Array<{
    id: string;
    direction: 'long' | 'short';
    entry: number;
    stop: number;
    target: number;
    rationale: string;
  }>;
}

export interface Cycle4WState {
  startDate: string;
  endDate: string;
  currentWeek: number;
  stance: string;
  lessons: string[];
  performance?: {
    wins: number;
    losses: number;
    winRate: number;
    profitFactor: number;
  };
}

export interface StructuralState {
  majorRegime: string;
  keyThemes: string[];
  structuralLevels: number[];
  lastUpdated: string;
}

export interface SystemStatus {
  overall: 'ok' | 'degraded' | 'critical';
  subsystems: Array<{
    name: string;
    status: 'ok' | 'warning' | 'error';
    message?: string;
  }>;
  lastCheck: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  sphere: Sphere;
  context?: {
    type: 'run' | 'report' | 'state' | 'skill' | 'mission';
    id: string;
    name: string;
  };
  messages: ChatMessage[];
  createdAt: string;
}

export interface Capability {
  id: string;
  sphere: Sphere;
  resource: 'skill' | 'mission' | 'run' | 'report';
  canRun: boolean;
  canEditConfig: boolean;
  canModifyRisk: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
