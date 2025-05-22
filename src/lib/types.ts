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

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  lastContact?: string;
  status?: 'Active' | 'Inactive' | 'Prospect';
  communicationLogs?: CommunicationLog[];
};

export type CommunicationLog = {
  id: string;
  date: string;
  type: 'Email' | 'Call' | 'Meeting';
  summary: string;
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
  client: string;
  healthScore: number; // 0-100
};

export type ConsultantStatus = 'Available' | 'On Project' | 'Unavailable';

export type Consultant = {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  utilization: number; // Percentage 0-100
  status: ConsultantStatus;
  currentProject?: string;
};
