'use server';

import { analyzeEngagementRisk, type AnalyzeEngagementRiskInput, type AnalyzeEngagementRiskOutput } from '@/ai/flows/analyze-engagement-risk';

export async function handleAnalyzeRisk(
  data: AnalyzeEngagementRiskInput
): Promise<AnalyzeEngagementRiskOutput | { error: string }> {
  try {
    // Basic server-side validation example (can be more extensive)
    if (!data.technicalComplexity || !data.resourceNeeds || !data.clientHistory || !data.clientCountryPoliticalExposure) {
      return { error: 'All fields are required.' };
    }
    
    const result = await analyzeEngagementRisk(data);
    return result;
  } catch (error) {
    console.error('Error in AI risk analysis:', error);
    // Check for specific error types if Genkit provides them
    if (error instanceof Error) {
        return { error: error.message || 'Failed to analyze risk due to an AI service error.' };
    }
    return { error: 'An unknown error occurred during risk analysis.' };
  }
}
