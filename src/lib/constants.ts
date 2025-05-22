
import { 
  LayoutDashboard, 
  ShieldAlert, 
  KanbanSquare, 
  Users, 
  UserCog, 
  Briefcase,
  DollarSign,
  CalendarDays,
  TrendingUp,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  type LucideIcon 
} from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/consultants', label: 'Consultants', icon: UserCog },
  { href: '/finances', label: 'Finances', icon: DollarSign },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/risk-analyzer', label: 'AI Risk Analyzer', icon: ShieldAlert },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
  { href: '/help', label: 'Help', icon: HelpCircle },
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

export const CONSULTANT_STATUS_COLORS: Record<string, string> = {
  Available: 'bg-green-500/20 text-green-700 border-green-500 dark:bg-green-500/30 dark:text-green-300 dark:border-green-500/70',
  'On Project': 'bg-blue-500/20 text-blue-700 border-blue-500 dark:bg-blue-500/30 dark:text-blue-300 dark:border-blue-500/70',
  Unavailable: 'bg-gray-500/20 text-gray-700 border-gray-500 dark:bg-gray-500/30 dark:text-gray-300 dark:border-gray-500/70',
};

export const CONSULTANT_STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Available: 'default',
  'On Project': 'outline',
  Unavailable: 'secondary',
};

