
// src/components/settings/billing-settings.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { CreditCard, DollarSign as FinancialIcon, FileText as BillingHistoryIcon, Activity, UserCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import type { LanguagePack } from '@/lib/i18n-config';

const mockBillingDataStore = {
  currentPlan: {
    name: 'Pro Plan',
    price: 99,
    currency: 'USD',
    features: ['Up to 50 Users', 'Unlimited Projects', 'Advanced Analytics', 'Priority Support'],
    nextBillingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
  },
  paymentMethod: {
    type: 'Visa',
    last4: '1234',
    expiry: '12/2025',
  },
  billingHistory: [
    { id: 'INV-SUB-003', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), amount: 99, status: 'Paid' },
    { id: 'INV-SUB-002', date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), amount: 99, status: 'Paid' },
    { id: 'INV-SUB-001', date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(), amount: 99, status: 'Paid' },
  ],
  usage: {
    users: { current: 27, limit: 50 },
    projects: { current: 187, limit: Infinity },
    storage: { current: 68, limit: 100, unit: 'GB' },
  },
  billingAddress: {
    company: 'Mercer Consulting Inc.',
    line1: '123 Innovation Drive',
    city: 'Techville',
    state: 'CA',
    zip: '90210',
    country: 'USA',
    taxId: 'US-TAX-123456789',
  }
};

interface BillingSettingsProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
}

