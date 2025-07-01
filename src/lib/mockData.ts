import type { Client, Consultant, Project, ProjectTask, Invoice, InvoiceItem, AppliedTaxInfo, Expense, Budget, BudgetStatus, BudgetType, CalendarEvent, ClientMeeting, RevenueData, SystemUser, SystemUserStatus, SystemRole, TaxJurisdiction, TaxType, TaxRate, TaxApplicableEntity, RevenueRecognitionRule, RevenueRecognitionMethod, RecognizedRevenueEntry, PaymentMethod } from "@/lib/types";
import { PROJECT_STATUS } from "@/lib/constants";
import { expenseCategories, budgetTypes, budgetStatuses, calendarEventTypes, systemUserStatuses, systemRoles, taxApplicableEntities, revenueRecognitionMethods } from "./types";
import { formatISO, addDays, subDays, addMonths, parseISO, getMonth, format } from 'date-fns';

const today = new Date();
const currentYear = today.getFullYear();

// Tax Management Mock Data
export const initialTaxJurisdictions: TaxJurisdiction[] = [
  { id: 'jur-ke', name: 'Kenya', countryCode: 'KE', description: 'East African Nation', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'jur-us-ca', name: 'USA - California', countryCode: 'US', description: 'State of California, USA', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'jur-uk', name: 'United Kingdom', countryCode: 'GB', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'jur-us-tx', name: 'USA - Texas', countryCode: 'US', description: 'State of Texas, USA', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const initialTaxTypes: TaxType[] = [
  { id: 'type-vat', name: 'Value Added Tax', abbreviation: 'VAT', description: 'Consumption tax applied to goods and services.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'type-wht', name: 'Withholding Tax', abbreviation: 'WHT', description: 'Tax deducted at source from payments like dividends, interest, royalties.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'type-sales', name: 'Sales Tax', abbreviation: 'Sales', description: 'Tax on sale of goods and services, typically at point of sale.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'type-service', name: 'Service Tax', abbreviation: 'Service', description: 'Tax specifically on services rendered.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const initialTaxRates: TaxRate[] = [
  {
    id: 'rate-ke-vat-std',
    jurisdictionId: 'jur-ke',
    jurisdictionNameCache: 'Kenya',
    taxTypeId: 'type-vat',
    taxTypeNameCache: 'Value Added Tax',
    rate: 16,
    description: 'Standard VAT rate for services in Kenya.',
    startDate: '2020-01-01',
    applicableTo: ['ServiceSales', 'InvoiceLineItem', 'GeneralExpense'],
    isCompound: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-us-ca-sales',
    jurisdictionId: 'jur-us-ca',
    jurisdictionNameCache: 'USA - California',
    taxTypeId: 'type-sales',
    taxTypeNameCache: 'Sales Tax',
    rate: 7.25,
    description: 'California statewide sales tax rate. Local taxes may apply.',
    startDate: '2017-01-01',
    applicableTo: ['InvoiceLineItem', 'ServiceSales', 'GeneralExpense'],
    isCompound: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-uk-vat-std',
    jurisdictionId: 'jur-uk',
    jurisdictionNameCache: 'United Kingdom',
    taxTypeId: 'type-vat',
    taxTypeNameCache: 'Value Added Tax',
    rate: 20,
    description: 'Standard VAT rate in the UK.',
    startDate: '2011-01-04',
    applicableTo: ['ServiceSales', 'InvoiceLineItem'],
    isCompound: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-ke-wht-services',
    jurisdictionId: 'jur-ke',
    jurisdictionNameCache: 'Kenya',
    taxTypeId: 'type-wht',
    taxTypeNameCache: 'Withholding Tax',
    rate: 5,
    description: 'Withholding tax on consultancy and agency fees for residents.',
    startDate: '2005-01-01',
    applicableTo: ['ServiceSales'],
    isCompound: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-us-tx-sales',
    jurisdictionId: 'jur-us-tx',
    jurisdictionNameCache: 'USA - Texas',
    taxTypeId: 'type-sales',
    taxTypeNameCache: 'Sales Tax',
    rate: 6.25,
    description: 'Texas state sales tax rate. Local taxes can add up to 2% more.',
    startDate: '1990-01-01',
    applicableTo: ['InvoiceLineItem'],
    isCompound: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Mock data for Clients
export const initialClients: Client[] = [
  {
    id: '1',
    companyName: 'Innovatech Ltd.',
    industry: 'Technology',
    website: 'https://innovatech.example.com',
    logoUrl: 'https://placehold.co/100x100/64B5F6/FFFFFF.png?text=IL',
    address: { street: '123 Tech Park', city: 'Futureville', state: 'CA', zip: '90210', country: 'USA' },
    clientTier: 'Strategic',
    status: 'Active',
    engagementDetails: { startDate: '2023-01-15', primaryConsultantId: 'c1' },
    keyContacts: [
      { id: 'kc1-1', name: 'Sarah Connor', role: 'CEO', email: 's.connor@innovatech.example.com', phone: '555-0100' },
      { id: 'kc1-2', name: 'John Projectlead', role: 'Head of R&D', email: 'j.projectlead@innovatech.example.com' },
    ],
    satisfactionScore: 92,
    creditRating: 'Excellent',
    notes: 'Long-term client, high value. Focus on AI and cloud solutions.',
    linkedProjectIds: ['proj101', 'proj105'],
    financialSummary: { totalBilled: 120000, totalPaid: 115000, outstandingAmount: 5000, lastInvoiceDate: '2024-07-01', currency: 'USD' },
    lastContact: formatISO(subDays(today, 15), { representation: 'date' }), 
    communicationLogs: [
      {id: 'cl1', date: formatISO(subDays(today, 15), { representation: 'date' }), type: 'Meeting', summary: 'Quarterly review, positive feedback.', participants: ['Sarah Connor', 'Dr. Eleanor Vance']},
      {id: 'cl2', date: formatISO(subDays(today, 40), { representation: 'date' }), type: 'Email', summary: 'Sent project update for proj105.'}
    ],
    meetings: [
        { id:'m1', title: 'Quarterly Review with Innovatech', date: formatISO(subDays(today,15), { representation: 'date' }), time: '10:00', description: 'Discuss Q2 performance and Q3 roadmap.', attendees: ['Sarah Connor', 'Dr. Eleanor Vance'], location: 'Innovatech HQ / Video Call'},
        { id:'m2', title: 'Project Kickoff: AI Overhaul Phase 2', date: formatISO(addDays(today, 5), { representation: 'date' }), time: '14:00', description: 'Initiate phase 2 of AI Overhaul.', attendees: ['John Projectlead', 'Dr. Eleanor Vance', 'Marcus Chen'], location: 'Video Call' }
    ],
    jurisdictionId: 'jur-us-ca',
  },
  {
    id: '2',
    companyName: 'Alpha Solutions',
    industry: 'Healthcare',
    website: 'https://alphasolutions.example.io',
    logoUrl: 'https://placehold.co/100x100/FFB74D/333333.png?text=AS',
    address: { street: '456 Health Drive', city: 'Wellspring', state: 'TX', zip: '75001', country: 'USA' },
    clientTier: 'Key',
    status: 'Active',
    engagementDetails: { startDate: '2022-11-01', endDate: '2024-10-31', primaryConsultantId: 'c2' },
    keyContacts: [
      { id: 'kc2-1', name: 'Robert Neville', role: 'CTO', email: 'r.neville@alphasolutions.example.io', phone: '555-0200' }
    ],
    satisfactionScore: 85,
    creditRating: 'Good',
    notes: 'Focused on data analytics and patient management systems.',
    linkedProjectIds: ['proj202'],
    financialSummary: { totalBilled: 75000, totalPaid: 75000, outstandingAmount: 0, lastInvoiceDate: '2024-06-15', currency: 'USD' },
    lastContact: formatISO(subDays(today, 10), { representation: 'date' }),
    meetings: [
        { id:'m3', title: 'Alpha Solutions Check-in', date: formatISO(addDays(today, 12), { representation: 'date' }), time: '11:00', description: 'Weekly sync on predictive model project.', attendees: ['Robert Neville', 'Aisha Khan'], location: 'Video Call' }
    ],
    jurisdictionId: 'jur-us-tx',
  },
  {
    id: '3',
    companyName: 'Beta Corp',
    industry: 'Manufacturing',
    website: 'https://betacorp.example.dev',
    logoUrl: 'https://placehold.co/100x100/81C784/FFFFFF.png?text=BC',
    address: { street: '789 Factory Lane', city: 'Industry City', state: 'IL', zip: '60607', country: 'USA' },
    clientTier: 'Standard',
    status: 'Inactive',
    engagementDetails: { startDate: '2023-03-01', endDate: '2023-09-30', primaryConsultantId: 'c3' },
    keyContacts: [
      { id: 'kc3-1', name: 'Carol Danvers', role: 'Operations Manager', email: 'c.danvers@betacorp.example.dev', phone: '555-0300' }
    ],
    satisfactionScore: 70,
    creditRating: 'Good',
    notes: 'Previous engagement for process optimization. Potential for follow-up work.',
    financialSummary: { totalBilled: 45000, totalPaid: 45000, outstandingAmount: 0, currency: 'USD' },
    lastContact: formatISO(subDays(today, 300), { representation: 'date' }),
    linkedProjectIds: ['proj301'],
  },
  {
    id: '4',
    companyName: 'Gamma Industries',
    industry: 'Logistics',
    website: 'https://gammaind.example.net',
    logoUrl: 'https://placehold.co/100x100/E57373/FFFFFF.png?text=GI',
    clientTier: 'Other',
    status: 'Prospect',
    keyContacts: [
      { id: 'kc4-1', name: 'Bruce Banner', role: 'Procurement Head', email: 'b.banner@gammaind.example.net', phone: '555-0400' }
    ],
    creditRating: 'Fair',
    notes: 'Initial discussions for supply chain optimization. Proposal sent.',
    lastContact: formatISO(subDays(today, 30), { representation: 'date' }),
    jurisdictionId: 'jur-ke',
  },
];

export const initialConsultants: Consultant[] = [
  {
    id: 'c1',
    name: 'Dr. Eleanor Vance',
    email: 'eleanor.vance@consult.com',
    role: 'Lead Strategist',
    skills: ['Market Analysis', 'AI Strategy', 'Digital Transformation'],
    utilization: 75,
    status: 'On Project',
    currentProject: 'proj101',
    currentProjectNameCache: 'Innovatech AI Overhaul',
    bio: 'Seasoned strategist with 15+ years of experience in driving digital innovation and market growth for Fortune 500 companies. Expert in AI-driven business solutions.',
    avatarUrl: 'https://placehold.co/100x100/64B5F6/FFFFFF.png?text=EV',
    phone: '555-0101',
  },
  {
    id: 'c2',
    name: 'Marcus Chen',
    email: 'marcus.chen@consult.com',
    role: 'Senior Data Scientist',
    skills: ['Machine Learning', 'Python', 'Big Data Analytics', 'NLP'],
    utilization: 90,
    status: 'On Project',
    currentProject: 'proj202',
    currentProjectNameCache: 'Alpha Solutions Predictive Model',
    bio: 'Data scientist specializing in machine learning model development and deployment. Passionate about leveraging data to solve complex business problems.',
    avatarUrl: 'https://placehold.co/100x100/FFB74D/FFFFFF.png?text=MC',
    phone: '555-0102',
  },
  {
    id: 'c3',
    name: 'Aisha Khan',
    email: 'aisha.khan@consult.com',
    role: 'Project Manager',
    skills: ['Agile Methodologies', 'Scrum Master', 'Stakeholder Management'],
    utilization: 60,
    status: 'Available',
    bio: 'Certified Scrum Master and Agile coach with a track record of delivering complex projects on time and within budget. Strong focus on team collaboration and client satisfaction.',
    avatarUrl: 'https://placehold.co/100x100/81C784/FFFFFF.png?text=AK',
    phone: '555-0103',
  },
  {
    id: 'c4',
    name: 'James Miller',
    email: 'james.miller@consult.com',
    role: 'Junior Analyst',
    skills: ['Data Visualization', 'Excel', 'Market Research'],
    utilization: 20,
    status: 'On Project',
    currentProject: 'proj105',
    currentProjectNameCache: 'Innovatech Cloud Platform Migration',
    bio: 'Enthusiastic analyst with a knack for transforming data into actionable insights. Proficient in market research and creating compelling data visualizations.',
    avatarUrl: `https://placehold.co/100x100.png?text=JM`,
  },
  {
    id: 'c5',
    name: 'Sofia Petrova',
    email: 'sofia.petrova@consult.com',
    role: 'UX Lead',
    skills: ['User Research', 'Prototyping', 'Interaction Design', 'Figma'],
    utilization: 0,
    status: 'Unavailable',
    bio: 'Creative UX Lead dedicated to designing intuitive and engaging user experiences. Expert in user-centered design methodologies and modern design tools.',
    avatarUrl: 'https://placehold.co/100x100/E57373/FFFFFF.png?text=SP',
    phone: '555-0105',
  },
];

export const initialProjectTasks: ProjectTask[] = [
  { id: 'task-proj101-1', title: 'Discovery Phase for Innovatech', description: 'Initial client meetings and requirement gathering for AI Overhaul.', status: PROJECT_STATUS.TODO, assigneeId: 'c1', dueDate: formatISO(addDays(today,15), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,5)) },
  { id: 'task-proj101-2', title: 'Backend API Integration for Innovatech', description: 'Connect frontend to new microservices for AI features.', status: PROJECT_STATUS.IN_PROGRESS, assigneeId: 'c2', dueDate: formatISO(addDays(today,60), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,10)) },
  { id: 'task-proj101-3', title: 'User Interface Design for Chatbot', status: PROJECT_STATUS.TODO, assigneeId: 'c5', dueDate: formatISO(addDays(today,30), { representation: 'date' }), priority: 'Medium', createdAt: formatISO(subDays(today,2)) },

  { id: 'task-proj202-1', title: 'Develop UI Mockups for Alpha Solutions', description: 'Create wireframes and high-fidelity mockups for predictive model interface.', status: PROJECT_STATUS.IN_PROGRESS, assigneeId: 'c5', dueDate: formatISO(addDays(today,20), { representation: 'date' }), priority: 'Medium', createdAt: formatISO(subDays(today,7))  },
  { id: 'task-proj202-2', title: 'Data Cleaning and Preprocessing', status: PROJECT_STATUS.IN_PROGRESS, assigneeId: 'c2', dueDate: formatISO(addDays(today,10), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,15)) },
  { id: 'task-proj202-3', title: 'Model Training - Iteration 1', status: PROJECT_STATUS.TODO, assigneeId: 'c2', dueDate: formatISO(addDays(today,35), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,1)) },

  { id: 'task-proj301-1', title: 'Q&A Testing for Beta Corp App', description: 'Comprehensive testing of all features of process optimization app.', status: PROJECT_STATUS.DONE, assigneeId: 'c4', dueDate: formatISO(subDays(today, 50), { representation: 'date' }), priority: 'Medium', createdAt: formatISO(subDays(today,60)), completedAt: formatISO(subDays(today,50))  },
  { id: 'task-proj301-2', title: 'Final Report Generation', status: PROJECT_STATUS.DONE, assigneeId: 'c3', dueDate: formatISO(subDays(today, 45), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,55)), completedAt: formatISO(subDays(today,45)) },

  { id: 'task-proj105-1', title: 'Deploy Innovatech Cloud Platform V1', description: 'Final deployment to production environment.', status: PROJECT_STATUS.DONE, assigneeId: 'c1', dueDate: formatISO(subDays(today, 30), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,40)), completedAt: formatISO(subDays(today,30))  },
  { id: 'task-proj105-2', title: 'Infrastructure Setup on AWS', status: PROJECT_STATUS.TODO, assigneeId: 'c4', dueDate: formatISO(addDays(today, 5), { representation: 'date' }), priority: 'High', createdAt: formatISO(subDays(today,3)) },
  { id: 'task-proj105-3', title: 'Data Migration Plan Review', status: PROJECT_STATUS.IN_PROGRESS, assigneeId: 'c1', dueDate: formatISO(addDays(today, 10), { representation: 'date' }), priority: 'Medium', createdAt: formatISO(subDays(today,1)) },
];

