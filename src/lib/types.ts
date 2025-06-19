
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

export type RevenueRecognitionMethod =
  | 'OnInvoicePaid'
  | 'PercentageOfCompletion'
  | 'MilestoneBased'
  | 'SubscriptionBased'
  | 'Manual';

export const revenueRecognitionMethods: RevenueRecognitionMethod[] = [
  'OnInvoicePaid',
  'PercentageOfCompletion',
  'MilestoneBased',
  'SubscriptionBased',
  'Manual',
];

export interface RevenueRecognitionRule {
  id: string;
  name: string;
  description?: string;
  method: RevenueRecognitionMethod;
  // criteria could be more structured, e.g., { milestoneId: string, percentage: number }[] for MilestoneBased
  // or { recognitionSchedule: 'monthly' | 'quarterly' | 'annually' } for SubscriptionBased.
  // For PoC, a text area for criteria description is simpler.
  criteriaDescription?: string;
  isActive: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

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
  applicableTaxRateIds?: string[]; // IDs of TaxRate s that generally apply
  revenueRecognitionRuleId?: string; // Link to a specific recognition rule
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
  jurisdictionId?: string; // For tax purposes
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

export interface AppliedTaxInfo {
  taxRateId: string;
  name: string; // e.g., "Standard VAT"
  rateValue: number; // e.g., 16 (for 16%)
  amount: number; // Calculated tax amount for this specific tax
  jurisdiction?: string;
  taxTypeName?: string;
  isCompound?: boolean; // Store if it was applied as compound
}

export interface RecognizedRevenueEntry {
  id: string;
  projectId?: string; // Link to project if recognized at project level
  projectNameCache?: string;
  invoiceId?: string; // Link to invoice if recognized from an invoice
  invoiceNumberCache?: string;
  clientId?: string;
  clientNameCache?: string;
  dateRecognized: string; // ISO Date string
  amountRecognized: number;
  currency: string;
  recognitionRuleId?: string; // Link to the rule used
  recognitionRuleNameCache?: string;
  notes?: string;
  createdAt: string; // ISO Date string
}

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // Pre-tax price for this line item (quantity * unitPrice)
  applicableTaxRateIds?: string[]; // Specific tax rates selected for this item
  appliedTaxes?: AppliedTaxInfo[]; // Taxes actually calculated and applied to this item
  taxAmountForItem?: number; // Sum of taxes for this specific item
  totalPriceIncludingTax?: number; // totalPrice + taxAmountForItem
};

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';
export const invoiceStatuses: InvoiceStatus[] = ['Draft', 'Sent', 'Paid', 'Overdue', 'Void'];


export type Invoice = {
  id: string;
  clientId: string;
  clientNameCache: string;
  projectId?: string;
  projectNameCache?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number; // Sum of all item.totalPrice (pre-tax)
  taxAmount: number; // Total tax amount for the entire invoice (sum of item.taxAmountForItem).
  appliedTaxes: AppliedTaxInfo[]; // Summary of unique taxes applied across all items on the invoice.
  totalAmount: number; // subTotal + taxAmount
  status: InvoiceStatus;
  currency: string;
  notes?: string;
  paymentDetails?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  // Revenue Recognition related fields
  deferredRevenueAmount?: number; // Portion of totalAmount not yet recognized
  recognizedRevenueEntries?: RecognizedRevenueEntry[]; // Log of recognized portions
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
  amount: number; // Pre-tax amount
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
  applicableTaxRateIds?: string[]; // Tax rates selected for this expense
  appliedTaxes?: AppliedTaxInfo[]; // Taxes actually calculated and applied
  taxAmount?: number;
  totalAmountIncludingTax?: number; // amount + taxAmount
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

// New Tax Management Types
export interface TaxJurisdiction {
  id: string;
  name: string; // e.g., "Kenya", "USA - California", "European Union"
  countryCode?: string; // e.g., "KE", "US", "EU" (ISO 3166-1 alpha-2 or similar)
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxType {
  id: string;
  name: string; // e.g., "Value Added Tax", "Sales Tax", "Withholding Tax", "Service Tax"
  abbreviation?: string; // e.g., "VAT", "WHT"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaxApplicableEntity =
  | 'ProjectRevenue' // Placeholder, not directly used for calculation yet
  | 'ProjectExpense' // Placeholder
  | 'InvoiceLineItem'
  | 'GeneralExpense'
  | 'ServiceSales'; // Could be used to categorize rates further

export const taxApplicableEntities: TaxApplicableEntity[] = [
  'ProjectRevenue', 'ProjectExpense', 'InvoiceLineItem', 'GeneralExpense', 'ServiceSales'
];

export interface TaxRate {
  id: string;
  jurisdictionId: string;
  jurisdictionNameCache?: string; // Denormalized for display
  taxTypeId: string;
  taxTypeNameCache?: string; // Denormalized for display
  rate: number; // Percentage, e.g., 16 for 16%
  description: string; // e.g., "Standard VAT rate for services"
  startDate: string; // ISO Date string
  endDate?: string; // ISO Date string, for historical rates or temporary taxes
  isCompound: boolean; // Does this tax apply on top of other taxes?
  applicableTo: TaxApplicableEntity[]; // Specifies where this tax rate can be applied
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

    