
import type { Client, Consultant } from "@/lib/types";

// Mock data for Clients
export const initialClients: Client[] = [
  { id: '1', name: 'Innovatech Ltd.', email: 'contact@innovatech.com', company: 'Innovatech Ltd.', lastContact: '2024-07-15', status: 'Active' },
  { id: '2', name: 'Alpha Solutions', email: 'info@alphasolutions.io', company: 'Alpha Solutions', lastContact: '2024-06-20', status: 'Active' },
  { id: '3', name: 'Beta Corp', email: 'support@betacorp.dev', company: 'Beta Corp', lastContact: '2024-05-10', status: 'Inactive' },
  { id: '4', name: 'Gamma Industries', email: 'sales@gammaind.net', company: 'Gamma Industries', lastContact: '2024-07-01', status: 'Prospect' },
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
    // avatarUrl: null, // Example of no specific avatar
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
