
'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import AnalyticsCardSkeleton from '@/components/analytics/analytics-card-skeleton';

const PredictiveAnalyticsCard = dynamic(() => import('@/components/analytics/predictive-analytics-card'), {
  loading: () => <AnalyticsCardSkeleton />,
  ssr: false,
});

const AnomalyDetectionCard = dynamic(() => import('@/components/analytics/anomaly-detection-card'), {
  loading: () => <AnalyticsCardSkeleton />,
  ssr: false,
});

const CustomVisualizationCard = dynamic(() => import('@/components/analytics/custom-visualization-card'), {
  loading: () => <AnalyticsCardSkeleton />,
  ssr: false,
});

const PersonalizedInsightsCard = dynamic(() => import('@/components/analytics/personalized-insights-card'), {
  loading: () => <AnalyticsCardSkeleton />,
  ssr: false,
});


export default function AiInsightsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/analytics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI-Powered Analytics & Insights</h1>
                <p className="text-muted-foreground">
                Explore advanced analytics capabilities driven by Artificial Intelligence.
                </p>
            </div>
        </div>
      </header>
      
      <PredictiveAnalyticsCard />
      <AnomalyDetectionCard />
      <CustomVisualizationCard />
      <PersonalizedInsightsCard />
      
    </div>
  );
}
