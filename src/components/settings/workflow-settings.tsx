
// src/components/settings/workflow-settings.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Workflow as WorkflowIcon, Settings as SettingsIcon, PlusCircle, Edit3, Trash2, PlayCircle, PauseCircle, History, GitMerge, AlertTriangle, ListChecks, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguagePack } from '@/lib/i18n-config';
import { format } from 'date-fns';

interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  approverRole?: string; // Link to RBAC roles
  condition?: string; // e.g., "amount > 500"
  notify?: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  lastModified: string; // ISO Date string
  version: string;
  category: 'Finance' | 'Project Management' | 'Client Management' | 'HR';
  trigger?: string; // e.g., "On Expense Submission", "On Project Creation"
  steps: WorkflowStep[];
}

const mockWorkflowsData: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Expense Approval Workflow',
    description: 'Standard process for submitting and approving employee expenses. Requires manager and finance approval for amounts over $1000.',
    status: 'Active',
    lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    version: '1.2',
    category: 'Finance',
    trigger: 'On Expense Submission',
    steps: [
      { id: 's1', name: 'Expense Submitted', description: 'Employee submits expense report.' },
      { id: 's2', name: 'Manager Approval', description: 'Direct manager reviews and approves.', approverRole: 'Project Manager' },
      { id: 's3', name: 'Finance Approval (Conditional)', description: 'Finance team approves if amount > $1000.', approverRole: 'Finance Manager', condition: 'amount > 1000', notify: true },
      { id: 's4', name: 'Payment Processed', description: 'Finance processes reimbursement.' },
    ],
  },
  {
    id: 'wf-002',
    name: 'Project Initiation Workflow',
    description: 'Automated steps for creating new projects, including client verification and resource allocation.',
    status: 'Active',
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    version: '2.0',
    category: 'Project Management',
    trigger: 'On New Client Contract Signed',
    steps: [
      { id: 's1', name: 'Contract Signed', description: 'Sales confirms contract signature.' },
      { id: 's2', name: 'Client Setup in System', description: 'Admin creates client profile.' },
      { id: 's3', name: 'Project Manager Assignment', description: 'Management assigns PM.', approverRole: 'Administrator' },
      { id: 's4', name: 'Initial Resource Allocation', description: 'PM allocates initial team members.'},
      { id: 's5', name: 'Project Kickoff Meeting Scheduled', description: 'PM schedules kickoff.', notify: true}
    ],
  },
  {
    id: 'wf-003',
    name: 'Client Onboarding Process',
    description: 'Standardized steps for onboarding new clients after a project is won.',
    status: 'Inactive',
    lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    version: '1.0',
    category: 'Client Management',
    trigger: 'On Project "Won" Status',
    steps: [
        { id: 's1', name: 'Welcome Email Sent', description: 'Automated welcome email.' },
        { id: 's2', name: 'Initial Consultation Scheduled', description: 'Account manager schedules first call.' },
        { id: 's3', name: 'Access to Client Portal Granted', description: 'IT grants portal access.' },
    ]
  },
];


