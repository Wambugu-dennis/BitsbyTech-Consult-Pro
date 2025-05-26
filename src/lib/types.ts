
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
  status: ProjectStatusValue;
  assigneeId?: string; // Link to Consultant.id
  assigneeNameCache?: string; // Denormalized for quick display
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
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
  fileSize?: string; // e.g., "2.5 MB"
  url: string; // Download or view link
  uploadedAt: string; // ISO date string
  uploadedBy?: string; // Consultant name or ID
};

export type ProjectFinancials = {
  budget: number;
  spentBudget: number;
  currency: string; // e.g., "USD"
  billingType?: 'Fixed Price' | 'Time & Materials' | 'Retainer';
  hourlyRate?: number; // If T&M
};

export type Project = {
  id: string;
  name: string;
  description: string;
  clientId: string; // Link to Client.id
  clientNameCache?: string; // Denormalized for quick display
  projectManagerId: string; // Link to Consultant.id
  projectManagerNameCache?: string; // Denormalized
  teamMemberIds?: string[]; // Links to Consultant.ids
  status: ProjectStatusValue;
  priority: 'High' | 'Medium' | 'Low';
  startDate: string; // ISO date string
  endDate: string; // Planned end date (ISO date string)
  actualEndDate?: string; // ISO date string
  financials: ProjectFinancials;
  milestones?: Milestone[];
  tasks?: ProjectTask[]; // Tasks specific to this project
  tags?: string[];
  attachments?: ProjectAttachment[];
  lastUpdated: string; // ISO timestamp string
  completionPercent?: number; // Overall project completion
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
  primaryConsultantId?: string; // Links to Consultant ID
};

export type ClientFinancialSummary = {
  totalBilled?: number;
  totalPaid?: number;
  outstandingAmount?: number;
  lastInvoiceDate?: string;
  currency?: string; // e.g., "USD", "EUR"
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
  satisfactionScore?: number; // 0-100
  notes?: string;
  linkedProjectIds?: string[]; // IDs of projects associated with this client
  financialSummary?: ClientFinancialSummary;
  lastContact?: string;
};

export type CommunicationLog = {
  id: string;
  date: string; // ISO date string
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  summary: string;
  participants?: string[]; // Names or IDs of participants
  relatedProjectId?: string; // Optional link to a project
};

export type RevenueData = {
  month: string;
  revenue: number;
};

export type ProjectStatusData = {
  status: string;
  count: number;
  fill?: string; // Added for chart consistency
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
  dateObtained: string; // ISO date string
  expiryDate?: string; // ISO date string
  credentialId?: string;
};

export type ProjectHistoryEntry = {
  projectId: string;
  projectName: string;
  roleOnProject: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
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
  currentProject?: string; // Potentially current project name or ID
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  projectHistory?: ProjectHistoryEntry[];
  detailedSkills?: DetailedSkill[];
  certifications?: Certification[];
};

// Financial Types
export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // quantity * unitPrice
};

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';

export type Invoice = {
  id: string; // e.g., INV-2024-001
  clientId: string;
  clientNameCache: string; // Denormalized
  projectId?: string;
  projectNameCache?: string; // Denormalized
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  items: InvoiceItem[];
  subTotal: number; // Sum of all item.totalPrice
  taxRate?: number; // e.g., 0.08 for 8%
  taxAmount?: number; // subTotal * taxRate
  totalAmount: number; // subTotal + taxAmount
  status: InvoiceStatus;
  currency: string; // e.g., "USD", "EUR"
  notes?: string;
  paymentDetails?: string; // e.g., Bank transfer info, payment link
  paymentDate?: string; // ISO date string, if paid
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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
  date: string; // ISO date string
  description: string;
  amount: number;
  currency: string; // e.g., "USD"
  category: ExpenseCategory | string; // Allow predefined or custom
  status: ExpenseStatus;
  submittedByConsultantId?: string; // Link to Consultant.id
  submittedByConsultantNameCache?: string; // Denormalized
  clientId?: string; // Link to Client.id
  clientNameCache?: string; // Denormalized
  projectId?: string; // Link to Project.id
  projectNameCache?: string; // Denormalized
  budgetId?: string; // Link to Budget.id
  receiptUrl?: string; // Link to an uploaded receipt
  notes?: string;
  approvedByUserId?: string; // User who approved/rejected
  approvedDate?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

// Budget Types
export type BudgetStatus = 'Planning' | 'Active' | 'Overspent' | 'Completed' | 'On Hold';

export const budgetStatuses: BudgetStatus[] = ['Planning', 'Active', 'Overspent', 'Completed', 'On Hold'];

export type BudgetType = 'Project' | 'Departmental' | 'General';
export const budgetTypes: BudgetType[] = ['Project', 'Departmental', 'General'];

export type Budget = {
  id: string;
  name: string;
  type: BudgetType;
  linkedProjectId?: string;
  linkedProjectNameCache?: string; // Denormalized
  departmentName?: string; // For Departmental type
  totalAmount: number;
  // spentAmount: number; // This will be calculated from actual expenses linked to this budget
  currency: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: BudgetStatus; // This can also be dynamically calculated based on spent vs total and dates
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

