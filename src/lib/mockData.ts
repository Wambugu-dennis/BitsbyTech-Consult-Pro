
import type { Client, Consultant, Project, ProjectTask, Invoice, InvoiceItem, Expense, Budget, BudgetStatus, BudgetType } from "@/lib/types";
import { PROJECT_STATUS, expenseCategories, budgetTypes, budgetStatuses } from "./constants"; 
import { formatISO, addDays, subDays, addMonths } from 'date-fns';

const today = new Date();

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
    notes: 'Long-term client, high value. Focus on AI and cloud solutions.',
    linkedProjectIds: ['proj101', 'proj105'], // Matched to initialProjects
    financialSummary: { totalBilled: 120000, totalPaid: 115000, outstandingAmount: 5000, lastInvoiceDate: '2024-07-01', currency: 'USD' },
    lastContact: '2024-07-15',
    communicationLogs: [
      {id: 'cl1', date: '2024-07-15', type: 'Meeting', summary: 'Quarterly review, positive feedback.', participants: ['Sarah Connor', 'Dr. Eleanor Vance']},
      {id: 'cl2', date: '2024-06-20', type: 'Email', summary: 'Sent project update for proj105.'}
    ]
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
    notes: 'Focused on data analytics and patient management systems.',
    linkedProjectIds: ['proj202'], // Matched to initialProjects
    financialSummary: { totalBilled: 75000, totalPaid: 75000, outstandingAmount: 0, lastInvoiceDate: '2024-06-15', currency: 'USD' },
    lastContact: '2024-07-20',
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
    notes: 'Previous engagement for process optimization. Potential for follow-up work.',
    financialSummary: { totalBilled: 45000, totalPaid: 45000, outstandingAmount: 0, currency: 'USD' },
    lastContact: '2023-09-25',
    linkedProjectIds: ['proj301'], // Matched to initialProjects
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
    notes: 'Initial discussions for supply chain optimization. Proposal sent.',
    lastContact: '2024-07-01',
  },
];

