
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
  FileText, // For Invoices
  Receipt,    // For Expenses
  Target,     // For Budgets
  Landmark,   // For Revenue Recognition
  PieChart as PieChartLucide, // For Profitability Analysis
  Brain,      // For AI Insights
  type LucideIcon
} from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavLink[]; // Added for sub-navigation
}

export const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/consultants', label: 'Consultants', icon: UserCog },
  {
    href: '/finances', label: 'Finances', icon: DollarSign,
    subItems: [
      { href: '/finances/invoices', label: 'Invoices', icon: FileText },
      { href: '/finances/expenses', label: 'Expenses', icon: Receipt },
      { href: '/finances/budgets', label: 'Budgets', icon: Target },
      { href: '/finances/revenue-recognition', label: 'Revenue Recognition', icon: Landmark },
      { href: '/finances/profitability', label: 'Profitability Analysis', icon: PieChartLucide },
    ]
  },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  {
    href: '/analytics', label: 'Analytics', icon: TrendingUp,
    subItems: [
      { href: '/analytics/ai-insights', label: 'AI Insights', icon: Brain },
      { href: '/analytics/project-success-report', label: 'Project Success Report', icon: Briefcase },
      { href: '/analytics/client-relationship-report', label: 'Client Relationship Report', icon: Users },
      { href: '/analytics/consultant-performance-report', label: 'Consultant Performance Report', icon: UserCog },
      { href: '/analytics/financial-health-report', label: 'Financial Health Report', icon: DollarSign },
    ]
  },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/risk-analyzer', label: 'AI Risk Analyzer', icon: ShieldAlert },
  {
    href: '/settings', label: 'Settings', icon: SettingsIcon,
    subItems: [
      { href: '/settings#account', label: 'Account', icon: UserCog }, // Assuming sub-navigation within settings page itself for now
      { href: '/settings#notifications', label: 'Notifications', icon: HelpCircle }, // Placeholder icon
      { href: '/settings#security', label: 'Security', icon: ShieldAlert },
      { href: '/settings#appearance', label: 'Appearance', icon: LayoutDashboard },
      { href: '/settings#language', label: 'Language & Region', icon: HelpCircle }, // Placeholder icon
      { href: '/settings#billing', label: 'Billing', icon: DollarSign },
      { href: '/settings#userManagement', label: 'User Management', icon: Users },
      { href: '/settings#accessControl', label: 'Access Control', icon: ShieldAlert },
      { href: '/settings#integrations', label: 'Integrations', icon: HelpCircle }, // Placeholder icon
      { href: '/settings#workflow', label: 'Workflow Customization', icon: HelpCircle }, // Placeholder icon
      { href: '/settings#system', label: 'System & Compliance', icon: SettingsIcon },
    ]
  },
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

export const EVENT_TYPE_CONFIG: Record<CalendarEventType, EventTypeConfig> = {
  'Project Milestone': { label: 'Milestone', color: 'bg-purple-500', textColor: 'text-white', borderColor: 'border-purple-700' },
  'Project Deadline': { label: 'Deadline', color: 'bg-red-600', textColor: 'text-white', borderColor: 'border-red-800' },
  'Client Meeting': { label: 'Meeting', color: 'bg-sky-500', textColor: 'text-white', borderColor: 'border-sky-700' },
  'Consultant Assignment': { label: 'Assignment', color: 'bg-orange-500', textColor: 'text-white', borderColor: 'border-orange-700' },
  'General Task': { label: 'Task', color: 'bg-gray-500', textColor: 'text-white', borderColor: 'border-gray-700' },
  'Holiday': { label: 'Holiday', color: 'bg-teal-500', textColor: 'text-white', borderColor: 'border-teal-700' },
  'Other': { label: 'Other', color: 'bg-pink-500', textColor: 'text-white', borderColor: 'border-pink-700' },
};