export const initialProjects: Project[] = [
  {
    id: 'proj101',
    name: 'Innovatech AI Overhaul',
    description: 'A comprehensive project to integrate advanced AI capabilities into Innovatech Ltd.\'s core platform, aiming to improve efficiency and user engagement. Includes development of new machine learning models and a chatbot interface.',
    clientId: '1',
    clientNameCache: 'Innovatech Ltd.',
    projectManagerId: 'c1',
    projectManagerNameCache: 'Dr. Eleanor Vance',
    teamMemberIds: ['c2', 'c5'],
    status: PROJECT_STATUS.IN_PROGRESS,
    priority: 'High',
    startDate: formatISO(subDays(today, 90), { representation: 'date' }),
    endDate: formatISO(addDays(today, 90), { representation: 'date' }),
    financials: { budget: 250000, spentBudget: 112500, currency: 'USD', billingType: 'Fixed Price' },
    milestones: [
      { id: 'm101-1', name: 'Phase 1: Discovery & Planning', dueDate: formatISO(subDays(today, 60), { representation: 'date' }), status: 'Completed' },
      { id: 'm101-2', name: 'Phase 2: Model Development', dueDate: formatISO(addDays(today, 30), { representation: 'date' }), status: 'In Progress' },
      { id: 'm101-3', name: 'Phase 3: Integration & Testing', dueDate: formatISO(addDays(today, 75), { representation: 'date' }), status: 'Pending' },
    ],
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj101')),
    tags: ['AI', 'Machine Learning', 'Cloud Integration'],
    lastUpdated: new Date().toISOString(),
    completionPercent: 45,
    applicableTaxRateIds: ['rate-us-ca-sales'],
    revenueRecognitionRuleId: 'rule-milestone',
  },
  {
    id: 'proj202',
    name: 'Alpha Solutions Predictive Model',
    description: 'Development of a predictive analytics model for Alpha Solutions to forecast patient readmission rates, improving resource allocation and patient care.',
    clientId: '2',
    clientNameCache: 'Alpha Solutions',
    projectManagerId: 'c3',
    projectManagerNameCache: 'Aisha Khan',
    teamMemberIds: ['c2'],
    status: PROJECT_STATUS.IN_PROGRESS,
    priority: 'High',
    startDate: formatISO(subDays(today, 45), { representation: 'date' }),
    endDate: formatISO(addDays(today, 75), { representation: 'date' }),
    financials: { budget: 150000, spentBudget: 45000, currency: 'USD', billingType: 'Time & Materials', hourlyRate: 150 },
    milestones: [
      { id: 'm202-1', name: 'Data Collection & Cleaning', dueDate: formatISO(subDays(today, 15), { representation: 'date' }), status: 'Completed' },
      { id: 'm202-2', name: 'Model Prototyping', dueDate: formatISO(addDays(today, 45), { representation: 'date' }), status: 'In Progress' },
      { id: 'm202-3', name: 'Deployment & Validation', dueDate: formatISO(addDays(today, 70), { representation: 'date' }), status: 'Pending' },
    ],
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj202')),
    tags: ['Healthcare', 'Predictive Analytics', 'Data Science'],
    lastUpdated: new Date().toISOString(),
    completionPercent: 30,
    applicableTaxRateIds: [],
    revenueRecognitionRuleId: 'rule-poc',
  },
  {
    id: 'proj301',
    name: 'Beta Corp Process Optimization',
    description: 'Analysis and optimization of Beta Corp\'s key manufacturing processes to reduce waste and improve throughput. Engagement completed.',
    clientId: '3',
    clientNameCache: 'Beta Corp',
    projectManagerId: 'c3',
    projectManagerNameCache: 'Aisha Khan',
    status: PROJECT_STATUS.DONE,
    priority: 'Medium',
    startDate: formatISO(subDays(today, 200), { representation: 'date' }),
    endDate: formatISO(subDays(today, 100), { representation: 'date' }),
    actualEndDate: formatISO(subDays(today, 102), { representation: 'date' }),
    financials: { budget: 80000, spentBudget: 78000, currency: 'USD', billingType: 'Fixed Price' },
    tags: ['Manufacturing', 'Process Improvement', 'Lean Six Sigma'],
    lastUpdated: formatISO(subDays(today, 100)),
    completionPercent: 100,
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj301')),
    milestones: [
        { id: 'm301-1', name: 'Initial Assessment', dueDate: formatISO(subDays(today, 180), { representation: 'date' }), status: 'Completed' },
        { id: 'm301-2', name: 'Implementation Phase', dueDate: formatISO(subDays(today, 120), { representation: 'date' }), status: 'Completed' },
        { id: 'm301-3', name: 'Final Report & Handover', dueDate: formatISO(subDays(today, 100), { representation: 'date' }), status: 'Completed' },
    ],
    revenueRecognitionRuleId: 'rule-onpaid',
  },
  {
    id: 'proj105',
    name: 'Innovatech Cloud Platform Migration',
    description: 'Migrate Innovatech Ltd.\'s legacy infrastructure to a modern cloud platform. This project focuses on scalability and cost-efficiency.',
    clientId: '1',
    clientNameCache: 'Innovatech Ltd.',
    projectManagerId: 'c1',
    projectManagerNameCache: 'Dr. Eleanor Vance',
    teamMemberIds: ['c4'],
    status: PROJECT_STATUS.TODO,
    priority: 'Medium',
    startDate: formatISO(addDays(today, 10), { representation: 'date' }),
    endDate: formatISO(addDays(today, 100), { representation: 'date' }),
    financials: { budget: 180000, spentBudget: 0, currency: 'USD', billingType: 'Fixed Price' },
    milestones: [
        { id: 'm105-1', name: 'Planning & Assessment', dueDate: formatISO(addDays(today, 30), { representation: 'date' }), status: 'Pending'},
        { id: 'm105-2', name: 'Development & Migration', dueDate: formatISO(addDays(today, 75), { representation: 'date' }), status: 'Pending'},
        { id: 'm105-3', name: 'Testing & Go-live', dueDate: formatISO(addDays(today, 95), { representation: 'date' }), status: 'Pending'},
    ],
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj105')),
    tags: ['Cloud Migration', 'Infrastructure', 'AWS'],
    lastUpdated: new Date().toISOString(),
    completionPercent: 5,
    applicableTaxRateIds: ['rate-us-ca-sales'],
    revenueRecognitionRuleId: 'rule-milestone',
  }
];