interface WorkflowSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function WorkflowSettingsSection({ t }: WorkflowSettingsProps) {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflowsData);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [newWorkflowData, setNewWorkflowData] = useState<{ name: string; description: string; category: Workflow['category'] | ''}>({ name: '', description: '', category: '' });
  const [editedWorkflowData, setEditedWorkflowData] = useState<Partial<Workflow>>({});

  const handleCreateWorkflow = () => {
    if (!newWorkflowData.name.trim() || !newWorkflowData.description.trim() || !newWorkflowData.category) {
        toast({ title: t("Validation Error"), description: t("Name, description, and category are required."), variant: "destructive" });
        return;
    }
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: newWorkflowData.name,
      description: newWorkflowData.description,
      category: newWorkflowData.category as Workflow['category'],
      status: 'Inactive',
      lastModified: new Date().toISOString(),
      version: '1.0',
      steps: [{id: 'step-default', name: 'New Step 1 - Configure me', description: 'Default starting step.'}],
      trigger: 'Manual / To Be Configured'
    };
    setWorkflows(prev => [newWorkflow, ...prev]);
    toast({ title: t("Workflow Created"), description: t("Workflow '{workflowName}' has been created (simulated). Edit to define steps.", { workflowName: newWorkflow.name }) });
    setShowCreateDialog(false);
    setNewWorkflowData({ name: '', description: '', category: '' });
  };

  const handleOpenEditDialog = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setEditedWorkflowData({ ...workflow }); // Initialize with current workflow data
    setShowEditDialog(true);
  };

  const handleSaveWorkflowChanges = () => {
    if (!editingWorkflow) return;
    // In a real app, you'd send editedWorkflowData (or a diff) to a backend
    // For simulation, we could update the local 'workflows' state if desired,
    // but for simplicity of this simulation, we'll just show a toast
    toast({ title: t("Workflow Changes Saved"), description: t("Changes to workflow '{workflowName}' have been saved (simulated).", { workflowName: editingWorkflow.name }) });
    setShowEditDialog(false);
    setEditingWorkflow(null);
  };

  const handleToggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev =>
      prev.map(wf =>
        wf.id === workflowId
          ? { ...wf, status: wf.status === 'Active' ? 'Inactive' : 'Active', lastModified: new Date().toISOString() }
          : wf
      )
    );
    toast({ title: t("Workflow Status Updated"), description: t("Workflow status toggled (simulated).") });
  };
  
  const getStatusBadgeClass = (status: Workflow['status']) => {
    if (status === 'Active') return 'bg-green-500/20 text-green-700 border-green-500';
    return 'bg-gray-500/20 text-gray-700 border-gray-500';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <WorkflowIcon className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{t('Workflow Customization')}</CardTitle>
          </div>
          <CardDescription className="pt-1 text-base">
            {t('Customize business workflows, approval processes, and automation rules to fit your organization\'s specific needs. This section allows management of predefined and custom workflows.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" />{t('Create New Workflow')}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t('Create New Workflow')}</DialogTitle>
                  <DialogDescription>{t('Define a new business process or automation rule.')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div><Label htmlFor="wfName">{t('Workflow Name')}</Label><Input id="wfName" value={newWorkflowData.name} onChange={e => setNewWorkflowData({...newWorkflowData, name: e.target.value})} placeholder={t('e.g., Client Project Proposal Approval')}/></div>
                  <div><Label htmlFor="wfDesc">{t('Description')}</Label><Textarea id="wfDesc" value={newWorkflowData.description} onChange={e => setNewWorkflowData({...newWorkflowData, description: e.target.value})} placeholder={t('Briefly describe its purpose.')}/></div>
                  <div>
                    <Label htmlFor="wfCategory">{t('Category')}</Label>
                    <Select value={newWorkflowData.category} onValueChange={val => setNewWorkflowData({...newWorkflowData, category: val as Workflow['category']})}>
                        <SelectTrigger id="wfCategory"><SelectValue placeholder={t("Select category")} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Finance">{t('Finance')}</SelectItem>
                            <SelectItem value="Project Management">{t('Project Management')}</SelectItem>
                            <SelectItem value="Client Management">{t('Client Management')}</SelectItem>
                            <SelectItem value="HR">{t('HR')}</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>{t('Cancel')}</Button>
                  <Button onClick={handleCreateWorkflow}>{t('Create Workflow')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Workflow Name')}</TableHead>
                  <TableHead>{t('Category')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                  <TableHead>{t('Last Modified')}</TableHead>
                  <TableHead>{t('Version')}</TableHead>
                  <TableHead>{t('Trigger Event')}</TableHead>
                  <TableHead className="text-right">{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{t(wf.name as keyof LanguagePack['translations'])}</TableCell>
                    <TableCell>{t(wf.category)}</TableCell>
                    <TableCell><Badge className={cn("text-xs", getStatusBadgeClass(wf.status))}>{t(wf.status)}</Badge></TableCell>
                    <TableCell className="text-xs">{format(new Date(wf.lastModified), 'PPp')}</TableCell>
                    <TableCell className="text-xs">{wf.version}</TableCell>
                    <TableCell className="text-xs">{wf.trigger ? t(wf.trigger as keyof LanguagePack['translations']) : t('N/A')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><SettingsIcon className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(wf)}><Edit3 className="mr-2 h-4 w-4" />{t('Edit Workflow')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleWorkflowStatus(wf.id)}>
                            {wf.status === 'Active' ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                            {wf.status === 'Active' ? t('Deactivate') : t('Activate')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({title: t("View History Clicked (Placeholder)")})}><History className="mr-2 h-4 w-4" />{t('View History')}</DropdownMenuItem>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast({title: t("Feature Not Implemented"), description: t("Deleting workflows is a critical action and will be available in a future update with proper safeguards."), variant: "default"})} className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" />{t('Delete Workflow')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {workflows.length === 0 && <TableRow><TableCell colSpan={7} className="text-center h-24">{t('No workflows configured yet.')}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingWorkflow && (
        <Dialog open={showEditDialog} onOpenChange={(isOpen) => { if (!isOpen) setEditingWorkflow(null); setShowEditDialog(isOpen);}}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{t('Edit Workflow')}: {t(editingWorkflow.name as keyof LanguagePack['translations'])} (v{editingWorkflow.version})</DialogTitle>
              <DialogDescription>{t("Modify steps, conditions, and approvers. (Simulated Editor)")}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6 flex-grow overflow-y-auto">
              <div className="p-4 border rounded-lg bg-muted/20">
                  <h4 className="font-semibold text-lg mb-2">{t('Workflow Details')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="editWfName">{t('Workflow Name')}</Label><Input id="editWfName" defaultValue={editingWorkflow.name} disabled /></div>
                      <div><Label htmlFor="editWfCat">{t('Category')}</Label><Input id="editWfCat" defaultValue={editingWorkflow.category} disabled /></div>
                      <div className="md:col-span-2"><Label htmlFor="editWfDesc">{t('Description')}</Label><Textarea id="editWfDesc" defaultValue={editingWorkflow.description} rows={2} disabled /></div>
                      <div><Label htmlFor="editWfTrigger">{t('Trigger Event')}</Label><Input id="editWfTrigger" defaultValue={editingWorkflow.trigger} placeholder={t('e.g., On Expense Submission')} disabled /></div>
                  </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-3">{t('Workflow Steps & Configuration')}</h4>
                 <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2"><GitMerge className="h-5 w-5 text-primary"/>{t("This is a simplified view. A visual drag-and-drop builder with advanced logic is planned.")}</p>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {editingWorkflow.steps.map((step, index) => (
                    <Card key={step.id} className="p-3 bg-card/80">
                      <p className="font-medium text-sm mb-1">Step {index + 1}: {step.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <Label htmlFor={`step-${step.id}-approver`}>{t('Approver Role (Simulated)')}</Label>
                          <Select defaultValue={step.approverRole || "any"} disabled>
                            <SelectTrigger id={`step-${step.id}-approver`} className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">{t('Any User')}</SelectItem>
                              <SelectItem value="Project Manager">{t('Project Manager')}</SelectItem>
                              <SelectItem value="Finance Manager">{t('Finance Manager')}</SelectItem>
                              <SelectItem value="Administrator">{t('Administrator')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`step-${step.id}-condition`}>{t('Condition (Simulated)')}</Label>
                          <Input id={`step-${step.id}-condition`} defaultValue={step.condition || ''} placeholder={t('e.g., amount > 500')} className="h-8 text-xs" disabled />
                        </div>
                        <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
                          <Checkbox id={`step-${step.id}-notify`} checked={step.notify} disabled />
                          <Label htmlFor={`step-${step.id}-notify`} className="text-xs font-normal">{t('Notify relevant parties on completion')}</Label>
                        </div>
                      </div>
                       <div className="text-right mt-2">
                            <Button variant="ghost" size="sm" className="text-xs h-7" disabled><Edit3 className="h-3 w-3 mr-1"/>{t('Edit Step')}</Button>
                            <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive hover:text-destructive" disabled><Trash2 className="h-3 w-3 mr-1"/>{t('Remove')}</Button>
                       </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" disabled><ListChecks className="mr-2 h-4 w-4"/>{t('Add New Step')}</Button>
                    <Button variant="outline" size="sm" disabled><ExternalLink className="mr-2 h-4 w-4"/>{t('Configure Triggers')}</Button>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => {setShowEditDialog(false); setEditingWorkflow(null);}}>{t('Cancel')}</Button>
              <Button onClick={() => handleSaveWorkflowChanges()}>{t('Save Workflow Changes (Simulated)')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground border-t pt-6 mt-6">
         <div className="flex items-center gap-2"><SettingsIcon className="h-5 w-5 text-primary"/> <h4 className="font-semibold text-foreground">{t('Advanced Workflow Capabilities (Roadmap)')}</h4></div>
        <ul className="list-disc list-inside space-y-1 pl-2">
            <li>{t('Visual Workflow Builder: A drag-and-drop interface to design and modify complex workflows.')}</li>
            <li>{t('Configurable Approval Steps: Define multi-level approvals, parallel reviews, and dynamic approver assignments based on data (e.g., project manager, department head).')}</li>
            <li>{t('Automated Triggers & Actions: Initiate workflows based on system events (e.g., new client created, project status changed) and automate actions (e.g., send notifications, update records).')}</li>
            <li>{t('Workflow Versioning & History: Track changes to workflows, revert to previous versions, and audit execution history.')}</li>
            <li>{t('Conditional Logic & Branching: Implement if/then/else logic within workflows based on data attributes.')}</li>
            <li>{t('Integration with External Systems: Trigger actions in third-party applications as part of a workflow.')}</li>
        </ul>
        <p className="mt-2">{t('This module aims to provide powerful automation capabilities to streamline your consultancy\'s operations.')}</p>
      </CardFooter>
    </div>
  );
}

    
