
'use client';

import { useState } from 'react';
import { Lightbulb, Cpu, HelpCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { handleGetBusinessInsight } from '@/app/analytics/ai-insights/actions';
import type { BusinessInsightOutput } from '@/ai/flows/generate-business-insight';
import { Badge } from '@/components/ui/badge';

export default function PersonalizedInsightsCard() {
  const [insightContext, setInsightContext] = useState('');
  const [insightResult, setInsightResult] = useState<BusinessInsightOutput | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const onGetInsight = async () => {
    if (!insightContext.trim()) {
      setInsightError('Please enter a question or scenario.');
      return;
    }
    setIsInsightLoading(true);
    setInsightResult(null);
    setInsightError(null);
    const result = await handleGetBusinessInsight({ context: insightContext });
    if ('error' in result) {
      setInsightError(result.error);
    } else {
      setInsightResult(result);
    }
    setIsInsightLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-primary" />
          <CardTitle>Personalized Insights & Recommendations</CardTitle>
        </div>
        <CardDescription>
          Receive AI-generated insights and actionable recommendations based on your role, data patterns, and business goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your business question or scenario here... (e.g., 'How can we improve client retention in the tech sector?', 'What are the key risks for upcoming Project Zeta?')"
          value={insightContext}
          onChange={(e) => setInsightContext(e.target.value)}
          rows={4}
          className="text-sm"
        />
        <Button onClick={onGetInsight} disabled={isInsightLoading} className="w-full sm:w-auto">
          {isInsightLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Insight...
            </>
          ) : (
            <> <Cpu className="mr-2 h-4 w-4"/> Get AI Insight</>
          )}
        </Button>

        {insightError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive">
            <p className="text-sm font-medium flex items-center gap-2"><AlertTriangle size={16}/> Error: {insightError}</p>
          </div>
        )}

        {insightResult && (
          <Card className="bg-muted/30 p-4">
            <CardTitle className="text-lg mb-2">AI Generated Insight:</CardTitle>
            <p className="text-sm mb-3 whitespace-pre-wrap">{insightResult.insight}</p>
            
            <h4 className="font-semibold text-md mt-3 mb-1.5">Actionable Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {insightResult.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
            
            {insightResult.confidenceScore && (
              <p className="text-xs text-muted-foreground mt-3">
                AI Confidence: {(insightResult.confidenceScore * 100).toFixed(0)}%
              </p>
            )}
            {insightResult.relatedDataPoints && insightResult.relatedDataPoints.length > 0 && (
               <div className="mt-3">
                  <p className="text-xs text-muted-foreground font-medium">Theoretical Data Points Considered:</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                      {insightResult.relatedDataPoints.map((dp, i) => (
                          <Badge variant="secondary" key={i} className="text-xs">{dp}</Badge>
                      ))}
                  </div>
               </div>
            )}
          </Card>
        )}
      </CardContent>
       <CardFooter className="text-xs text-muted-foreground flex items-start gap-1.5 pt-4 border-t">
          <HelpCircle size={16} className="shrink-0 mt-0.5"/>
          <span>AI insights are generated based on the provided context and general business knowledge. Always cross-reference with specific company data and expert judgment.</span>
      </CardFooter>
    </Card>
  );
}
