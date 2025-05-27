
'use server';

import { generateBusinessInsight, type BusinessInsightInput, type BusinessInsightOutput } from '@/ai/flows/generate-business-insight';

export async function handleGetBusinessInsight(
  input: BusinessInsightInput
): Promise<BusinessInsightOutput | { error: string }> {
  try {
    if (!input.context || input.context.trim().length < 10) {
      return { error: 'Please provide a more detailed context or question (min 10 characters).' };
    }
    
    const result = await generateBusinessInsight(input);
    return result;
  } catch (error) {
    console.error('Error in AI business insight generation:', error);
    if (error instanceof Error) {
        return { error: error.message || 'Failed to generate insight due to an AI service error.' };
    }
    return { error: 'An unknown error occurred during insight generation.' };
  }
}
