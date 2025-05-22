'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { AnalyzeEngagementRiskInput } from '@/ai/flows/analyze-engagement-risk';

const formSchema = z.object({
  technicalComplexity: z.string().min(10, 'Please provide a more detailed description (min 10 characters).').max(2000),
  resourceNeeds: z.string().min(10, 'Please describe resource needs in more detail (min 10 characters).').max(2000),
  clientHistory: z.string().min(10, 'Please elaborate on client history (min 10 characters).').max(2000),
  clientCountryPoliticalExposure: z.string().min(10, 'Describe political exposure more thoroughly (min 10 characters).').max(2000),
});

interface RiskAnalyzerFormProps {
  onSubmit: (data: AnalyzeEngagementRiskInput) => void;
  isLoading: boolean;
}

export default function RiskAnalyzerForm({ onSubmit, isLoading }: RiskAnalyzerFormProps) {
  const form = useForm<AnalyzeEngagementRiskInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technicalComplexity: '',
      resourceNeeds: '',
      clientHistory: '',
      clientCountryPoliticalExposure: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="technicalComplexity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Complexity</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the technical challenges, novelty of technology, integration requirements, etc."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resourceNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Needs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detail required skillsets, team size, specialized equipment, budget constraints, etc."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Summarize past interactions, payment timeliness, communication style, previous project outcomes, etc."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientCountryPoliticalExposure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Country Political Exposure</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe political stability, regulatory environment, sanctions, corruption levels in the client's country of origin."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Risk'
          )}
        </Button>
      </form>
    </Form>
  );
}
