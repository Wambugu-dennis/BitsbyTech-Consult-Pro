import { LayoutDashboard, ShieldAlert, KanbanSquare, Users, type LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/risk-analyzer', label: 'AI Risk Analyzer', icon: ShieldAlert },
  { href: '/projects', label: 'Project Tracker', icon: KanbanSquare },
  { href: '/clients', label: 'Client Repository', icon: Users },
];

export const PROJECT_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;

export const RISK_LEVEL_COLORS: Record<string, string> = {
  Low: "text-green-600 dark:text-green-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  High: "text-red-600 dark:text-red-400",
};
