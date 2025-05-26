
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project } from "@/lib/types";
import { initialProjects, initialClients, initialConsultants } from "@/lib/mockData"; // Assuming these are also needed for AddProjectDialog
import AddProjectDialog, { type AddProjectFormData } from "@/components/projects/add-project-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Briefcase } from "lucide-react";
import { PROJECT_STATUS } from '@/lib/constants';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
    setIsMounted(true);
  }, []);

  const handleAddProject = (formData: AddProjectFormData) => {
    const newProject: Project = {
      id: String(Date.now()), // Simple ID
      name: formData.name,
      description: formData.description,
      clientId: formData.clientId,
      clientNameCache: initialClients.find(c => c.id === formData.clientId)?.companyName || 'N/A',
      projectManagerId: formData.projectManagerId,
      projectManagerNameCache: initialConsultants.find(c => c.id === formData.projectManagerId)?.name || 'N/A',
      status: PROJECT_STATUS.TODO, // Default status
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      financials: {
        budget: formData.budget,
        spentBudget: 0,
        currency: 'USD', // Default currency
      },
      lastUpdated: new Date().toISOString(),
      completionPercent: 0,
      milestones: [],
      tasks: [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
    };
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  if (!isMounted) {
     return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
            <p className="text-muted-foreground">
              Oversee and manage all your consultancy projects.
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
          <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground">
            Oversee and manage all your consultancy projects.
          </p>
        </div>
        <AddProjectDialog 
          onAddProject={handleAddProject} 
          clients={initialClients} 
          consultants={initialConsultants} 
        />
      </header>

      {/* Placeholder for Project Table or Enhanced Kanban View */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-primary" />
            <CardTitle>All Projects</CardTitle>
          </div>
          <CardDescription>
            A comprehensive list of all projects. Click on a project name to view details.
            (Full table/kanban view coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <ul className="space-y-2">
              {projects.map(project => (
                <li key={project.id} className="p-3 border rounded-md hover:bg-muted/50">
                  <Link href={`/projects/${project.id}`} className="font-medium text-primary hover:underline">
                    {project.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">Client: {project.clientNameCache} - Status: {project.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No projects found. Add a new project to get started.</p>
          )}
        </CardContent>
      </Card>
      
      {/* We can re-introduce the task-based KanbanBoard later if needed,
          perhaps on a dedicated "Task Board" page or within a project's detail view.
      
      <KanbanBoard /> 
      
      */}
    </div>
  );
}
