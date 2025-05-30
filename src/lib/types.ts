
import type { PROJECT_STATUS } from './constants';

export type Kpi = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  description?: string;
};

export type ProjectStatusKey = keyof typeof PROJECT_STATUS;
export type ProjectStatusValue = typeof PROJECT_STATUS[ProjectStatusKey];

export type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatusValue; // Ensure this uses ProjectStatusValue
  assigneeId?: string;
  assigneeNameCache?: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  createdAt?: string; // Added for potential "new tasks" calculation
  completedAt?: string; // Added for completion rate
};

export type Milestone = {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed' | 'At Risk';
};

export type ProjectAttachment = {
  id: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
};

export type ProjectFinancials = {
  budget: number;
  spentBudget: number;
  currency: string;
  billingType?: 'Fixed Price' | 'Time & Materials' | 'Retainer';
  hourlyRate?: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientNameCache?: string;
  projectManagerId: string;
  projectManagerNameCache?: string;
  teamMemberIds?: string[];
  status: ProjectStatusValue;
  priority: 'High' | 'Medium' | 'Low';
  startDate: string; // ISO Date string
  endDate: string;   // ISO Date string
  actualEndDate?: string;
  financials: ProjectFinancials;
  milestones?: Milestone[];
  tasks?: ProjectTask[];
  tags?: string[];
  attachments?: ProjectAttachment[];
  lastUpdated: string;
  completionPercent?: number;
};


export type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type KeyContact = {
  id: string;
  name:string;
  role: string;
  email: string;
  phone?: string;
};

export type EngagementDetails = {
  startDate?: string;
  endDate?: string;
  primaryConsultantId?: string;
};

export type ClientFinancialSummary = {
  totalBilled?: number;
  totalPaid?: number;
  outstandingAmount?: number;
  lastInvoiceDate?: string;
  currency?: string;
};

export type CommunicationLog = {
  id: string;
  date: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  summary: string;
  participants?: string[];
  relatedProjectId?: string;
};

export type ClientMeeting = {
  id: string;
  title: string;
  date: string; // ISO Date string
  time?: string; // e.g., "10:00"
  endDate?: string; // ISO Date string, for multi-day events
  endTime?: string; // e.g., "11:00"
  description?: string;
  attendees?: string[]; // Names or IDs
  location?: string; // Physical or virtual
};


export type CalendarEventType =
  | 'Project Milestone'
  | 'Project Deadline'
  | 'Client Meeting'
  | 'Consultant Assignment'
  | 'General Task'
  | 'Holiday'
  | 'Other';

export const calendarEventTypes: CalendarEventType[] = [
  'Project Milestone',
  'Project Deadline',
  'Client Meeting',
  'Consultant Assignment',
  'General Task',
  'Holiday',
  'Other',
];

export type CalendarEventSource = 'project' | 'client' | 'consultant' | 'general';

export interface EventTypeConfig {
  label: string;
  color: string;
  borderColor?: string;
  textColor?: string;
}

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  type: CalendarEventType;
  description?: string;
  source: CalendarEventSource;
  sourceId?: string;
  relatedLink?: string;
  attendees?: string[];
  location?: string;
};


export type Client = {
  id: string;
  companyName: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  address?: Address;
  clientTier?: 'Strategic' | 'Key' | 'Standard' | 'Other';
  status: 'Active' | 'Inactive' | 'Prospect';
  engagementDetails?: EngagementDetails;
  keyContacts: KeyContact[];
  communicationLogs?: CommunicationLog[];
  satisfactionScore?: number;
  notes?: string;
  linkedProjectIds?: string[];
  financialSummary?: ClientFinancialSummary;
  lastContact?: string;
  meetings?: ClientMeeting[];
};


