
// src/app/consultants/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ConsultantTable from "@/components/consultants/consultant-table";
import AddConsultantDialog from "@/components/consultants/add-consultant-dialog";
import type { Consultant } from "@/lib/types";
import type { ConsultantFormData } from '@/components/consultants/add-consultant-dialog';
import { initialConsultants } from '@/lib/mockData'; // Updated import

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
