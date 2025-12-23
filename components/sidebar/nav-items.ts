import { Persona } from "@/lib/persona/persona";
import {
  Home,
  Zap,
  Target,
  Play,
  FileText,
  Package,
  Settings,
  Activity,
  TrendingUp,
  Calendar,
  Database,
  MessageSquare,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  personas?: Persona[];
};

export const forgeNav: NavItem[] = [
  {
    title: "Activity",
    children: [
      { title: "Overview", href: "/forge/activity", icon: Activity, personas: ["leto", "member"] },
      { title: "Chat", href: "/forge/chat", icon: MessageSquare, personas: ["leto", "member"] },
      { title: "Reports", href: "/forge/missions/mission-1/reports", icon: FileText, personas: ["leto", "member"] },
      { title: "Jobs", href: "/forge/jobs", icon: Briefcase, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
  { title: "Overview", href: "/forge", icon: Home, personas: ["leto", "member"] },
  {
    title: "Execution",
    children: [
      { title: "Skills", href: "/forge/skills", icon: Zap, personas: ["leto", "member"] },
      { title: "Missions", href: "/forge/missions", icon: Target, personas: ["leto", "member"] },
      { title: "Runs", href: "/forge/runs", icon: Play, personas: ["leto", "member"] },
      { title: "Builder Cockpit", href: "/forge/builder", icon: Activity, personas: ["leto", "member"] },
      { title: "New Builder Run", href: "/forge/builder/new", icon: Play, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
  {
    title: "Knowledge & Reports",
    children: [
      { title: "Reports", href: "/forge/reports", icon: FileText, personas: ["leto", "member"] },
      { title: "Artifacts", href: "/forge/artifacts", icon: Package, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
  {
    title: "System",
    children: [
      { title: "Status", href: "/forge/system", icon: Activity, personas: ["leto", "member"] },
      { title: "Settings", href: "/forge/settings", icon: Settings, personas: ["leto"] },
    ],
    personas: ["leto", "member"],
  },
  // Admin-only section for LETO
  {
    title: "Admin",
    personas: ["leto"],
    children: [
      { title: "Approvals", href: "/admin/approvals", icon: CheckCircle, personas: ["leto"] },
      { title: "Publish Queue", href: "/admin/publish-queue", icon: Clock, personas: ["leto"] },
    ],
  },
];

export const orunmilaNav: NavItem[] = [
  { title: "Oracle Overview", href: "/orunmila", icon: Home, personas: ["leto", "member"] },
  {
    title: "Execution",
    children: [
      { title: "XAU Skills", href: "/orunmila/skills", icon: Zap, personas: ["leto", "member"] },
      { title: "Missions", href: "/orunmila/missions", icon: Target, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
  {
    title: "State",
    children: [
      { title: "Daily State", href: "/orunmila/state/daily", icon: Calendar, personas: ["leto", "member"] },
      { title: "4-Week Cycle State", href: "/orunmila/state/cycle-4w", icon: TrendingUp, personas: ["leto", "member"] },
      { title: "Structural State", href: "/orunmila/state/structural", icon: Database, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
  {
    title: "Knowledge & Reports",
    children: [
      { title: "Reports", href: "/orunmila/reports", icon: FileText, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
  {
    title: "System",
    children: [
      { title: "Oracle Dashboard", href: "/orunmila/oracle", icon: Activity, personas: ["leto", "member"] },
    ],
    personas: ["leto", "member"],
  },
];

// Member-only navigation (for member area)
export const memberNav: NavItem[] = [
  { title: "My Feed", href: "/member", icon: Home, personas: ["member"] },
  { title: "Reports", href: "/member/reports", icon: FileText, personas: ["member"] },
  { title: "Circle Members", href: "/member/members", icon: Users, personas: ["member"] },
];
