
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
import {
  Workflow as WorkflowIcon,
  Settings as SettingsIcon,
  PlusCircle,
  Edit3,
  Trash2,
  PlayCircle,
  PauseCircle,
  History,
  GitMerge,
  AlertTriangle,
  ListChecks,
  ExternalLink,
  Zap,
  LayoutGrid,
  Repeat,
  DatabaseZap,
  Spline,
  FileText as ReportIcon,
  ChevronDown,
  ChevronUp,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguagePack } from '@/lib/i18n-config';
import { format } from 'date-fns';
import { systemRoles } from '@/lib/types'; // For approver roles

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  approverRole?: string;
  condition?: string;
  notify?: boolean;
  // For future ordering, not implemented in this pass
  order?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  lastModified: string; // ISO Date string
  version: string;
  category: 'Finance' | 'Project Management' | 'Client Management' | 'HR' | 'General';
  trigger?: string; // e.g., "On Expense Submission", "On Project Creation"
  steps: WorkflowStep[];
}

const initialMockWorkflowsData: Workflow[] = [
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
      { id: 's1-1', name: 'Expense Submitted', description: 'Employee submits expense report.', order: 1 },
      { id: 's1-2', name: 'Manager Approval', description: 'Direct manager reviews and approves.', approverRole: 'Project Manager', order: 2 },
      { id: 's1-3', name: 'Finance Approval (Conditional)', description: 'Finance team approves if amount > $1000.', approverRole: 'Finance Manager', condition: 'amount > 1000', notify: true, order: 3 },
      { id: 's1-4', name: 'Payment Processed', description: 'Finance processes reimbursement.', order: 4 },
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
      { id: 's2-1', name: 'Contract Signed', description: 'Sales confirms contract signature.', order: 1 },
      { id: 's2-2', name: 'Client Setup in System', description: 'Admin creates client profile.', order: 2 },
      { id: 's2-3', name: 'Project Manager Assignment', description: 'Management assigns PM.', approverRole: 'Administrator', order: 3 },
      { id: 's2-4', name: 'Initial Resource Allocation', description: 'PM allocates initial team members.', order: 4},
      { id: 's2-5', name: 'Project Kickoff Meeting Scheduled', description: 'PM schedules kickoff.', notify: true, order: 5}
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
        { id: 's3-1', name: 'Welcome Email Sent', description: 'Automated welcome email.', order: 1 },
        { id: 's3-2', name: 'Initial Consultation Scheduled', description: 'Account manager schedules first call.', order: 2 },
        { id: 's3-3', name: 'Access to Client Portal Granted', description: 'IT grants portal access.', order: 3 },
    ]
  },
];


interface WorkflowSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export default function WorkflowSettingsSection({ t }: WorkflowSettingsProps) {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>(initialMockWorkflowsData);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [newWorkflowData, setNewWorkflowData] = useState<{ name: string; description: string; category: Workflow['category'] | ''}>({ name: '', description: '', category: '' });
  
