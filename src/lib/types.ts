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

// Represents a DB record in `project_tasks`
export type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatusValue;
  assigneeId?: string; // FK to users.id
  priority?: 'High' | 'Medium' | 'Low';
  dueDate?: string; // ISO Date string
  createdAt?: string;
  completedAt?: string;
};

// Represents a DB record in `project_milestones`
export type Milestone = {
  id: string;
  name: string;
  description?: string;
  dueDate: string; // ISO Date string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed' | 'At Risk';
};

// Represents a DB record in `attachments`
export type Attachment = {
  id: string;
  fileName: string;
  url: string; // The URL from cloud storage
  fileType?: string;
  uploadedAt?: string;
};

export type ProjectFinancials = {
  budget: number;
  spentBudget: number; // This would be calculated dynamically from expenses
  currency: string;
  billingType?: 'Fixed Price' | 'Time & Materials' | 'Retainer';
  hourlyRate?: number;
};

// Represents a DB record in `projects`
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
  lastUpdated: string;
  completionPercent?: number;

  // These would be fetched via separate queries, not stored on the project object itself
  milestones?: Milestone[];
  tasks?: ProjectTask[];
  tags?: string[];
  attachments?: Attachment[];
  applicableTaxRateIds?: string[];
  revenueRecognitionRuleId?: string;
};


export type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

// Represents a DB record in `key_contacts`
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

// Represents a DB record in `communication_logs`
export type CommunicationLog = {
  id: string;
  date: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  summary: string;
  participants?: string[]; // Could be a simple text field or a link to a participants table
  relatedProjectId?: string;
};

export type CalendarEventType =
  | 'Project Milestone'
  | 'Project Deadline'
  | 'Client Meeting'
  | 'Consultant Assignment'
  | 'General Task'
  | 'Holiday'
  | 'Other';

// Represents a DB record in `events`
export type CalendarEvent = {
  id: string;
  title: string;
  start: Date; // Keep as Date object for component
  end?: Date;
  allDay?: boolean;
  type: CalendarEventType;
  description?: string;
  source: 'project' | 'client' | 'consultant' | 'general';
  sourceId: string;
  relatedLink?: string;
  attendees?: string[];
  location?: string;
};

export type ClientMeeting = {
    id?: string;
    title: string;
    date: string;
    time?: string;
    endDate?: string;
    endTime?: string;
    description?: string;
    attendees?: string[];
    location?: string;
};

export type ClientCreditRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

// Represents a DB record in `clients`
export type Client = {
  id: string;
  companyName: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  address?: Address;
  clientTier?: 'Strategic' | 'Key' | 'Standard' | 'Other';
  status: 'Active' | 'Inactive' | 'Prospect';
  engagementDetails?: EngagementDetails; // This is conceptual, data stored on project/invoice records
  satisfactionScore?: number;
  creditRating?: ClientCreditRating;
  notes?: string;
  jurisdictionId?: string; // FK to tax_jurisdictions
  
  // Fetched via separate queries
  keyContacts: KeyContact[]; 
  communicationLogs?: CommunicationLog[];
  linkedProjectIds?: string[];
  meetings?: ClientMeeting[];
  lastContact?: string;
  financialSummary?: ClientFinancialSummary;
};

// The following types remain largely the same but are now understood
// to map to the new, more detailed database tables.