// Modified generateInvoiceItems to be deterministic
const generateInvoiceItems = (num: number, basePrice: number, seed: number = 1): { items: InvoiceItem[], subTotal: number } => {
  const items: InvoiceItem[] = [];
  let subTotal = 0;
  for (let i = 1; i <= num; i++) {
    // Deterministic quantity and unitPrice based on i and seed
    const quantity = ((i + seed) % 3) + 1; // Cycles 1, 2, 3 based on i and seed
    const unitPrice = basePrice * (1 + ((i + seed) * 0.02)); // Deterministic small increase
    const totalPrice = quantity * unitPrice;
    items.push({
      id: `item-${Date.now()}-${i}-${seed}`, // Date.now() for ID uniqueness is fine
      description: `Consulting Service ${i} / Development Hours`,
      quantity,
      unitPrice: parseFloat(unitPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
    subTotal += totalPrice;
  }
  return { items, subTotal: parseFloat(subTotal.toFixed(2)) };
};

const createInvoiceWithTaxes = (
  id: string,
  client: Client,
  project: Project | undefined,
  status: Invoice['status'],
  daysOffset: number,
  itemsInfo: { items: InvoiceItem[], subTotal: number },
  applicableTaxRateIds: string[],
  paymentMethod?: PaymentMethod
): Invoice => {
  const issueDate = formatISO(subDays(today, daysOffset), { representation: 'date' });
  const dueDate = formatISO(addDays(new Date(issueDate), 30), { representation: 'date' });

  let totalTaxAmount = 0;
  const appliedTaxesSummary: AppliedTaxInfo[] = [];

  applicableTaxRateIds.forEach(rateId => {
    const taxRateInfo = initialTaxRates.find(r => r.id === rateId);
    if (taxRateInfo && taxRateInfo.applicableTo.includes('InvoiceLineItem') /* Simplified logic */) {
      const taxAmountForThisRate = parseFloat(((itemsInfo.subTotal * taxRateInfo.rate) / 100).toFixed(2));
      totalTaxAmount += taxAmountForThisRate;
      appliedTaxesSummary.push({
        taxRateId: taxRateInfo.id,
        name: taxRateInfo.description,
        rateValue: taxRateInfo.rate,
        amount: taxAmountForThisRate,
        jurisdiction: taxRateInfo.jurisdictionNameCache,
        taxTypeName: taxRateInfo.taxTypeNameCache,
        isCompound: taxRateInfo.isCompound
      });
    }
  });
  totalTaxAmount = parseFloat(totalTaxAmount.toFixed(2));
  const totalAmount = parseFloat((itemsInfo.subTotal + totalTaxAmount).toFixed(2));

  return {
    id,
    clientId: client.id,
    clientNameCache: client.companyName,
    projectId: project?.id,
    projectNameCache: project?.name,
    issueDate,
    dueDate,
    items: itemsInfo.items,
    subTotal: itemsInfo.subTotal,
    taxAmount: totalTaxAmount,
    appliedTaxes: appliedTaxesSummary,
    totalAmount,
    status,
    currency: 'USD',
    notes: 'Thank you for your business. Payment is due within 30 days.',
    paymentDetails: 'Bank: Global Consultants Bank, Account: 123-456-789, SWIFT: GCBKUS33',
    createdAt: formatISO(subDays(today, daysOffset + 2)),
    updatedAt: formatISO(subDays(today, daysOffset + 1)),
    paymentMethod: status === 'Paid' ? paymentMethod : undefined,
    paymentDate: status === 'Paid' ? formatISO(subDays(today, daysOffset - 5), { representation: 'date' }) : undefined,
    deferredRevenueAmount: status === 'Paid' ? totalAmount * 0.5 : totalAmount, // Example initial deferral
    recognizedRevenueEntries: status === 'Paid' ? [
      {
        id: `rr-${id}-1`,
        invoiceId: id,
        invoiceNumberCache: id,
        dateRecognized: formatISO(subDays(today, daysOffset - 5)), // Same as payment date
        amountRecognized: totalAmount * 0.5,
        currency: 'USD',
        recognitionRuleId: 'rule-onpaid', // Example
        recognitionRuleNameCache: 'Full Recognition on Invoice Payment',
        createdAt: formatISO(subDays(today, daysOffset - 5)),
      }
    ] : [],
  };
};

const inv1Items = generateInvoiceItems(3, 1500, 1); // seed 1
const inv2Items = generateInvoiceItems(2, 2500, 2); // seed 2
const inv3Items = generateInvoiceItems(5, 1000, 3); // seed 3
const inv4Items = generateInvoiceItems(1, 5000, 4); // seed 4

export const initialInvoices: Invoice[] = [
  createInvoiceWithTaxes('INV-2024-001', initialClients[0], initialProjects.find(p => p.id === 'proj101'), 'Paid', 45, inv1Items, ['rate-us-ca-sales'], 'Credit Card'),
  createInvoiceWithTaxes('INV-2024-002', initialClients[1], initialProjects.find(p => p.id === 'proj202'), 'Sent', 20, inv2Items, []),
  createInvoiceWithTaxes('INV-2024-003', initialClients[0], initialProjects.find(p => p.id === 'proj105'), 'Overdue', 35, inv3Items, ['rate-us-ca-sales']),
  createInvoiceWithTaxes('INV-2024-004', initialClients[3], undefined, 'Draft', 5, inv4Items, ['rate-ke-vat-std', 'rate-ke-wht-services']),
];

export const initialBudgets: Budget[] = [
  {
    id: 'bud-proj101',
    name: 'Innovatech AI Overhaul Budget',
    type: 'Project',
    linkedProjectId: 'proj101',
    linkedProjectNameCache: initialProjects.find(p => p.id === 'proj101')?.name,
    totalAmount: initialProjects.find(p => p.id === 'proj101')?.financials.budget || 250000,
    currency: 'USD',
    startDate: initialProjects.find(p => p.id === 'proj101')?.startDate || formatISO(subDays(today, 180), { representation: 'date' }),
    endDate: initialProjects.find(p => p.id === 'proj101')?.endDate || formatISO(addDays(today, 180), { representation: 'date' }),
    status: 'Active',
    description: 'Budget for the AI overhaul project with Innovatech Ltd.',
    createdAt: formatISO(subDays(today, 182), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 10), { representation: 'date' }),
  },
  {
    id: 'bud-proj202',
    name: 'Alpha Solutions Model Budget',
    type: 'Project',
    linkedProjectId: 'proj202',
    linkedProjectNameCache: initialProjects.find(p => p.id === 'proj202')?.name,
    totalAmount: initialProjects.find(p => p.id === 'proj202')?.financials.budget || 150000,
    currency: 'USD',
    startDate: initialProjects.find(p => p.id === 'proj202')?.startDate || formatISO(subDays(today, 90), { representation: 'date' }),
    endDate: initialProjects.find(p => p.id === 'proj202')?.endDate || formatISO(addDays(today, 90), { representation: 'date' }),
    status: 'Active',
    createdAt: formatISO(subDays(today, 92), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 5), { representation: 'date' }),
  },
  {
    id: 'bud-marketing-q3',
    name: 'Q3 Marketing Budget',
    type: 'Departmental',
    departmentName: 'Marketing',
    totalAmount: 50000,
    currency: 'USD',
    startDate: formatISO(addMonths(subDays(today, today.getDate() -1 ), -2), { representation: 'date' }),
    endDate: formatISO(addDays(addMonths(subDays(today, today.getDate() -1), -2), 89), { representation: 'date' }),
    status: 'Active',
    description: 'Quarterly budget for all marketing activities.',
    createdAt: formatISO(addMonths(today, -2), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 3), { representation: 'date' }),
  },
  {
    id: 'bud-training-annual',
    name: 'Annual Training & Development Budget',
    type: 'General',
    totalAmount: 75000,
    currency: 'USD',
    startDate: formatISO(subDays(today, 300), { representation: 'date' }),
    endDate: formatISO(addDays(today, 65), { representation: 'date' }),
    status: 'Active',
    description: 'Annual budget for consultant training, certifications, and conferences.',
    createdAt: formatISO(subDays(today, 300), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 1), { representation: 'date' }),
  },
   {
    id: 'bud-rd-2024',
    name: 'R&D 2024 Budget',
    type: 'Departmental',
    departmentName: 'Research & Development',
    totalAmount: 120000,
    currency: 'USD',
    startDate: formatISO(new Date(today.getFullYear(), 0, 1), { representation: 'date' }),
    endDate: formatISO(new Date(today.getFullYear(), 11, 31), { representation: 'date' }),
    status: 'Completed',
    description: 'Budget for all R&D initiatives for the year 2024.',
    createdAt: formatISO(new Date(today.getFullYear(), 0, 1), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 15), { representation: 'date' }),
  },
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-001',
    date: formatISO(subDays(today, 10), { representation: 'date' }),
    description: 'Flight to Innovatech Ltd. for project kickoff (proj101)',
    amount: 450.75, // Pre-tax
    currency: 'USD',
    category: 'Travel',
    status: 'Approved',
    submittedByConsultantId: 'c1',
    submittedByConsultantNameCache: initialConsultants.find(c=>c.id === 'c1')?.name,
    clientId: '1',
    clientNameCache: initialClients.find(cl => cl.id === '1')?.companyName,
    projectId: 'proj101',
    projectNameCache: initialProjects.find(p => p.id === 'proj101')?.name,
    budgetId: 'bud-proj101',
    receiptUrl: 'https://placehold.co/200x100.png?text=Receipt1',
    notes: 'Kickoff meeting travel expense.',
    approvedByUserId: 'adminUser1',
    approvedDate: formatISO(subDays(today, 8), { representation: 'date' }),
    createdAt: formatISO(subDays(today, 10), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 8), { representation: 'date' }),
    applicableTaxRateIds: ['rate-us-ca-sales'],
    appliedTaxes: [{ taxRateId: 'rate-us-ca-sales', name: 'CA Sales Tax', rateValue: 7.25, amount: parseFloat((450.75 * 0.0725).toFixed(2)) , jurisdiction: 'USA - California', taxTypeName: 'Sales Tax', isCompound: false}],
    taxAmount: parseFloat((450.75 * 0.0725).toFixed(2)),
    totalAmountIncludingTax: parseFloat((450.75 * 1.0725).toFixed(2)),
  },
  {
    id: 'exp-002',
    date: formatISO(subDays(today, 5), { representation: 'date' }),
    description: 'Team Lunch during Alpha Solutions workshop (proj202)',
    amount: 120.50,
    currency: 'USD',
    category: 'Meals & Entertainment',
    status: 'Pending',
    submittedByConsultantId: 'c3',
    submittedByConsultantNameCache: initialConsultants.find(c=>c.id === 'c3')?.name,
    clientId: '2',
    clientNameCache: initialClients.find(cl => cl.id === '2')?.companyName,
    projectId: 'proj202',
    projectNameCache: initialProjects.find(p => p.id === 'proj202')?.name,
    budgetId: 'bud-proj202',
    createdAt: formatISO(subDays(today, 5), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 5), { representation: 'date' }),
    taxAmount: 0, // Explicitly setting for clarity if no taxes apply
    totalAmountIncludingTax: 120.50,
  },
  {
    id: 'exp-003',
    date: formatISO(subDays(today, 15), { representation: 'date' }),
    description: 'Software Subscription for AI toolkit (General R&D)',
    amount: 99.00,
    currency: 'USD',
    category: 'Software & Subscriptions',
    status: 'Approved',
    submittedByConsultantId: 'c2',
    submittedByConsultantNameCache: initialConsultants.find(c=>c.id === 'c2')?.name,
    budgetId: 'bud-rd-2024',
    receiptUrl: 'https://placehold.co/200x100.png?text=Receipt2',
    approvedByUserId: 'adminUser1',
    approvedDate: formatISO(subDays(today, 12), { representation: 'date' }),
    createdAt: formatISO(subDays(today, 15), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 12), { representation: 'date' }),
    taxAmount: 0,
    totalAmountIncludingTax: 99.00,
  },
  {
    id: 'exp-004',
    date: formatISO(subDays(today, 2), { representation: 'date' }),
    description: 'Local travel for client meeting - Gamma Industries',
    amount: 35.00,
    currency: 'USD',
    category: 'Travel',
    status: 'Pending',
    submittedByConsultantId: 'c4',
    submittedByConsultantNameCache: initialConsultants.find(c=>c.id === 'c4')?.name,
    clientId: '4',
    clientNameCache: initialClients.find(cl => cl.id === '4')?.companyName,
    createdAt: formatISO(subDays(today, 2), { representation: 'date' }),
    updatedAt: formatISO(subDays(today, 2), { representation: 'date' }),
    applicableTaxRateIds: ['rate-ke-vat-std'],
    appliedTaxes: [{ taxRateId: 'rate-ke-vat-std', name: 'Kenyan VAT', rateValue: 16, amount: parseFloat((35.00 * 0.16).toFixed(2)), jurisdiction: 'Kenya', taxTypeName: 'Value Added Tax', isCompound: false }],
    taxAmount: parseFloat((35.00 * 0.16).toFixed(2)),
    totalAmountIncludingTax: parseFloat((35.00 * 1.16).toFixed(2)),
  },
];

