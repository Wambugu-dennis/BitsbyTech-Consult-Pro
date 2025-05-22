// src/ai/flows/analyze-engagement-risk.ts
'use server';

/**
 * @fileOverview AI-driven risk assessment tool for analyzing potential engagements.
 *
 * - analyzeEngagementRisk - A function that analyzes potential engagements and returns a risk score.
 * - AnalyzeEngagementRiskInput - The input type for the analyzeEngagementRisk function.
 * - AnalyzeEngagementRiskOutput - The return type for the analyzeEngagementRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEngagementRiskInputSchema = z.object({
  technicalComplexity: z
    .string()
    .describe('Description of the technical complexity of the engagement.'),
  resourceNeeds: z
    .string()
    .describe('Description of the resource needs for the engagement.'),
  clientHistory: z
    .string()
    .describe('Description of the client history.'),
  clientCountryPoliticalExposure: z
    .string()
    .describe(
      'Description of the client’s country political exposure (politically in their country of origin).'
    ),
});

export type AnalyzeEngagementRiskInput = z.infer<typeof AnalyzeEngagementRiskInputSchema>;

const AnalyzeEngagementRiskOutputSchema = z.object({
  riskScore: z
    .number()
    .describe(
      'A risk score from 0 to 100, with 0 being the lowest risk and 100 being the highest risk.'
    ),
  riskFactors: z
    .string()
    .describe('A summary of the risk factors that contributed to the risk score.'),
});

export type AnalyzeEngagementRiskOutput = z.infer<typeof AnalyzeEngagementRiskOutputSchema>;

export async function analyzeEngagementRisk(
  input: AnalyzeEngagementRiskInput
): Promise<AnalyzeEngagementRiskOutput> {
  return analyzeEngagementRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEngagementRiskPrompt',
  input: {schema: AnalyzeEngagementRiskInputSchema},
  output: {schema: AnalyzeEngagementRiskOutputSchema},
  prompt: `You are an AI consultant specializing in risk assessment for potential engagements.

You will analyze the following factors to determine a risk score and identify key risk factors:

Technical Complexity: {{{technicalComplexity}}}
Resource Needs: {{{resourceNeeds}}}
Client History: {{{clientHistory}}}
Client Country Political Exposure: {{{clientCountryPoliticalExposure}}}

Based on these factors, provide a risk score from 0 to 100 and a summary of the risk factors.

Consider the following:

*   Technical complexity can introduce execution risks.
*   Resource needs can impact project costs and timelines.
*   Client history can indicate potential relationship or payment risks.
*   Client country political exposure can create compliance and reputational risks.

Ensure that the risk score and risk factors are aligned with the provided information.`,
});

const analyzeEngagementRiskFlow = ai.defineFlow(
  {
    name: 'analyzeEngagementRiskFlow',
    inputSchema: AnalyzeEngagementRiskInputSchema,
    outputSchema: AnalyzeEngagementRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