export type RevenueData = {
  date: string; // YYYY-MM-DD format for easier date manipulation
  month?: string;
  actualRevenue?: number;
  actualExpenses?: number;
  forecastedRevenue?: number;
  forecastedExpensesValue?: number; // Added for consistency
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

// Represents a DB record in `users` (specifically for consultants)
export type Consultant = {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[]; // For simplicity; could be a separate `user_skills` table
  utilization: number; // This would be calculated, not stored directly
  status: ConsultantStatus; // Calculated from project assignments
  currentProject?: string; // Calculated
  currentProjectNameCache?: string; // For display
  bio?: string;
  avatarUrl?: string;
  phone?: string;
};

export interface AppliedTaxInfo {
  taxRateId: string;
  name: string;
  rateValue: number;
  amount: number;
  jurisdiction?: string;
  taxTypeName?: string;
  isCompound: boolean;
}

export interface RecognizedRevenueEntry {
  id: string;
  projectId?: string;
  projectNameCache?: string;
  invoiceId?: string;
  invoiceNumberCache?: string;
  clientId?: string;
  clientNameCache?: string;
  dateRecognized: string;
  amountRecognized: number;
  currency: string;
  recognitionRuleId?: string;
  recognitionRuleNameCache?: string;
  notes?: string;
  createdAt: string;
}

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  applicableTaxRateIds?: string[];
  appliedTaxes?: AppliedTaxInfo[];
  taxAmountForItem?: number;
  totalPriceIncludingTax?: number;
};

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';
export const invoiceStatuses: InvoiceStatus[] = ['Draft', 'Sent', 'Paid', 'Overdue', 'Void'];

export type PaymentMethod = 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Check' | 'PayBill' | 'Till Number';

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
  taxAmount: number;
  appliedTaxes: AppliedTaxInfo[];
  totalAmount: number;
  status: InvoiceStatus;
  currency: string;
  notes?: string;
  paymentDetails?: string;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  deferredRevenueAmount?: number;
  recognizedRevenueEntries?: RecognizedRevenueEntry[];
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

export const expenseCategories: ExpenseCategory[] = [ 'Travel', 'Meals & Entertainment', 'Software & Subscriptions', 'Office Supplies', 'Training & Development', 'Marketing & Advertising', 'Hardware', 'Consulting Fees (External)', 'Other'];

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
  applicableTaxRateIds?: string[];
  appliedTaxes?: AppliedTaxInfo[];
  taxAmount?: number;
  totalAmountIncludingTax?: number;
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
  lastLogin?: string;
  dateJoined?: string;
  reportsToUserId?: string;
  reportsToUserNameCache?: string;
}

export interface TaxJurisdiction {
  id: string;
  name: string;
  countryCode?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxType {
  id: string;
  name: string;
  abbreviation?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaxApplicableEntity =
  | 'ProjectRevenue'
  | 'ProjectExpense'
  | 'InvoiceLineItem'
  | 'GeneralExpense'
  | 'ServiceSales';
export const taxApplicableEntities: TaxApplicableEntity[] = [ 'ProjectRevenue', 'ProjectExpense', 'InvoiceLineItem', 'GeneralExpense', 'ServiceSales'];

export interface TaxRate {
  id: string;
  jurisdictionId: string;
  jurisdictionNameCache?: string;
  taxTypeId: string;
  taxTypeNameCache?: string;
  rate: number;
  description: string;
  startDate: string;
  endDate?: string;
  isCompound: boolean;
  applicableTo: TaxApplicableEntity[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type RevenueRecognitionMethod =
  | 'OnInvoicePaid'
  | 'PercentageOfCompletion'
  | 'MilestoneBased'
  | 'SubscriptionBased'
  | 'Manual';
export const revenueRecognitionMethods: RevenueRecognitionMethod[] = [ 'OnInvoicePaid', 'PercentageOfCompletion', 'MilestoneBased', 'SubscriptionBased', 'Manual',];

export interface RevenueRecognitionRule {
  id: string;
  name: string;
  description?: string;
  method: RevenueRecognitionMethod;
  criteriaDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unitPrice: number;
  stockQuantity: number;
  warehouseLocation?: string;
}

export interface Supplier {
  id: string;
  name:string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address?: Address;
  taxId?: string;
  productCatalog?: { productId: string, cost: number }[];
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: { productId: string; quantity: number; unitCost: number }[];
  totalCost: number;
  status: 'Draft' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';
}