const previousYear = currentYear -1;
export const financialHealthData: RevenueData[] = [
  { date: `${previousYear}-01-01`, actualRevenue: 50000, actualExpenses: 30000, month: 'Jan' },
  { date: `${previousYear}-02-01`, actualRevenue: 65000, actualExpenses: 35000, month: 'Feb' },
  { date: `${previousYear}-03-01`, actualRevenue: 58000, actualExpenses: 32000, month: 'Mar' },
  { date: `${previousYear}-04-01`, actualRevenue: 72000, actualExpenses: 40000, month: 'Apr' },
  { date: `${previousYear}-05-01`, actualRevenue: 68000, actualExpenses: 38000, month: 'May' },
  { date: `${previousYear}-06-01`, actualRevenue: 75000, actualExpenses: 42000, month: 'Jun' },
  { date: `${previousYear}-07-01`, actualRevenue: 82000, actualExpenses: 45000, month: 'Jul' },
  { date: `${previousYear}-08-01`, actualRevenue: 78000, actualExpenses: 43000, month: 'Aug' },
  { date: `${previousYear}-09-01`, actualRevenue: 85000, actualExpenses: 48000, month: 'Sep' },
  { date: `${previousYear}-10-01`, actualRevenue: 92000, actualExpenses: 50000, month: 'Oct' },
  { date: `${previousYear}-11-01`, actualRevenue: 88000, actualExpenses: 47000, month: 'Nov' },
  { date: `${previousYear}-12-01`, actualRevenue: 95000, actualExpenses: 52000, month: 'Dec' },
];

