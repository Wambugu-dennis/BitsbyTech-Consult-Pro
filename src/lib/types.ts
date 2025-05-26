
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
  assignee?: string;
  dueDate?: string;
};

export type Project = {
  id: string;
  name: string;
  clientName: string;
  status: string; // e.g., 'On Track', 'At Risk', 'Completed'
  completionPercent: number;
  tasks?: ProjectTask[];
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
  name: string;
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
  companyName: string; // Main identifier for the client company
  industry?: string;
  website?: string;
  logoUrl?: string;
  address?: Address;
  clientTier?: 'Strategic' | 'Key' | 'Standard' | 'Other';
  status: 'Active' | 'Inactive' | 'Prospect'; // Keep this simple status for overall client state
  engagementDetails?: EngagementDetails;
  keyContacts: KeyContact[]; // Array of key contacts
  communicationLogs?: CommunicationLog[];
  satisfactionScore?: number; // 0-100
  notes?: string;
  linkedProjectIds?: string[]; // IDs of projects associated with this client
  financialSummary?: ClientFinancialSummary;
  // Deprecating top-level contact fields in favor of keyContacts array
  // name: string; // Primary contact person's name
  // email: string;
  // phone?: string;
  // company: string; // Use companyName instead
  lastContact?: string; // Can be derived from communicationLogs or kept for quick view
};

export type CommunicationLog = {
  id: string;
  date: string;
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
};

export type ClientRelationshipData = {
  client: string; // Likely companyName
  healthScore: number; // 0-100, can be derived from satisfactionScore or other metrics
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
  projectStatus: string; // Could be linked to Project type's status
};

export type Consultant = {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[]; // For basic display and input, detailedSkills for richer data
  utilization: number; // Percentage 0-100
  status: ConsultantStatus;
  currentProject?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  projectHistory?: ProjectHistoryEntry[];
  detailedSkills?: DetailedSkill[];
  certifications?: Certification[];
  // availabilityCalendarData?: any; // Placeholder for complex availability structure
};
