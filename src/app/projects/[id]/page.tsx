
// src/app/projects/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Project, Client, Consultant } from '@/lib/types'; // Ensure all types are imported
import { initialProjects, initialClients, initialConsultants } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Briefcase, Users, UserCog, CalendarDays, Target, DollarSign, Paperclip, ListChecks, Tag, Info, Users2, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


const getProjectById = (id: string): Project | undefined => {
  return initialProjects.find(project => project.id === id);
};
const getClientById = (id?: string): Client | undefined => {
  if (!id) return undefined;
  return initialClients.find(client => client.id === id);
};
const getConsultantById = (id?: string): Consultant | undefined => {
  if (!id) return undefined;
  return initialConsultants.find(consultant => consultant.id === id);
};

export default function ProjectProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProject = getProjectById(id);
      setProject(foundProject || null);
    }
    setIsMounted(true);
  }, [id]);

  const getStatusColor = (status: Project['status']): string => {
    switch (status) {
      case 'To Do': return 'bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-300';
      case 'In Progress': return 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300';
      case 'Done': return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300';
      default: return 'border-border';
    }
  };
   const getPriorityColor = (priority: Project['priority']): string => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  if (!isMounted) {
    return ( // Skeleton loader
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-4">
            <Card><CardHeader><div className="h-6 bg-muted rounded w-1/2"></div></CardHeader><CardContent className="space-y-2"><div className="h-4 bg-muted rounded w-3/4"></div><div className="h-4 bg-muted rounded w-full"></div><div className="h-4 bg-muted rounded w-2/3"></div></CardContent></Card>
          </div>
          <div className="md:col-span-8">
            <Card><CardHeader><div className="h-10 bg-muted rounded w-full"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold">Project Not Found</h1>
        <p className="text-muted-foreground mb-4">The project profile you are looking for does not exist.</p>
        <Button onClick={() => router.push('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }
  
  const client = getClientById(project.clientId);
  const projectManager = getConsultantById(project.projectManagerId);
  const teamMembers = project.teamMemberIds?.map(id => getConsultantById(id)).filter(Boolean) as Consultant[];

  const projectProgress = project.completionPercent || 0;


  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push('/projects')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-primary hover:underline text-lg">
              For: {client.companyName}
            </Link>
          )}
        </div>
        {/* Add Edit Project Button Here */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar / Info Column */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Status & Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className={cn("capitalize text-sm px-3 py-1 mb-2 w-full justify-center", getStatusColor(project.status))}>
                {project.status}
              </Badge>
              <p className={cn("text-sm font-semibold text-center", getPriorityColor(project.priority))}>{project.priority} Priority</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project Manager</CardTitle>
            </CardHeader>
            <CardContent>
              {projectManager ? (
                <Link href={`/consultants/${projectManager.id}`} className="flex items-center gap-2 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={projectManager.avatarUrl} alt={projectManager.name} data-ai-hint="person avatar"/>
                    <AvatarFallback>{projectManager.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium group-hover:underline text-primary">{projectManager.name}</p>
                    <p className="text-xs text-muted-foreground">{projectManager.role}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Not assigned</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
                <p><strong>Start:</strong> {format(new Date(project.startDate), "PPP")}</p>
                <p><strong>End (Planned):</strong> {format(new Date(project.endDate), "PPP")}</p>
                {project.actualEndDate && <p><strong>Completed:</strong> {format(new Date(project.actualEndDate), "PPP")}</p>}
            </CardContent>
          </Card>

          <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Progress value={projectProgress} className="h-2 flex-1" 
                    indicatorClassName={
                      projectProgress >= 80 ? 'bg-green-500' : projectProgress >= 50 ? 'bg-blue-500' : projectProgress > 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  />
                  <span className="text-sm font-semibold">{projectProgress}%</span>
                </div>
              </CardContent>
            </Card>

        </div>

        {/* Right Main Content with Tabs */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
              <TabsTrigger value="overview"><Info className="mr-1 h-4 w-4 sm:mr-2"/>Overview</TabsTrigger>
              <TabsTrigger value="tasks"><ListChecks className="mr-1 h-4 w-4 sm:mr-2"/>Tasks</TabsTrigger>
              <TabsTrigger value="milestones"><Target className="mr-1 h-4 w-4 sm:mr-2"/>Milestones</TabsTrigger>
              <TabsTrigger value="financials"><DollarSign className="mr-1 h-4 w-4 sm:mr-2"/>Financials</TabsTrigger>
              <TabsTrigger value="documents"><Paperclip className="mr-1 h-4 w-4 sm:mr-2"/>Docs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Project Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {project.description || 'No detailed description provided.'}
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users2 className="h-5 w-5 text-primary"/>Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {teamMembers.length > 0 ? teamMembers.map(member => (
                        <Link href={`/consultants/${member.id}`} key={member.id} className="flex items-center gap-3 group p-2 rounded-md hover:bg-muted/50">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person avatar"/>
                                <AvatarFallback>{member.name.substring(0,1)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium group-hover:underline text-primary">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                        </Link>
                    )) : <p className="text-sm text-muted-foreground">No team members assigned yet.</p>}
                </CardContent>
              </Card>
              {project.tags && project.tags.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary"/>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Project Tasks</CardTitle>
                  <CardDescription>Manage and track individual tasks for {project.name}.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Task management and Kanban board for this project are under development.</p>
                   {project.tasks && project.tasks.length > 0 && (
                    <div className="mt-4 text-left text-sm">
                        <h4 className="font-semibold mb-2">Sample Tasks:</h4>
                        <ul className="list-disc list-inside">
                            {project.tasks.slice(0,3).map(task => <li key={task.id}>{task.title} ({task.status})</li>)}
                             {project.tasks.length > 3 && <li>And {project.tasks.length-3} more...</li>}
                        </ul>
                    </div>
                   )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="milestones">
                <Card>
                <CardHeader>
                    <CardTitle>Project Milestones</CardTitle>
                    <CardDescription>Key checkpoints and deliverables for {project.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {project.milestones && project.milestones.length > 0 ? (
                    <div className="space-y-4">
                        {project.milestones.map(milestone => (
                        <div key={milestone.id} className="p-3 border rounded-md bg-muted/20">
                            <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{milestone.name}</h4>
                                <p className="text-xs text-muted-foreground">Due: {format(new Date(milestone.dueDate), "PPP")}</p>
                            </div>
                            <Badge variant={milestone.status === 'Completed' ? 'default' : milestone.status === 'Delayed' || milestone.status === 'At Risk' ? 'destructive' : 'outline'} 
                                   className={cn(milestone.status === 'Completed' ? 'bg-green-500/20 border-green-500' : '')}>
                                {milestone.status}
                            </Badge>
                            </div>
                            {milestone.description && <p className="text-sm mt-1 text-muted-foreground">{milestone.description}</p>}
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-10">
                        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No milestones defined for this project yet.</p>
                    </div>
                    )}
                </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Budget, spending, and billing details for {project.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                   <p><strong>Budget:</strong> {project.financials.currency} {project.financials.budget.toLocaleString()}</p>
                   <p><strong>Spent:</strong> {project.financials.currency} {project.financials.spentBudget.toLocaleString()}</p>
                   <p><strong>Remaining:</strong> {project.financials.currency} {(project.financials.budget - project.financials.spentBudget).toLocaleString()}</p>
                   <Progress value={(project.financials.spentBudget / project.financials.budget) * 100} className="h-3 mt-1" 
                    indicatorClassName={(project.financials.spentBudget > project.financials.budget) ? "bg-red-500" : "bg-primary"}
                   />
                   {project.financials.billingType && <p className="mt-2"><strong>Billing Type:</strong> {project.financials.billingType}</p>}
                   {project.financials.billingType === "Time & Materials" && project.financials.hourlyRate && <p><strong>Hourly Rate:</strong> {project.financials.currency} {project.financials.hourlyRate}/hr</p>}
                   <p className="text-xs text-muted-foreground mt-4">More detailed financial tracking and invoicing will be available in the Finances module.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Attachments</CardTitle>
                  <CardDescription>Repository for all project-related files.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <Paperclip className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Document management is under development.</p>
                  {project.attachments && project.attachments.length > 0 && (
                     <div className="mt-4 text-left text-sm">
                        <h4 className="font-semibold mb-2">Sample Attachments:</h4>
                        <ul className="list-disc list-inside">
                            {project.attachments.map(att => <li key={att.id}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{att.fileName}</a></li>)}
                        </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

    
