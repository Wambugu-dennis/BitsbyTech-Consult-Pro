
'use server';
/**
 * @fileOverview AI flow for generating business insights and recommendations.
 *
 * - generateBusinessInsight - A function that provides insights based on user context.
 * - BusinessInsightInput - The input type.
 * - BusinessInsightOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessInsightInputSchema = z.object({
  context: z.string().describe('A business question, scenario, or context provided by the user.'),
});
export type BusinessInsightInput = z.infer<typeof BusinessInsightInputSchema>;

const BusinessInsightOutputSchema = z.object({
  insight: z.string().describe('A concise, key insight generated by the AI based on the provided context.'),
  recommendations: z.array(z.string()).describe('A list of actionable recommendations related to the insight.'),
  confidenceScore: z.number().min(0).max(1).optional().describe('A score from 0 to 1 indicating the AI confidence in its response.'),
  relatedDataPoints: z.array(z.string()).optional().describe('Mock data points or areas the AI considered for this insight.'),
});
export type BusinessInsightOutput = z.infer<typeof BusinessInsightOutputSchema>;

export async function generateBusinessInsight(input: BusinessInsightInput): Promise<BusinessInsightOutput> {
  return generateBusinessInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessInsightPrompt',
  input: {schema: BusinessInsightInputSchema},
  output: {schema: BusinessInsightOutputSchema},
  prompt: `You are a highly experienced business strategy consultant.
The user will provide a business question, scenario, or context.
Your task is to:
1.  Provide a single, concise, and impactful "insight" directly addressing the user's input.
2.  Generate 2-4 actionable "recommendations" based on this insight.
3.  (Optional) Provide a confidenceScore between 0.0 and 1.0 for your response.
4.  (Optional) List 1-3 mock "relatedDataPoints" or topics you theoretically considered to arrive at this insight (e.g., "Market Growth Rate Q3", "Client Feedback Score - Tech Sector", "Competitor X Pricing Strategy"). This is for illustrative purposes.

User Context:
{{{context}}}

Structure your output strictly according to the BusinessInsightOutputSchema.
Example:
Context: "How can we improve sales for our new SaaS product in a competitive market?"
Output:
{
  "insight": "Focusing on a niche underserved by competitors and highlighting unique differentiators in targeted marketing campaigns can significantly boost initial adoption and market penetration for your new SaaS product.",
  "recommendations": [
    "Conduct thorough market research to identify a specific niche segment with unmet needs that your SaaS product can address effectively.",
    "Develop compelling marketing messaging that clearly articulates your product's unique value proposition compared to existing solutions.",
    "Implement a pilot program with a small group of target users in the identified niche to gather feedback and build case studies."
  ],
  "confidenceScore": 0.85,
  "relatedDataPoints": ["Competitor feature analysis", "Target audience survey results", "Early adopter feedback"]
}
`,
});

const generateBusinessInsightFlow = ai.defineFlow(
  {
    name: 'generateBusinessInsightFlow',
    inputSchema: BusinessInsightInputSchema,
    outputSchema: BusinessInsightOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        // Fallback or error handling if the LLM doesn't return structured output as expected
        // For now, we'll provide a generic response if output is null/undefined.
        return {
            insight: "The AI model could not generate a specific insight for this query. Please try rephrasing or providing more context.",
            recommendations: ["Ensure your query is clear and provides enough detail.", "Consider focusing on a specific business area."],
        };
    }
    return output;
  }
);
