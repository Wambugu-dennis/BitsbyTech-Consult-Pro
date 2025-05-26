
// src/app/clients/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Client, Consultant, KeyContact } from '@/lib/types';
import { initialClients, initialConsultants } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Mail, Phone, Briefcase, Users, Globe, Building, Edit, MessageSquare, DollarSign, FileText, MapPin, Info, Users2, LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// In a real app, this data would be fetched from an API
const getClientById = (id: string): Client | undefined => {
  return initialClients.find(client => client.id === id);
};
const getConsultantById = (id?: string): Consultant | undefined => {
  if (!id) return undefined;
  return initialConsultants.find(consultant => consultant.id === id);
};

export default function ClientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      setClient(foundClient || null);
    }
    setIsMounted(true);
  }, [id]);

  const getStatusColor = (status?: Client['status']): string => {
    switch (status) {
      case 'Active': return 'text-green-600 dark:text-green-400';
      case 'Inactive': return 'text-gray-600 dark:text-gray-400';
      case 'Prospect': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-muted-foreground';
    }
  };
   const getStatusBadgeVariant = (status?: Client['status']): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Prospect': return 'outline';
      default: return 'secondary';
    }
  };
   const getStatusBadgeClass = (status?: Client['status']): string => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 border-green-500';
      case 'Inactive': return 'bg-gray-500/20 border-gray-500';
      case 'Prospect': return 'bg-blue-500/20 border-blue-500';
      default: return 'border-border';
    }
  };

  const getTierColor = (tier?: Client['clientTier']): string => {
    switch (tier) {
      case 'Strategic': return 'text-purple-600 dark:text-purple-400';
      case 'Key': return 'text-indigo-600 dark:text-indigo-400';
      case 'Standard': return 'text-sky-600 dark:text-sky-400';
      default: return 'text-muted-foreground';
    }
  };


  if (!isMounted) {
    return ( // Skeleton loader
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-4">
            <Card><CardHeader><div className="h-24 w-24 bg-muted rounded-md mx-auto"></div></CardHeader><CardContent><div className="h-6 bg-muted rounded w-3/4 mx-auto"></div><div className="h-4 bg-muted rounded w-1/2 mx-auto mt-2"></div></CardContent></Card>
            <Card><CardHeader><CardTitle><div className="h-6 bg-muted rounded w-1/3"></div></CardTitle></CardHeader><CardContent><div className="h-4 bg-muted rounded w-full mb-2"></div><div className="h-4 bg-muted rounded w-full"></div></CardContent></Card>
          </div>
          <div className="md:col-span-8">
            <Card><CardHeader><div className="h-10 bg-muted rounded w-full"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded"></div></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold">Client Not Found</h1>
        <p className="text-muted-foreground mb-4">The client profile you are looking for does not exist.</p>
        <Button onClick={() => router.push('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </div>
    );
  }
  
  const primaryConsultant = getConsultantById(client.engagementDetails?.primaryConsultantId);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push('/clients')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
          <p className="text-muted-foreground">{client.industry || 'Industry not specified'}</p>
        </div>
        <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Client
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar / Info Column */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-2 border-muted rounded-md">
                <AvatarImage src={client.logoUrl || `https://placehold.co/128x128.png?text=${client.companyName.substring(0,2).toUpperCase()}`} alt={client.companyName} data-ai-hint="company logo business" />
                <AvatarFallback className="text-3xl rounded-md">
                  {client.logoUrl ? client.companyName.substring(0,2).toUpperCase() : <Building className="h-10 w-10 text-muted-foreground"/>}
                </AvatarFallback>
              </Avatar>
              
              <Badge variant={getStatusBadgeVariant(client.status)} className={cn("capitalize mb-2 text-sm px-3 py-1", getStatusBadgeClass(client.status))}>
                {client.status}
              </Badge>
              {client.clientTier && (
                <p className={cn("text-sm font-semibold", getTierColor(client.clientTier))}>{client.clientTier} Tier</p>
              )}
              {client.website && (
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                  <Globe className="h-3 w-3" /> {client.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </CardContent>
          </Card>
          
          {client.satisfactionScore !== undefined && client.satisfactionScore > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Progress value={client.satisfactionScore} className="h-2 flex-1" 
                    indicatorClassName={
                      client.satisfactionScore >= 80 ? 'bg-green-500' : client.satisfactionScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  />
                  <span className="text-sm font-semibold">{client.satisfactionScore}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Primary Consultant</CardTitle>
            </CardHeader>
            <CardContent>
              {primaryConsultant ? (
                <Link href={`/consultants/${primaryConsultant.id}`} className="flex items-center gap-2 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={primaryConsultant.avatarUrl} alt={primaryConsultant.name} data-ai-hint="person avatar"/>
                    <AvatarFallback>{primaryConsultant.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium group-hover:underline text-primary">{primaryConsultant.name}</p>
                    <p className="text-xs text-muted-foreground">{primaryConsultant.role}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Not assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Main Content with Tabs */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
              <TabsTrigger value="overview"><Info className="mr-1 h-4 w-4 sm:mr-2"/>Overview</TabsTrigger>
              <TabsTrigger value="contacts"><Users2 className="mr-1 h-4 w-4 sm:mr-2"/>Contacts</TabsTrigger>
              <TabsTrigger value="projects"><Briefcase className="mr-1 h-4 w-4 sm:mr-2"/>Projects</TabsTrigger>
              <TabsTrigger value="communications"><MessageSquare className="mr-1 h-4 w-4 sm:mr-2"/>Logs</TabsTrigger>
              <TabsTrigger value="financials"><DollarSign className="mr-1 h-4 w-4 sm:mr-2"/>Financials</TabsTrigger>
              {/* <TabsTrigger value="contracts"><FileText className="mr-1 h-4 w-4 sm:mr-2"/>Contracts</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {client.address ? (
                    <>
                      {client.address.street && <p>{client.address.street}</p>}
                      <p>{client.address.city && `${client.address.city}, `}{client.address.state && `${client.address.state} `}{client.address.zip}</p>
                      {client.address.country && <p>{client.address.country}</p>}
                    </>
                  ) : 'No address provided.'}
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Engagement Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p><strong>Start Date:</strong> {client.engagementDetails?.startDate || 'N/A'}</p>
                  <p><strong>End Date:</strong> {client.engagementDetails?.endDate || 'Ongoing'}</p>
                </CardContent>
              </Card>
              {client.notes && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>General Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {client.notes}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Key Contacts</CardTitle>
                  <CardDescription>Main points of contact at {client.companyName}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {client.keyContacts?.length > 0 ? client.keyContacts.map((contact, index) => (
                    <React.Fragment key={contact.id}>
                    <div className="p-3 border rounded-md bg-muted/20">
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                      <div className="mt-1 space-y-0.5">
                        {contact.email && <div className="flex items-center text-xs"><Mail className="mr-1.5 h-3 w-3 text-muted-foreground" /><a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></div>}
                        {contact.phone && <div className="flex items-center text-xs"><Phone className="mr-1.5 h-3 w-3 text-muted-foreground" />{contact.phone}</div>}
                      </div>
                    </div>
                    {index < client.keyContacts.length -1 && <Separator />}
                    </React.Fragment>
                  )) : <p className="text-sm text-muted-foreground">No key contacts listed.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Associated Projects</CardTitle>
                  <CardDescription>Projects undertaken for {client.companyName}.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Project linking is under development.</p>
                  <p className="text-xs text-muted-foreground mt-1">This section will show projects like: {client.linkedProjectIds?.join(', ') || 'None'}</p>
                  {client.linkedProjectIds?.map(projId => (
                    <p key={projId} className="text-xs mt-1">
                      <Link href={`/projects/${projId}`} className="text-primary hover:underline flex items-center justify-center gap-1">
                        View Project {projId} <LinkIcon className="h-3 w-3"/>
                      </Link>
                    </p>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="communications">
                <Card>
                <CardHeader>
                    <CardTitle>Communication Logs</CardTitle>
                    <CardDescription>Record of interactions with {client.companyName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {client.communicationLogs && client.communicationLogs.length > 0 ? (
                    <div className="space-y-4">
                        {client.communicationLogs.map(log => (
                        <div key={log.id} className="p-3 border rounded-md bg-muted/20">
                            <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{log.type}</h4>
                                <p className="text-xs text-muted-foreground">Date: {log.date}</p>
                            </div>
                            {log.relatedProjectId && (
                                <Badge variant="outline" className="text-xs">Project: {log.relatedProjectId}</Badge>
                            )}
                            </div>
                            <p className="text-sm mt-1">{log.summary}</p>
                            {log.participants && log.participants.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Participants: {log.participants.join(', ')}
                            </p>
                            )}
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-10">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No communication logs recorded yet.</p>
                    </div>
                    )}
                </CardContent>
                </Card>
            </TabsContent>


            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Summary of financial interactions with {client.companyName}.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                   {client.financialSummary ? (
                     <div className="space-y-3 text-left">
                        <p><strong>Total Billed:</strong> {client.financialSummary.currency} {client.financialSummary.totalBilled?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Total Paid:</strong> {client.financialSummary.currency} {client.financialSummary.totalPaid?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Outstanding Amount:</strong> <span className={cn( (client.financialSummary.outstandingAmount || 0) > 0 ? "text-red-600 font-semibold" : "text-green-600")}>{client.financialSummary.currency} {client.financialSummary.outstandingAmount?.toLocaleString() || 'N/A'}</span></p>
                        <p><strong>Last Invoice Date:</strong> {client.financialSummary.lastInvoiceDate || 'N/A'}</p>
                     </div>
                   ): (
                    <>
                      <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Financial details are being compiled.</p>
                    </>
                   )}
                  <p className="text-xs text-muted-foreground mt-4">Full financial history and invoicing will be linked from the Finances module.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

    

    