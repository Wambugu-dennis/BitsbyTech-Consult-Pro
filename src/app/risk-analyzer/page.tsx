
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RiskAnalyzerForm from '@/components/risk-analyzer/risk-analyzer-form';
import type { AnalyzeEngagementRiskInput, AnalyzeEngagementRiskOutput } from '@/ai/flows/analyze-engagement-risk';
import { handleAnalyzeRisk } from './actions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RISK_LEVEL_COLORS } from '@/lib/constants';

export default function RiskAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeEngagementRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: AnalyzeEngagementRiskInput) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await handleAnalyzeRisk(data);
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (score: number): { label: string; colorClass: string } => {
    if (score <= 33) return { label: 'Low Risk', colorClass: RISK_LEVEL_COLORS['Low'] };
    if (score <= 66) return { label: 'Medium Risk', colorClass: RISK_LEVEL_COLORS['Medium'] };
    return { label: 'High Risk', colorClass: RISK_LEVEL_COLORS['High'] };
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI Risk Analyzer</h1>
        <p className="text-muted-foreground">
          Assess potential engagements using AI-driven risk analysis.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Engagement Details</CardTitle>
            <CardDescription>
              Provide details about the potential engagement for risk analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskAnalyzerForm onSubmit={onSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>
              The AI-generated risk score and factors will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col">
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-2 flex-grow">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-muted-foreground">Analyzing risk...</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive flex-grow">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Analysis Failed</h3>
                </div>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            {result && !isLoading && (
              <div className="space-y-4 flex-grow">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                  <div className="flex items-baseline justify-center gap-1 my-1">
                    <p className={cn("text-6xl font-bold", getRiskLevel(result.riskScore).colorClass)}>
                      {result.riskScore}
                    </p>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                  <Progress 
                    value={result.riskScore} 
                    className="mt-2 h-3 rounded-full" 
                    indicatorClassName={cn(
                      result.riskScore <= 33 ? 'bg-green-500' : result.riskScore <= 66 ? 'bg-yellow-500' : 'bg-red-500',
                      'rounded-full'
                    )}
                  />
                  <p className={cn("text-lg font-semibold mt-2", getRiskLevel(result.riskScore).colorClass)}>
                    {getRiskLevel(result.riskScore).label}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-foreground mb-1">Key Risk Factors Identified:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md border">
                    {result.riskFactors}
                  </p>
                </div>
                 <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3 text-green-700 dark:text-green-300 mt-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="font-semibold">Analysis Complete</h3>
                  </div>
                  <p className="text-xs mt-1">Review the risk score and factors carefully before making decisions.</p>
                </div>
              </div>
            )}
            {!isLoading && !result && !error && (
              <p className="text-center text-muted-foreground flex-grow flex items-center justify-center">
                Submit the form to see the risk analysis.
              </p>
            )}
          </CardContent>
           <CardFooter className="text-xs text-muted-foreground pt-4 border-t">
            AI-generated risk assessments are for informational purposes and should be used alongside professional judgment.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