export const initialSystemUsers: SystemUser[] = [
  {
    id: 'user-001',
    name: 'Alex Mercer (Super Admin)',
    email: 'alex.mercer@consult.com',
    role: 'Administrator',
    status: 'Active',
    avatarUrl: 'https://placehold.co/100x100/78909C/FFFFFF.png?text=AM',
    lastLogin: formatISO(subDays(today, 1)),
    dateJoined: formatISO(subDays(today, 730)),
  },
  {
    id: 'user-002',
    name: 'Brenda Smith',
    email: 'brenda.smith@consult.com',
    role: 'Project Manager',
    status: 'Active',
    avatarUrl: 'https://placehold.co/100x100/4DB6AC/FFFFFF.png?text=BS',
    lastLogin: formatISO(subDays(today, 2)),
    dateJoined: formatISO(subDays(today, 365)),
    reportsToUserId: 'user-001',
    reportsToUserNameCache: 'Alex Mercer (Super Admin)',
  },
  {
    id: 'user-003',
    name: 'Charles Davis',
    email: 'charles.davis@consult.com',
    role: 'Consultant',
    status: 'Active',
    avatarUrl: 'https://placehold.co/100x100/AED581/333333.png?text=CD',
    lastLogin: formatISO(subDays(today, 0)),
    dateJoined: formatISO(subDays(today, 180)),
    reportsToUserId: 'user-002',
    reportsToUserNameCache: 'Brenda Smith',
  },
  {
    id: 'user-004',
    name: 'Diana Evans (Finance)',
    email: 'diana.evans@consult.com',
    role: 'Finance Manager',
    status: 'Active',
    avatarUrl: 'https://placehold.co/100x100/FF8A65/FFFFFF.png?text=DE',
    lastLogin: formatISO(subDays(today, 3)),
    dateJoined: formatISO(subDays(today, 500)),
    reportsToUserId: 'user-001',
    reportsToUserNameCache: 'Alex Mercer (Super Admin)',
  },
  {
    id: 'user-005',
    name: 'Edward Green (Invited)',
    email: 'edward.green.pending@consult.com',
    role: 'Consultant',
    status: 'Invited',
    avatarUrl: 'https://placehold.co/100x100/90A4AE/FFFFFF.png?text=EG',
    dateJoined: formatISO(subDays(today, 5)),
    reportsToUserId: 'user-002',
    reportsToUserNameCache: 'Brenda Smith',
  },
  {
    id: 'user-006',
    name: 'Fiona White (Inactive)',
    email: 'fiona.white.old@consult.com',
    role: 'Project Manager',
    status: 'Inactive',
    avatarUrl: 'https://placehold.co/100x100/BDBDBD/FFFFFF.png?text=FW',
    lastLogin: formatISO(subDays(today, 90)),
    dateJoined: formatISO(subDays(today, 600)),
    reportsToUserId: 'user-001',
    reportsToUserNameCache: 'Alex Mercer (Super Admin)',
  }
];

const revenueChartDataMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const historicalRevenueData: RevenueData[] = revenueChartDataMonths.slice(0,9).map((month, index) => ({
  date: `${currentYear-1}-${String(index+1).padStart(2,'0')}-01`,
  month: month,
  actualRevenue: 50000 + (index * 3000) + (Math.random() * 10000 - 5000), // Keep this for historical chart variation
  actualExpenses: 30000 + (index * 1500) + (Math.random() * 6000 - 3000), // Keep this for historical chart variation
}));

// Revenue Recognition Mock Data
export const initialRevenueRecognitionRules: RevenueRecognitionRule[] = [
  {
    id: 'rule-onpaid',
    name: 'Full Recognition on Invoice Payment',
    method: 'OnInvoicePaid',
    criteriaDescription: 'Recognize 100% of invoice value when the invoice status is "Paid".',
    isActive: true,
    createdAt: formatISO(subDays(today, 90)),
    updatedAt: formatISO(subDays(today, 90)),
  },
  {
    id: 'rule-milestone',
    name: 'Milestone Completion Based',
    method: 'MilestoneBased',
    criteriaDescription: 'Recognize revenue proportionally as project milestones are marked "Completed". E.g., Milestone 1 (20%), Milestone 2 (30%), Milestone 3 (50%). Specific percentages per milestone set at project level.',
    isActive: true,
    createdAt: formatISO(subDays(today, 80)),
    updatedAt: formatISO(subDays(today, 10)),
  },
  {
    id: 'rule-poc',
    name: 'Percentage of Completion (Time-Based)',
    method: 'PercentageOfCompletion',
    criteriaDescription: 'Recognize revenue based on the percentage of project duration elapsed or effort logged. Requires project start/end dates and progress tracking.',
    isActive: true,
    createdAt: formatISO(subDays(today, 70)),
    updatedAt: formatISO(subDays(today, 70)),
  },
  {
    id: 'rule-subscription-monthly',
    name: 'Monthly Subscription Recognition',
    method: 'SubscriptionBased',
    criteriaDescription: 'For retainer or subscription contracts, recognize revenue evenly on a monthly basis over the contract period.',
    isActive: false,
    createdAt: formatISO(subDays(today, 60)),
    updatedAt: formatISO(subDays(today, 60)),
  },
];

