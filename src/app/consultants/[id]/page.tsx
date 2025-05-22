
// src/app/consultants/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Consultant } from '@/lib/types';
import { initialConsultants } from '@/lib/mockData'; // Updated import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Phone, Briefcase, Users, CalendarDays, Award, BarChart2, Star } from 'lucide-react';
import { CONSULTANT_STATUS_COLORS, CONSULTANT_STATUS_VARIANTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// In a real app, this data would be fetched from an API
const getConsultantById = (id: string): Consultant | undefined => {
  return initialConsultants.find(consultant => consultant.id === id);
};

export default function ConsultantProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundConsultant = getConsultantById(id);
      setConsultant(foundConsultant || null);
    }
    setIsMounted(true);
  }, [id]);

  if (!isMounted) {
    return ( // Skeleton loader
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card><CardHeader><div className="h-24 w-24 bg-muted rounded-full mx-auto"></div></CardHeader><CardContent><div className="h-6 bg-muted rounded w-3/4 mx-auto"></div><div className="h-4 bg-muted rounded w-1/2 mx-auto mt-2"></div></CardContent></Card>
            <Card><CardHeader><CardTitle><div className="h-6 bg-muted rounded w-1/3"></div></CardTitle></CardHeader><CardContent><div className="h-4 bg-muted rounded w-full mb-2"></div><div className="h-4 bg-muted rounded w-full"></div></CardContent></Card>
          </div>
          <div className="md:col-span-2">
            <Card><CardHeader><div className="h-10 bg-muted rounded w-full"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="text-center py-10">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold">Consultant Not Found</h1>
        <p className="text-muted-foreground mb-4">The consultant profile you are looking for does not exist.</p>
        <Button onClick={() => router.push('/consultants')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Consultants
        </Button>
      </div>
    );
  }
  
  const getStatusColorClass = (status: typeof consultant.status): string => {
    return CONSULTANT_STATUS_COLORS[status] || 'bg-muted text-muted-foreground border-border';
  };
  const getStatusVariant = (status: typeof consultant.status) => {
    return CONSULTANT_STATUS_VARIANTS[status] || 'secondary';
  }
   const getUtilizationColor = (utilization: number): string => {
    if (utilization >= 85) return 'bg-green-500';
    if (utilization >= 60) return 'bg-yellow-500';
    if (utilization > 0) return 'bg-orange-500';
    return 'bg-primary';
  };


  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push('/consultants')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Consultants
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{consultant.name}</h1>
          <p className="text-muted-foreground">{consultant.role}</p>
        </div>
        {/* Future actions like Edit Profile could go here */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar / Info Column */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20 shadow-md">
                <AvatarImage src={consultant.avatarUrl || `https://placehold.co/128x128.png?text=${consultant.name.substring(0,2).toUpperCase()}`} alt={consultant.name} data-ai-hint="person avatar professional"/>
                <AvatarFallback className="text-4xl">{consultant.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <Badge variant={getStatusVariant(consultant.status)} className={cn("capitalize mb-2 text-sm px-3 py-1", getStatusColorClass(consultant.status))}>
                  {consultant.status}
                </Badge>
                 {consultant.currentProject && consultant.status === 'On Project' && (
                  <p className="text-xs text-muted-foreground">
                    Currently on: <span className="font-medium text-foreground">{consultant.currentProject}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${consultant.email}`} className="text-primary hover:underline">{consultant.email}</a>
              </div>
              {consultant.phone && (
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{consultant.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-1">
                <Progress value={consultant.utilization} className="h-3 flex-1" indicatorClassName={getUtilizationColor(consultant.utilization)} />
                <span className="text-lg font-semibold w-[50px] text-right">{consultant.utilization}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Current project load capacity.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Main Content with Tabs */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
              <TabsTrigger value="overview"><Star className="mr-1 h-4 w-4 sm:mr-2"/>Overview</TabsTrigger>
              <TabsTrigger value="projects"><Briefcase className="mr-1 h-4 w-4 sm:mr-2"/>Projects</TabsTrigger>
              <TabsTrigger value="skills"><Award className="mr-1 h-4 w-4 sm:mr-2"/>Skills & Certs</TabsTrigger>
              <TabsTrigger value="availability"><CalendarDays className="mr-1 h-4 w-4 sm:mr-2"/>Availability</TabsTrigger>
              <TabsTrigger value="performance"><BarChart2 className="mr-1 h-4 w-4 sm:mr-2"/>Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {consultant.bio || 'No biography provided.'}
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Core Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultant.skills.length > 0 ? consultant.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                    )) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Project Involvement</CardTitle>
                  <CardDescription>History of projects this consultant has worked on.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Project history details will be available here soon.</p>
                  <p className="text-xs text-muted-foreground mt-1">This section will link to the Project Management module.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Skills & Certifications</CardTitle>
                  <CardDescription>In-depth view of expertise, proficiency levels, and official certifications.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Detailed skills, proficiency, and certifications will be listed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                  <CardDescription>View consultant's schedule, booked periods, and upcoming availability.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">An interactive availability calendar will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators, client feedback scores, and project success rates.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Performance analytics and feedback will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