  // State specifically for the Edit Workflow Dialog's steps
  const [editableWorkflowSteps, setEditableWorkflowSteps] = useState<WorkflowStep[]>([]);


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
      steps: [{id: `step-${Date.now()}`, name: t('New Step 1 - Configure me'), description: t('Default starting step.'), order: 1}],
      trigger: t('Manual / To Be Configured')
    };
    setWorkflows(prev => [newWorkflow, ...prev]);
    toast({ title: t("Workflow Created (Session)"), description: t("Workflow '{workflowName}' has been created for this session. Edit to define steps.", { workflowName: newWorkflow.name }) });
    setShowCreateDialog(false);
    setNewWorkflowData({ name: '', description: '', category: '' });
  };

  const handleOpenEditDialog = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    // Deep copy steps for editing to avoid direct mutation
    setEditableWorkflowSteps(JSON.parse(JSON.stringify(workflow.steps || [])));
    setShowEditDialog(true);
  };

  const handleSaveWorkflowChanges = () => {
    if (!editingWorkflow) return;
    
    setWorkflows(prevWorkflows => 
        prevWorkflows.map(wf => 
            wf.id === editingWorkflow.id 
            ? { ...wf, steps: editableWorkflowSteps, lastModified: new Date().toISOString(), version: `${parseFloat(wf.version) + 0.1}` } // Basic version increment
            : wf
        )
    );

    toast({ title: t("Workflow Changes Saved (Session)"), description: t("Changes to workflow '{workflowName}' have been saved for this session.", { workflowName: editingWorkflow.name }) });
    setShowEditDialog(false);
    setEditingWorkflow(null);
    setEditableWorkflowSteps([]);
  };

  const handleToggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev =>
      prev.map(wf =>
        wf.id === workflowId
          ? { ...wf, status: wf.status === 'Active' ? 'Inactive' : 'Active', lastModified: new Date().toISOString() }
          : wf
      )
    );
    toast({ title: t("Workflow Status Updated (Session)"), description: t("Workflow status toggled for this session.") });
  };
  
  const getStatusBadgeClass = (status: Workflow['status']) => {
    if (status === 'Active') return 'bg-green-500/20 text-green-700 border-green-500';
    return 'bg-gray-500/20 text-gray-700 border-gray-500';
  };

  // Handlers for steps within the Edit Workflow Dialog
  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: t('New Step Name'),
      description: '',
      approverRole: undefined,
      condition: '',
      notify: false,
      order: editableWorkflowSteps.length + 1,
    };
    setEditableWorkflowSteps(prev => [...prev, newStep]);
  };

  const handleStepChange = (stepId: string, field: keyof WorkflowStep, value: any) => {
    setEditableWorkflowSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    );
  };

  const handleDeleteStep = (stepId: string) => {
    setEditableWorkflowSteps(prevSteps => prevSteps.filter(step => step.id !== stepId));
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
                            <SelectItem value="General">{t('General')}</SelectItem>
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
        <Dialog open={showEditDialog} onOpenChange={(isOpen) => { if (!isOpen) {setEditingWorkflow(null); setEditableWorkflowSteps([]);} setShowEditDialog(isOpen);}}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{t('Edit Workflow')}: {t(editingWorkflow.name as keyof LanguagePack['translations'])} (v{editingWorkflow.version})</DialogTitle>
              <DialogDescription>{t("Modify workflow steps, conditions, and approvers.")}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6 flex-grow overflow-y-auto pr-2">
              <div className="p-4 border rounded-lg bg-muted/10">
                  <h4 className="font-semibold text-lg mb-2">{t('Workflow Details')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="editWfNameDialog">{t('Workflow Name')}</Label><Input id="editWfNameDialog" defaultValue={editingWorkflow.name} onChange={(e) => setEditingWorkflow(prev => prev ? {...prev, name: e.target.value} : null)} /></div>
                      <div><Label htmlFor="editWfCatDialog">{t('Category')}</Label>
                        <Select defaultValue={editingWorkflow.category} onValueChange={val => setEditingWorkflow(prev => prev ? {...prev, category: val as Workflow['category']} : null)}>
                            <SelectTrigger id="editWfCatDialog"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Finance">{t('Finance')}</SelectItem>
                                <SelectItem value="Project Management">{t('Project Management')}</SelectItem>
                                <SelectItem value="Client Management">{t('Client Management')}</SelectItem>
                                <SelectItem value="HR">{t('HR')}</SelectItem>
                                 <SelectItem value="General">{t('General')}</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2"><Label htmlFor="editWfDescDialog">{t('Description')}</Label><Textarea id="editWfDescDialog" defaultValue={editingWorkflow.description} rows={2} onChange={(e) => setEditingWorkflow(prev => prev ? {...prev, description: e.target.value} : null)} /></div>
                      <div><Label htmlFor="editWfTriggerDialog">{t('Trigger Event')}</Label><Input id="editWfTriggerDialog" defaultValue={editingWorkflow.trigger} placeholder={t('e.g., On Expense Submission')} onChange={(e) => setEditingWorkflow(prev => prev ? {...prev, trigger: e.target.value} : null)}/></div>
                  </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg">{t('Workflow Steps')}</h4>
                    <Button size="sm" onClick={handleAddStep}><PlusCircle className="mr-2 h-4 w-4" />{t('Add Step')}</Button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {editableWorkflowSteps.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t('No steps defined. Click "Add Step" to begin.')}</p>}
                  {editableWorkflowSteps.map((step, index) => (
                    <Card key={step.id} className="p-4 bg-card/90 relative group/step">
                      <div className="flex items-center justify-between mb-2">
                        <Input 
                            value={step.name} 
                            onChange={(e) => handleStepChange(step.id, 'name', e.target.value)}
                            className="text-md font-semibold flex-grow border-0 shadow-none focus-visible:ring-0 focus-visible:bg-muted/50 p-1"
                            placeholder={t("Step Name")}
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteStep(step.id)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                      <Textarea 
                        value={step.description || ''} 
                        onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                        placeholder={t("Step description...")} 
                        className="text-xs text-muted-foreground mb-3"
                        rows={2}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <Label htmlFor={`step-${step.id}-approver`}>{t('Approver Role')}</Label>
                          <Select 
                            value={step.approverRole || ''} 
                            onValueChange={(val) => handleStepChange(step.id, 'approverRole', val === "--none--" ? undefined : val)}
                          >
                            <SelectTrigger id={`step-${step.id}-approver`} className="h-8 text-xs"><SelectValue placeholder={t("Select role")} /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="--none--">{t('-- None --')}</SelectItem>
                              {systemRoles.map(role => <SelectItem key={role} value={role}>{t(role as keyof LanguagePack['translations'])}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`step-${step.id}-condition`}>{t('Condition (Text)')}</Label>
                          <Input 
                            id={`step-${step.id}-condition`} 
                            value={step.condition || ''} 
                            onChange={(e) => handleStepChange(step.id, 'condition', e.target.value)}
                            placeholder={t('e.g., amount > 500')} 
                            className="h-8 text-xs" 
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
                          <Checkbox 
                            id={`step-${step.id}-notify`} 
                            checked={step.notify || false} 
                            onCheckedChange={(checked) => handleStepChange(step.id, 'notify', checked)}
                          />
                          <Label htmlFor={`step-${step.id}-notify`} className="text-xs font-normal">{t('Notify relevant parties on completion')}</Label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => {setShowEditDialog(false); setEditingWorkflow(null); setEditableWorkflowSteps([]);}}>{t('Cancel')}</Button>
              <Button onClick={handleSaveWorkflowChanges}>{t('Save Workflow Changes (Session)')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Card className="mt-6 bg-secondary/30 border-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" /> {t('Advanced Workflow Capabilities (Roadmap)')}
          </CardTitle>
          <CardDescription>
            {t('Future enhancements to provide powerful automation and customization for your consultancy\'s operations.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <LayoutGrid className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Visual Workflow Builder')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('A drag-and-drop interface to design and modify complex workflows, visually connecting steps, conditions, and actions.')}
            </p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">{t('Preview Visual Builder (Concept)')}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader><DialogTitle>{t('Visual Workflow Builder (Conceptual Preview)')}</DialogTitle><DialogDescription>{t('This is a visual representation of a future drag-and-drop workflow builder. Functionality is not implemented.')}</DialogDescription></DialogHeader>
                    <div className="p-4 min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-md bg-muted/50">
                        <p className="text-muted-foreground text-center">{t('Imagine a canvas here where you can drag step nodes, connect them with arrows, and define logic visually.')}<br/> <GitMerge className="h-12 w-12 mx-auto mt-4 text-primary/50"/> </p>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={(e) => (e.target as HTMLElement).closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]')?.click()}>{t('Close Preview')}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
          </div>

          <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <ListChecks className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Configurable Approval Steps')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Define multi-level approvals, parallel reviews, and dynamic approver assignments based on data (e.g., project manager, department head).')}
            </p>
             <p className="text-xs text-muted-foreground mt-1">{t("Example: 'IF Expense > $1000 AND ProjectType == 'Strategic' THEN Require Director Approval'")}</p>
          </div>

          <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Automated Triggers & Actions')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Initiate workflows based on system events (e.g., new client created, project status changed) and automate actions (e.g., send notifications, update records).')}
            </p>
            <div className="mt-2 space-y-2 text-xs">
                <div className="flex gap-2 items-center">
                    <Label htmlFor="trigger-select-ph" className="shrink-0">{t('IF Event:')}</Label>
                    <Select disabled><SelectTrigger id="trigger-select-ph" className="h-8 text-xs"><SelectValue placeholder={t('e.g., Project Status Updated')} /></SelectTrigger></Select>
                </div>
                 <div className="flex gap-2 items-center">
                    <Label htmlFor="action-select-ph" className="shrink-0">{t('THEN Action:')}</Label>
                    <Select disabled><SelectTrigger id="action-select-ph" className="h-8 text-xs"><SelectValue placeholder={t('e.g., Notify Project Manager')} /></SelectTrigger></Select>
                </div>
            </div>
             <Button variant="outline" size="sm" className="mt-2" disabled>{t('Configure Triggers & Actions (Coming Soon)')}</Button>
          </div>
          
          <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Repeat className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Workflow Versioning & History')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Track changes to workflows, revert to previous versions, and audit execution history for compliance and troubleshooting.')}
            </p>
             <Button variant="outline" size="sm" className="mt-2" disabled>{t('View Version History (Coming Soon)')}</Button>
          </div>

          <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Spline className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Conditional Logic & Branching')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Implement if/then/else logic within workflows based on data attributes to handle diverse scenarios and decision points.')}
            </p>
          </div>
          
          <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <DatabaseZap className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Integration with External Systems')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Trigger actions in third-party applications as part of a workflow, creating seamless end-to-end process automation.')}
            </p>
            <Button variant="link" size="sm" className="mt-1 px-0 h-auto" onClick={() => toast({title: t("Navigate to Integrations")})} disabled>{t('Connect External Systems (via Integrations Module)')}</Button>
          </div>
           <div className="p-3 border rounded-md bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <ReportIcon className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-md">{t('Workflow Audit Logs')}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Detailed logs of every workflow execution, including steps taken, decisions made, and any errors encountered. Essential for troubleshooting and compliance.')}
            </p>
             <Button variant="outline" size="sm" className="mt-2" disabled>{t('View Workflow Execution Logs (Coming Soon)')}</Button>
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">{t('This module aims to provide powerful automation capabilities to streamline your consultancy\'s operations.')}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

    
