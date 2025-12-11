export type Sphere = "forge" | "orunmila"

export type RunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled"

export type SystemStatus = "ok" | "warning" | "error" | "degraded"

export interface Skill {
  id: string
  name: string
  description: string
  type: string
  sphere: Sphere
  lastRunTime?: string
  lastRunStatus?: RunStatus
  tags?: string[]
  config?: Record<string, any>
  can_run?: boolean
  can_edit_config?: boolean
}

export interface Mission {
  id: string
  name: string
  description: string
  type: string
  sphere: Sphere
  lastRunTime?: string
  lastRunStatus?: RunStatus
  skills?: string[]
  can_run?: boolean
}

export interface Run {
  id: string
  type: "skill" | "mission"
  name: string
  skillId?: string
  missionId?: string
  sphere: Sphere
  status: RunStatus
  startTime: string
  endTime?: string
  duration?: number
  triggerSource: "manual" | "scheduled" | "api"
  reportId?: string
  error?: string
}

export interface Report {
  id: string
  title: string
  type: string
  relatedSkillId?: string
  relatedMissionId?: string
  relatedRunId?: string
  sphere: Sphere
  content: string
  contentType: "markdown" | "json" | "text" | "html"
  createdAt: string
}

export interface Artifact {
  id: string
  path: string
  name: string
  type: string
  size: number
  runId: string
  sphere: Sphere
  createdAt: string
  url?: string
}

export interface DailyState {
  date: string
  regime: string
  stance: string
  confidence: number
  keyLevels: {
    resistance: number[]
    support: number[]
  }
  technical: {
    d1: string
    h4: string
    h1: string
    m15: string
  }
  institutionalZones?: any[]
  tradeIdeas?: any[]
}

export interface CycleState {
  startDate: string
  endDate: string
  stance: string
  lessons: string[]
  performance?: {
    trades: number
    wins: number
    losses: number
    pnl: number
  }
}

export interface StructuralState {
  longTerm: string
  majorLevels: number[]
  notes: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: "user" | "assistant" | "system" | "tool"
  content: string
  created_at: string
  meta: Record<string, any>
}

export interface ChatSession {
  id: string
  title: string
  sphere: Sphere
  created_at: string
  updated_at: string
  pinned: boolean
  context: Record<string, any>
}

export interface MissionReport {
  id: string
  mission_id: string
  sphere: Sphere
  generated_at: string
  timeframe_start?: string | null
  timeframe_end?: string | null
  status: "ok" | "warning" | "error"
  stats: Record<string, any>
  highlights: string[]
  recommendations: string[]
  raw_markdown: string
  generated_by: string
}

// Console Chat (operator chat with Forge OS)
export type ConsoleChatRole = "user" | "assistant" | "system"

export interface ConsoleChatMessage {
  id: string
  session_id: string
  role: ConsoleChatRole
  content: string
  created_at: string
  meta: Record<string, any>
}

export interface ConsoleChatSession {
  id: string;
  title: string;
  sphere: Sphere;
  created_at: string; // ISO timestamp from backend
  updated_at: string; // ISO timestamp from backend
  last_message_preview: string;
  unread_count: number;
  context: Record<string, any>;
}

export interface NavItem {
  title: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

export interface Capabilities {
  id: string
  sphere: Sphere
  resource: "skill" | "mission" | "run" | "report"
  can_run?: boolean
  can_edit_config?: boolean
  can_modify_risk?: boolean
  can_delete?: boolean
}

// Console Activity Hub types (forge-os console API)

export type ConsoleJobStatus = "pending" | "running" | "succeeded" | "failed";

export interface ConsoleMissionReport {
  id: string;
  mission_id: string;
  generated_at: string; // ISO timestamp
  status: "ok" | "warning" | "error";
  summary?: string | null;
  stats?: Record<string, any>;
}

export interface ConsoleJob {
  id: string;
  name: string;
  status: ConsoleJobStatus;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  sphere: "forge" | "orunmila";
  error_message?: string | null;
}
