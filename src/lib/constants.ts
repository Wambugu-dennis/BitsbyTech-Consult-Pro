
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  UserCog,
  Briefcase,
  DollarSign,
  CalendarDays,
  TrendingUp,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  FileText,
  Receipt,
  Target,
  Landmark,
  PieChart as PieChartIconLucide,
  Brain,
  Users2,
  User, // Keep for Analytics sub-item
  BellRing,
  Paintbrush,
  Languages,
  CreditCard,
  ShieldCheck,
  Link2,
  Workflow,
  Server,
  ListChecks, // For Analytics sub-item
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string; // This will be used as the translation key
  icon: LucideIcon;
  subItems?: NavLink[];
}

export const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/consultants', label: 'Consultants', icon: UserCog },
  {
    href: '/finances',
    label: 'Finances',
    icon: DollarSign,
    subItems: [
      { href: '/finances', label: 'Finances Overview', icon: DollarSign },
      { href: '/finances/invoices', label: 'Invoices', icon: FileText },
      { href: '/finances/expenses', label: 'Expenses', icon: Receipt },
      { href: '/finances/budgets', label: 'Budgets', icon: Target },
      { href: '/finances/revenue-recognition', label: 'Revenue Recognition', icon: Landmark },
      { href: '/finances/profitability', label: 'Profitability Analysis', icon: PieChartIconLucide },
    ],
  },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: TrendingUp,
    subItems: [
        { href: '/analytics', label: 'Analytics Overview', icon: TrendingUp },
        { href: '/analytics/project-success-report', label: 'Project Success', icon: Briefcase }, // Changed icon to ListChecks for variety if desired, or keep Briefcase
        { href: '/analytics/client-relationship-report', label: 'Client Relationships', icon: Users2 },
        { href: '/analytics/consultant-performance-report', label: 'Consultant Performance', icon: User },
        { href: '/analytics/financial-health-report', label: 'Financial Health', icon: DollarSign },
        { href: '/analytics/ai-insights', label: 'AI Insights', icon: Brain },
    ]
  },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/risk-analyzer', label: 'AI Risk Analyzer', icon: ShieldAlert },
  {
    href: '/settings', // Direct link
    label: 'Settings',
    icon: SettingsIcon,
    // No subItems here for the main sidebar navigation
  },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

// This export can still be useful if the settings page itself wants to build its internal nav from it,
// or it can be removed if the settings page hardcodes its internal nav.
// For clarity, let's keep it as it might be used by the settings page directly.
export const settingsPageInternalNavItems: Array<Omit<NavLink, 'subItems'>> = [
    { href: '/settings#account', label: 'Account', icon: UserCog },
    { href: '/settings#notifications', label: 'Notifications', icon: BellRing },
    { href: '/settings#security', label: 'Security', icon: ShieldCheck },
    { href: '/settings#appearance', label: 'Appearance', icon: Paintbrush },
    { href: '/settings#language', label: 'Language & Region', icon: Languages },
    { href: '/settings#billing', label: 'Billing', icon: CreditCard },
    { href: '/settings#userManagement', label: 'User Management', icon: Users },
    { href: '/settings#accessControl', label: 'Access Control', icon: ShieldCheck },
    { href: '/settings#integrations', label: 'Integrations', icon: Link2 },
    { href: '/settings#workflow', label: 'Workflow Customization', icon: Workflow },
    { href: '/settings#system', label: 'System & Compliance', icon: Server },
].map(item => ({...item, href: `/settings#${item.label.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}));


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

export type CalendarEventType =
  | 'Project Milestone'
  | 'Project Deadline'
  | 'Client Meeting'
  | 'Consultant Assignment'
  | 'General Task'
  | 'Holiday'
  | 'Other';

export interface EventTypeConfig {
  label: string;
  color: string;
  borderColor?: string;
  textColor?: string;
}

export const EVENT_TYPE_CONFIG: Record<CalendarEventType, EventTypeConfig> = {
  'Project Milestone': { label: 'Milestone', color: 'bg-purple-500', textColor: 'text-white', borderColor: 'border-purple-700' },
  'Project Deadline': { label: 'Deadline', color: 'bg-red-600', textColor: 'text-white', borderColor: 'border-red-800' },
  'Client Meeting': { label: 'Meeting', color: 'bg-sky-500', textColor: 'text-white', borderColor: 'border-sky-700' },
  'Consultant Assignment': { label: 'Assignment', color: 'bg-orange-500', textColor: 'text-white', borderColor: 'border-orange-700' },
  'General Task': { label: 'Task', color: 'bg-gray-500', textColor: 'text-white', borderColor: 'border-gray-700' },
  'Holiday': { label: 'Holiday', color: 'bg-teal-500', textColor: 'text-white', borderColor: 'border-teal-700' },
  'Other': { label: 'Other', color: 'bg-pink-500', textColor: 'text-white', borderColor: 'border-pink-700' },
};

// Note: The `settingsSubLinks` that was previously derived from `navLinks` for Settings is no longer needed
// for the main sidebar nav, but I've kept a similar structure named `settingsPageInternalNavItems`
// which could be used by the settings page itself if it dynamically builds its internal menu.
// If the settings page hardcodes its menu, this export can also be removed.