export const initialRecognizedRevenueEntries: RecognizedRevenueEntry[] = [
  {
    id: 'rr-001',
    invoiceId: 'INV-2024-001',
    invoiceNumberCache: 'INV-2024-001',
    projectId: initialInvoices.find(i => i.id === 'INV-2024-001')?.projectId,
    projectNameCache: initialInvoices.find(i => i.id === 'INV-2024-001')?.projectNameCache,
    clientId: initialInvoices.find(i => i.id === 'INV-2024-001')?.clientId,
    clientNameCache: initialInvoices.find(i => i.id === 'INV-2024-001')?.clientNameCache,
    dateRecognized: initialInvoices.find(i => i.id === 'INV-2024-001')?.paymentDate || formatISO(subDays(today,40)),
    amountRecognized: (initialInvoices.find(i => i.id === 'INV-2024-001')?.totalAmount || 0) * 0.5, // Example 50%
    currency: 'USD',
    recognitionRuleId: 'rule-onpaid',
    recognitionRuleNameCache: 'Full Recognition on Invoice Payment',
    notes: 'Partial recognition of Invoice INV-2024-001 upon payment.',
    createdAt: initialInvoices.find(i => i.id === 'INV-2024-001')?.paymentDate || formatISO(subDays(today,40)),
  },
  {
    id: 'rr-002',
    projectId: 'proj101',
    projectNameCache: 'Innovatech AI Overhaul',
    clientId: '1',
    clientNameCache: 'Innovatech Ltd.',
    dateRecognized: formatISO(subDays(today, 55)), // Corresponds to Milestone 1 completion
    amountRecognized: (initialProjects.find(p=>p.id==='proj101')?.financials.budget || 0) * 0.20, // 20% for milestone 1
    currency: 'USD',
    recognitionRuleId: 'rule-milestone',
    recognitionRuleNameCache: 'Milestone Completion Based',
    notes: 'Recognized revenue for Milestone 1 (Discovery & Planning) completion on proj101.',
    createdAt: formatISO(subDays(today, 55)),
  },
  {
    id: 'rr-003',
    projectId: 'proj202',
    projectNameCache: 'Alpha Solutions Predictive Model',
    clientId: '2',
    clientNameCache: 'Alpha Solutions',
    dateRecognized: formatISO(subDays(today, 10)), // Example PoC recognition
    amountRecognized: ((initialProjects.find(p=>p.id==='proj202')?.financials.budget || 0) / 3) * 0.30, // 30% of 1/3rd (approx for 30% completion of 1/3 duration)
    currency: 'USD',
    recognitionRuleId: 'rule-poc',
    recognitionRuleNameCache: 'Percentage of Completion (Time-Based)',
    notes: 'Recognized revenue based on project progress (approx 30% complete of first phase).',
    createdAt: formatISO(subDays(today, 10)),
  }
];

// Link some initial invoices to initial recognized revenue
initialInvoices.forEach(inv => {
  if (inv.id === 'INV-2024-001') {
    inv.recognizedRevenueEntries = [initialRecognizedRevenueEntries[0]];
    inv.deferredRevenueAmount = inv.totalAmount - (inv.recognizedRevenueEntries[0].amountRecognized);
  }
});