// Mock data for Consultants
export const initialConsultants: Consultant[] = [
  {
    id: 'c1',
    name: 'Dr. Eleanor Vance',
    email: 'eleanor.vance@consult.com',
    role: 'Lead Strategist',
    skills: ['Market Analysis', 'AI Strategy', 'Digital Transformation'],
    utilization: 75,
    status: 'On Project',
    currentProject: 'Innovatech AI Overhaul (proj101)',
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
    currentProject: 'Alpha Solutions Predictive Model (proj202)',
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
    status: 'Available',
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

// Mock data for Project Tasks
export const initialProjectTasks: ProjectTask[] = [
  { id: 'task-proj101-1', title: 'Discovery Phase for Innovatech', description: 'Initial client meetings and requirement gathering for AI Overhaul.', status: PROJECT_STATUS.TODO, assigneeId: 'c1', dueDate: '2024-08-15', priority: 'High' },
  { id: 'task-proj202-1', title: 'Develop UI Mockups for Alpha Solutions', description: 'Create wireframes and high-fidelity mockups for predictive model interface.', status: PROJECT_STATUS.IN_PROGRESS, assigneeId: 'c5', dueDate: '2024-08-20', priority: 'Medium'  },
  { id: 'task-proj101-2', title: 'Backend API Integration for Innovatech', description: 'Connect frontend to new microservices for AI features.', status: PROJECT_STATUS.IN_PROGRESS, assigneeId: 'c2', dueDate: '2024-09-01', priority: 'High'  },
  { id: 'task-proj301-1', title: 'Q&A Testing for Beta Corp App', description: 'Comprehensive testing of all features of process optimization app.', status: PROJECT_STATUS.TODO, assigneeId: 'c4', dueDate: '2024-09-10', priority: 'Medium'  },
  { id: 'task-proj105-1', title: 'Deploy Innovatech Cloud Platform V1', description: 'Final deployment to production environment.', status: PROJECT_STATUS.DONE, assigneeId: 'c1', dueDate: '2024-07-30', priority: 'High'  },
];


// Mock data for Projects
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
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    financials: { budget: 250000, spentBudget: 120000, currency: 'USD', billingType: 'Fixed Price' },
    milestones: [
      { id: 'm101-1', name: 'Phase 1: Discovery & Planning', dueDate: '2024-03-15', status: 'Completed' },
      { id: 'm101-2', name: 'Phase 2: Model Development', dueDate: '2024-07-30', status: 'In Progress' },
      { id: 'm101-3', name: 'Phase 3: Integration & Testing', dueDate: '2024-10-31', status: 'Pending' },
    ],
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj101')),
    tags: ['AI', 'Machine Learning', 'Cloud Integration'],
    lastUpdated: new Date().toISOString(),
    completionPercent: 45,
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
    startDate: '2024-04-15',
    endDate: '2024-11-30',
    financials: { budget: 150000, spentBudget: 65000, currency: 'USD', billingType: 'Time & Materials', hourlyRate: 150 },
    milestones: [
      { id: 'm202-1', name: 'Data Collection & Cleaning', dueDate: '2024-05-30', status: 'Completed' },
      { id: 'm202-2', name: 'Model Prototyping', dueDate: '2024-08-15', status: 'In Progress' },
      { id: 'm202-3', name: 'Deployment & Validation', dueDate: '2024-11-15', status: 'Pending' },
    ],
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj202')),
    tags: ['Healthcare', 'Predictive Analytics', 'Data Science'],
    lastUpdated: new Date().toISOString(),
    completionPercent: 30,
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
    startDate: '2023-03-01',
    endDate: '2023-09-30',
    actualEndDate: '2023-09-28',
    financials: { budget: 80000, spentBudget: 78000, currency: 'USD', billingType: 'Fixed Price' },
    tags: ['Manufacturing', 'Process Improvement', 'Lean Six Sigma'],
    lastUpdated: '2023-10-05T10:00:00Z',
    completionPercent: 100,
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj301')),
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
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    financials: { budget: 180000, spentBudget: 5000, currency: 'USD', billingType: 'Fixed Price' },
    milestones: [
        { id: 'm105-1', name: 'Planning & Assessment', dueDate: '2024-10-15', status: 'Pending'},
        { id: 'm105-2', name: 'Development & Migration', dueDate: '2025-01-31', status: 'Pending'},
        { id: 'm105-3', name: 'Testing & Go-live', dueDate: '2025-03-15', status: 'Pending'},
    ],
    tasks: initialProjectTasks.filter(t => t.id.startsWith('task-proj105')),
    tags: ['Cloud Migration', 'Infrastructure', 'AWS'],
    lastUpdated: new Date().toISOString(),
    completionPercent: 5,
  }
];

