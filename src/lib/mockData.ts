
import type { Client, Consultant } from "@/lib/types";

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
    linkedProjectIds: ['proj101', 'proj105'],
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
    linkedProjectIds: ['proj202'],
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
    engagementDetails: { startDate: '2023-03-01', endDate: '2023-09-30' },
    keyContacts: [
      { id: 'kc3-1', name: 'Carol Danvers', role: 'Operations Manager', email: 'c.danvers@betacorp.example.dev', phone: '555-0300' }
    ],
    satisfactionScore: 70,
    notes: 'Previous engagement for process optimization. Potential for follow-up work.',
    financialSummary: { totalBilled: 45000, totalPaid: 45000, outstandingAmount: 0, currency: 'USD' },
    lastContact: '2023-09-25',
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
    currentProject: 'Innovatech AI Overhaul',
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
    currentProject: 'Alpha Solutions Predictive Model',
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