export default function BillingSettingsSection({ t, formatDate }: BillingSettingsProps) {
  const { toast } = useToast();
  const [showUpdatePaymentDialog, setShowUpdatePaymentDialog] = useState(false);
  const [showEditBillingAddressDialog, setShowEditBillingAddressDialog] = useState(false);
  // Use local state for mock data if it needs to be mutable within the component, otherwise import directly
  const [billingData, setBillingData] = useState(mockBillingDataStore);


  const handlePlaceholderAction = (actionMessageKey: string, descriptionKey?: string) => {
    toast({
      title: t(actionMessageKey as keyof LanguagePack['translations']),
      description: descriptionKey ? t(descriptionKey as keyof LanguagePack['translations']) : t("This functionality is for demonstration."),
      duration: 3000,
    });
  };

  const handleUpdatePaymentMethod = () => {
    setShowUpdatePaymentDialog(false);
    // Here you would typically make an API call and update billingData state
    toast({
      title: t("Payment Method Updated"),
      description: t("Your payment method has been successfully updated (simulated)."),
      duration: 3000,
    });
  };

  const handleEditBillingAddress = () => {
    setShowEditBillingAddressDialog(false);
    // Here you would typically make an API call and update billingData state
    toast({
      title: t("Billing Address Updated"),
      description: t("Your billing address has been successfully updated (simulated)."),
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Current Subscription')}</CardTitle>
          </div>
          <CardDescription>{t('Manage your subscription to Consult Vista.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{billingData.currentPlan.name}</h3>
            <p className="text-muted-foreground">
              {t('${price}/month', { price: billingData.currentPlan.price })} - {t('Next billing date')}: {formatDate(parseISO(billingData.currentPlan.nextBillingDate))}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">{t('Plan Features')}:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {billingData.currentPlan.features.map(feature => <li key={feature}>{t(feature as keyof LanguagePack['translations'])}</li>)}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={() => handlePlaceholderAction("Upgrade Plan Clicked")}>{t('Upgrade Plan')}</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" >{t('Cancel Subscription')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Are you sure you want to cancel?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('Your subscription will remain active until {nextBillingDate}. After this date, you will lose access to Pro features.', { nextBillingDate: formatDate(parseISO(billingData.currentPlan.nextBillingDate))})}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Keep Subscription')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handlePlaceholderAction("Subscription Cancellation Confirmed")}>{t('Proceed with Cancellation')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FinancialIcon className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Payment Method')}</CardTitle>
          </div>
          <CardDescription>{t('Update your primary payment method.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            {t('Current method')}: {billingData.paymentMethod.type} {t('ending in')} {billingData.paymentMethod.last4} - {t('Expires')} {billingData.paymentMethod.expiry}
          </p>
          <Dialog open={showUpdatePaymentDialog} onOpenChange={setShowUpdatePaymentDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">{t('Update Payment Method')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Update Payment Method')}</DialogTitle>
                <DialogDescription>{t('Enter your new card details. This is a simulated form.')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label htmlFor="cardNumber">{t('Card Number')}</Label><Input id="cardNumber" placeholder="**** **** **** ****" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="expiryDate">{t('Expiry Date (MM/YY)')}</Label><Input id="expiryDate" placeholder="MM/YY" /></div>
                  <div><Label htmlFor="cvc">{t('CVC')}</Label><Input id="cvc" placeholder="123" /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUpdatePaymentDialog(false)}>{t('Cancel')}</Button>
                <Button onClick={handleUpdatePaymentMethod}>{t('Save Payment Method')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BillingHistoryIcon className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">{t('Billing History')}</CardTitle>
          </div>
          <CardDescription>{t('View your past invoices for Consult Vista subscription.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-72 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>{t('Invoice ID')}</TableHead><TableHead>{t('Date')}</TableHead><TableHead className="text-right">{t('Amount')}</TableHead><TableHead className="text-center">{t('Status')}</TableHead><TableHead className="text-right">{t('Actions')}</TableHead></TableRow></TableHeader>
              <TableBody>
                {billingData.billingHistory.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.id}</TableCell>
                    <TableCell>{formatDate(parseISO(invoice.date))}</TableCell>
                    <TableCell className="text-right">{billingData.currentPlan.currency} {invoice.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'} className={cn(invoice.status === 'Paid' ? 'bg-green-500/20 text-green-700' : '')}>
                        {t(invoice.status as keyof LanguagePack['translations'])}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handlePlaceholderAction("Download Invoice PDF Triggered")}>
                        <Download className="h-4 w-4" /> <span className="sr-only">{t('Download PDF')}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

        <Card>
        <CardHeader>
            <div className="flex items-center gap-3"><Activity className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Usage & Limits')}</CardTitle></div>
            <CardDescription>{t('Monitor your current usage against your plan allowances.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div>
                <div className="flex justify-between mb-1"><span>{t('Users')}</span><span>{billingData.usage.users.current} / {billingData.usage.users.limit}</span></div>
                <Progress value={(billingData.usage.users.current / billingData.usage.users.limit) * 100} className="h-2" />
            </div>
            <div>
                <div className="flex justify-between mb-1"><span>{t('Projects')}</span><span>{billingData.usage.projects.current} / {billingData.usage.projects.limit === Infinity ? t('Unlimited') : billingData.usage.projects.limit}</span></div>
                <Progress value={billingData.usage.projects.limit === Infinity ? 100 : (billingData.usage.projects.current / billingData.usage.projects.limit) * 100} className="h-2" indicatorClassName={billingData.usage.projects.limit === Infinity ? 'bg-green-500' : undefined}/>
            </div>
            <div>
                <div className="flex justify-between mb-1"><span>{t('Data Storage')}</span><span>{billingData.usage.storage.current}{billingData.usage.storage.unit} / {billingData.usage.storage.limit}{billingData.usage.storage.unit}</span></div>
                <Progress value={(billingData.usage.storage.current / billingData.usage.storage.limit) * 100} className="h-2" />
            </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => handlePlaceholderAction("View Usage Details Clicked")}>{t('View Usage Details')}</Button>
        </CardContent>
        </Card>

        <Card>
        <CardHeader>
            <div className="flex items-center gap-3"><UserCircle className="h-7 w-7 text-primary" /><CardTitle className="text-xl">{t('Billing Address & Tax Info')}</CardTitle></div>
            <CardDescription>{t('Manage the billing details for your organization.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
            <p className="font-medium">{billingData.billingAddress.company}</p>
            <p>{billingData.billingAddress.line1}</p>
            <p>{billingData.billingAddress.city}, {billingData.billingAddress.state} {billingData.billingAddress.zip}</p>
            <p>{billingData.billingAddress.country}</p>
            <p className="mt-2"><strong>{t('Tax ID')}:</strong> {billingData.billingAddress.taxId || t('Not Provided')}</p>
            <Dialog open={showEditBillingAddressDialog} onOpenChange={setShowEditBillingAddressDialog}>
                <DialogTrigger asChild>
                      <Button variant="outline" className="mt-2">{t('Edit Billing Information')}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('Edit Billing Information')}</DialogTitle><DialogDescription>{t('Update your company\'s billing address and tax details.')}</DialogDescription></DialogHeader>
                    <div className="space-y-3 py-4">
                        <div><Label htmlFor="companyNameBill">{t('Company Name')}</Label><Input id="companyNameBill" defaultValue={billingData.billingAddress.company} /></div>
                        <div><Label htmlFor="addressLine1Bill">{t('Address Line 1')}</Label><Input id="addressLine1Bill" defaultValue={billingData.billingAddress.line1} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label htmlFor="cityBill">{t('City')}</Label><Input id="cityBill" defaultValue={billingData.billingAddress.city} /></div>
                            <div><Label htmlFor="stateBill">{t('State/Province')}</Label><Input id="stateBill" defaultValue={billingData.billingAddress.state} /></div>
                        </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label htmlFor="zipBill">{t('ZIP/Postal Code')}</Label><Input id="zipBill" defaultValue={billingData.billingAddress.zip} /></div>
                            <div><Label htmlFor="countryBill">{t('Country')}</Label><Input id="countryBill" defaultValue={billingData.billingAddress.country} /></div>
                        </div>
                        <div><Label htmlFor="taxIdBill">{t('Tax ID (Optional)')}</Label><Input id="taxIdBill" defaultValue={billingData.billingAddress.taxId} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditBillingAddressDialog(false)}>{t('Cancel')}</Button>
                        <Button onClick={handleEditBillingAddress}>{t('Save Billing Information')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardContent>
        </Card>
    </div>
  );
}

    