// Mock data for Invoices
const generateInvoiceItems = (num: number, basePrice: number): { items: InvoiceItem[], subTotal: number } => {
  const items: InvoiceItem[] = [];
  let subTotal = 0;
  for (let i = 1; i <= num; i++) {
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = basePrice * (Math.random() * 0.5 + 0.75); // +/- 25% of basePrice
    const totalPrice = quantity * unitPrice;
    items.push({
      id: `item-${Date.now()}-${i}`,
      description: `Consulting Service ${i} / Development Hours`,
      quantity,
      unitPrice: parseFloat(unitPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
    subTotal += totalPrice;
  }
  return { items, subTotal: parseFloat(subTotal.toFixed(2)) };
};

const createInvoice = (id: string, client: Client, project: Project | undefined, status: InvoiceStatus, daysOffset: number, itemsInfo: { items: InvoiceItem[], subTotal: number }): Invoice => {
  const issueDate = formatISO(subDays(today, daysOffset), { representation: 'date' });
  const dueDate = formatISO(addDays(new Date(issueDate), 30), { representation: 'date' });
  const taxRate = 0.08; // 8%
  const taxAmount = parseFloat((itemsInfo.subTotal * taxRate).toFixed(2));
  const totalAmount = parseFloat((itemsInfo.subTotal + taxAmount).toFixed(2));

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
    taxRate,
    taxAmount,
    totalAmount,
    status,
    currency: 'USD',
    notes: 'Thank you for your business. Payment is due within 30 days.',
    paymentDetails: 'Bank: Global Consultants Bank, Account: 123-456-789, SWIFT: GCBKUS33',
    createdAt: formatISO(subDays(today, daysOffset + 2)),
    updatedAt: formatISO(subDays(today, daysOffset + 1)),
    paymentDate: status === 'Paid' ? formatISO(subDays(today, daysOffset - 5)) : undefined,
  };
};

const inv1Items = generateInvoiceItems(3, 1500);
const inv2Items = generateInvoiceItems(2, 2500);
const inv3Items = generateInvoiceItems(5, 1000);
const inv4Items = generateInvoiceItems(1, 5000);

export const initialInvoices: Invoice[] = [
  createInvoice('INV-2024-001', initialClients[0], initialProjects.find(p => p.clientId === initialClients[0].id), 'Paid', 45, inv1Items),
  createInvoice('INV-2024-002', initialClients[1], initialProjects.find(p => p.clientId === initialClients[1].id), 'Sent', 20, inv2Items),
  createInvoice('INV-2024-003', initialClients[0], initialProjects.find(p => p.clientId === initialClients[0].id && p.id === 'proj105'), 'Overdue', 35, inv3Items),
  createInvoice('INV-2024-004', initialClients[2], undefined, 'Draft', 5, inv4Items),
];

// Mock data for Expenses
export const initialExpenses: Expense[] = [
  {
    id: 'exp-001',
    date: formatISO(subDays(today, 10), { representation: 'date' }),
    description: 'Flight to Innovatech Ltd. for project kickoff (proj101)',
    amount: 450.75,
    currency: 'USD',
    category: 'Travel',
    status: 'Approved',
    submittedByConsultantId: 'c1',
    submittedByConsultantNameCache: initialConsultants.find(c=>c.id === 'c1')?.name,
    clientId: '1',
    clientNameCache: initialClients.find(cl => cl.id === '1')?.companyName,
    projectId: 'proj101',
    projectNameCache: initialProjects.find(p => p.id === 'proj101')?.name,
    receiptUrl: 'https://placehold.co/200x100.png?text=Receipt1',
    notes: 'Kickoff meeting travel expense.',
    approvedByUserId: 'adminUser1',
    approvedDate: formatISO(subDays(today, 8)),
    createdAt: formatISO(subDays(today, 10)),
    updatedAt: formatISO(subDays(today, 8)),
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
    createdAt: formatISO(subDays(today, 5)),
    updatedAt: formatISO(subDays(today, 5)),
  },
  {
    id: 'exp-003',
    date: formatISO(subDays(today, 15), { representation: 'date' }),
    description: 'Software Subscription for AI toolkit',
    amount: 99.00,
    currency: 'USD',
    category: 'Software & Subscriptions',
    status: 'Approved',
    submittedByConsultantId: 'c2',
    submittedByConsultantNameCache: initialConsultants.find(c=>c.id === 'c2')?.name,
    receiptUrl: 'https://placehold.co/200x100.png?text=Receipt2',
    approvedByUserId: 'adminUser1',
    approvedDate: formatISO(subDays(today, 12)),
    createdAt: formatISO(subDays(today, 15)),
    updatedAt: formatISO(subDays(today, 12)),
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
    createdAt: formatISO(subDays(today, 2)),
    updatedAt: formatISO(subDays(today, 2)),
  },
];

// Mock data for Budgets
export const initialBudgets: Budget[] = [
  {
    id: 'bud-proj101',
    name: 'Innovatech AI Overhaul Budget',
    type: 'Project',
    linkedProjectId: 'proj101',
    linkedProjectNameCache: initialProjects.find(p => p.id === 'proj101')?.name,
    totalAmount: initialProjects.find(p => p.id === 'proj101')?.financials.budget || 250000,
    // Simulate spent amount based on some expenses or project progress
    spentAmount: (initialProjects.find(p => p.id === 'proj101')?.financials.spentBudget || 120000) + (initialExpenses.find(e => e.projectId === 'proj101')?.amount || 0),
    currency: 'USD',
    startDate: initialProjects.find(p => p.id === 'proj101')?.startDate || formatISO(subDays(today, 180)),
    endDate: initialProjects.find(p => p.id === 'proj101')?.endDate || formatISO(addDays(today, 180)),
    status: 'Active',
    description: 'Budget for the AI overhaul project with Innovatech Ltd.',
    createdAt: formatISO(subDays(today, 182)),
    updatedAt: formatISO(subDays(today, 10)),
  },
  {
    id: 'bud-proj202',
    name: 'Alpha Solutions Model Budget',
    type: 'Project',
    linkedProjectId: 'proj202',
    linkedProjectNameCache: initialProjects.find(p => p.id === 'proj202')?.name,
    totalAmount: initialProjects.find(p => p.id === 'proj202')?.financials.budget || 150000,
    spentAmount: (initialProjects.find(p => p.id === 'proj202')?.financials.spentBudget || 65000) + (initialExpenses.find(e => e.projectId === 'proj202')?.amount || 0),
    currency: 'USD',
    startDate: initialProjects.find(p => p.id === 'proj202')?.startDate || formatISO(subDays(today, 90)),
    endDate: initialProjects.find(p => p.id === 'proj202')?.endDate || formatISO(addDays(today, 90)),
    status: 'Active',
    createdAt: formatISO(subDays(today, 92)),
    updatedAt: formatISO(subDays(today, 5)),
  },
  {
    id: 'bud-marketing-q3',
    name: 'Q3 Marketing Budget',
    type: 'Departmental',
    departmentName: 'Marketing',
    totalAmount: 50000,
    spentAmount: 35000, // Assume some marketing expenses
    currency: 'USD',
    startDate: formatISO(addMonths(today, -2)), // Assuming Q3 started 2 months ago
    endDate: formatISO(addMonths(today, 1)), // Q3 ends in 1 month
    status: 'Active',
    description: 'Quarterly budget for all marketing activities.',
    createdAt: formatISO(addMonths(today, -2)),
    updatedAt: formatISO(subDays(today, 3)),
  },
  {
    id: 'bud-training-annual',
    name: 'Annual Training & Development Budget',
    type: 'General',
    totalAmount: 75000,
    spentAmount: 80000, // Overspent
    currency: 'USD',
    startDate: formatISO(subDays(today, 300)), // Annual budget started ~10 months ago
    endDate: formatISO(addDays(today, 65)), // Ends in ~2 months
    status: 'Overspent',
    description: 'Annual budget for consultant training, certifications, and conferences.',
    createdAt: formatISO(subDays(today, 300)),
    updatedAt: formatISO(subDays(today, 1)),
  },
   {
    id: 'bud-rd-2024',
    name: 'R&D 2024 Budget',
    type: 'Departmental',
    departmentName: 'Research & Development',
    totalAmount: 120000,
    spentAmount: 115000,
    currency: 'USD',
    startDate: formatISO(new Date(today.getFullYear(), 0, 1)), // Start of current year
    endDate: formatISO(new Date(today.getFullYear(), 11, 31)), // End of current year
    status: 'Completed', // Assuming R&D for the year is mostly done or budget is finalized
    description: 'Budget for all R&D initiatives for the year 2024.',
    createdAt: formatISO(new Date(today.getFullYear(), 0, 1)),
    updatedAt: formatISO(subDays(today, 15)),
  },
];
