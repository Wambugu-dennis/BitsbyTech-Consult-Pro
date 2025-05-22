
// src/app/consultants/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ConsultantTable from "@/components/consultants/consultant-table";
import AddConsultantDialog from "@/components/consultants/add-consultant-dialog";
import type { Consultant } from "@/lib/types";
import type { ConsultantFormData } from '@/components/consultants/add-consultant-dialog';

// Mock data - in a real app, this would come from a database/API
const initialConsultants: Consultant[] = [
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


export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Simulate fetching data and prevent hydration mismatch
    setConsultants(initialConsultants);
    setIsMounted(true);
  }, []);


  const handleAddConsultant = (newConsultantData: ConsultantFormData) => {
    setConsultants(prevConsultants => [
      ...prevConsultants,
      { 
        ...newConsultantData,
        id: String(Date.now()), // Simple ID generation for mock
        skills: newConsultantData.skills.split(',').map(s => s.trim()).filter(s => s),
        utilization: 0, // Default for new consultants
        status: 'Available', // Default for new consultants
        bio: newConsultantData.bio || '',
        avatarUrl: `https://placehold.co/100x100.png?text=${newConsultantData.name.substring(0,2).toUpperCase()}`, // Default avatar
      }
    ]);
  };

  if (!isMounted) {
    // Optional: show a loading state or skeleton
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consultant Hub</h1>
            <p className="text-muted-foreground">
              Manage consultant profiles, skills, and availability.
            </p>
          </div>
        </header>
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded-md w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultant Hub</h1>
          <p className="text-muted-foreground">
            Manage consultant profiles, skills, and availability.
          </p>
        </div>
        <AddConsultantDialog onAddConsultant={handleAddConsultant} />
      </header>
      <ConsultantTable consultants={consultants} />
    </div>
  );
}