export type RevenueData = {
  date: string; // YYYY-MM-DD format for easier date manipulation
  month?: string; // For display purposes if needed
  actualRevenue?: number;
  actualExpenses?: number;
  forecastedRevenue?: number; // For revenue chart projection
  forecastedExpenses?: number; // For revenue chart projection
  // The ones below are for the AI Insights page's predictive chart
  forecastedRevenueValue?: number;
  forecastedExpensesValue?: number;
  isRevenueForecasted?: boolean;
  isExpensesForecasted?: boolean;
};


export type ProjectStatusData = {
  status: string;
  count: number;
  fill?: string;
};

export type ClientRelationshipData = {
  client: string;
  healthScore: number;
};

export type ConsultantStatus = 'Available' | 'On Project' | 'Unavailable';

export type DetailedSkill = {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
  yearsOfExperience?: number;
};

export type Certification = {
  name: string;
  issuingBody: string;
  dateObtained: string;
  expiryDate?: string;
  credentialId?: string;
};

export type ProjectHistoryEntry = {
  projectId: string;
  projectName: string;
  roleOnProject: string;
  startDate: string;
  endDate?: string;
  projectStatus: string;
};

export type Consultant = {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  utilization: number;
  status: ConsultantStatus;
  currentProject?: string;
  currentProjectNameCache?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  projectHistory?: ProjectHistoryEntry[];
  detailedSkills?: DetailedSkill[];
  certifications?: Certification[];
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';

export type Invoice = {
  id: string;
  clientId: string;
  clientNameCache: string;
  projectId?: string;
  projectNameCache?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  status: InvoiceStatus;
  currency: string;
  notes?: string;
  paymentDetails?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected';

export type ExpenseCategory =
  | 'Travel'
  | 'Meals & Entertainment'
  | 'Software & Subscriptions'
  | 'Office Supplies'
  | 'Training & Development'
  | 'Marketing & Advertising'
  | 'Hardware'
  | 'Consulting Fees (External)'
  | 'Other';


export const expenseCategories: ExpenseCategory[] = [
  'Travel',
  'Meals & Entertainment',
  'Software & Subscriptions',
  'Office Supplies',
  'Training & Development',
  'Marketing & Advertising',
  'Hardware',
  'Consulting Fees (External)',
  'Other'
];


export type Expense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory | string;
  status: ExpenseStatus;
  submittedByConsultantId?: string;
  submittedByConsultantNameCache?: string;
  clientId?: string;
  clientNameCache?: string;
  projectId?: string;
  projectNameCache?: string;
  budgetId?: string;
  receiptUrl?: string;
  notes?: string;
  approvedByUserId?: string;
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type BudgetStatus = 'Planning' | 'Active' | 'Overspent' | 'Completed' | 'On Hold';

export const budgetStatuses: BudgetStatus[] = ['Planning', 'Active', 'Overspent', 'Completed', 'On Hold'];

export type BudgetType = 'Project' | 'Departmental' | 'General';
export const budgetTypes: BudgetType[] = ['Project', 'Departmental', 'General'];

export type Budget = {
  id: string;
  name: string;
  type: BudgetType;
  linkedProjectId?: string;
  linkedProjectNameCache?: string;
  departmentName?: string;
  totalAmount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: BudgetStatus; 
  description?: string;
  createdAt: string;
  updatedAt: string;
};

// Types for User Management in Settings
export type SystemUserStatus = 'Active' | 'Inactive' | 'Invited' | 'Suspended';
export const systemUserStatuses: SystemUserStatus[] = ['Active', 'Inactive', 'Invited', 'Suspended'];

export type SystemRole = 'Administrator' | 'Project Manager' | 'Consultant' | 'Finance Manager' | 'Client User' | 'Viewer';
export const systemRoles: SystemRole[] = ['Administrator', 'Project Manager', 'Consultant', 'Finance Manager', 'Client User', 'Viewer'];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  status: SystemUserStatus;
  avatarUrl?: string;
  lastLogin?: string; // ISO date string
  dateJoined?: string; // ISO date string
  reportsToUserId?: string;
  reportsToUserNameCache?: string;
}
