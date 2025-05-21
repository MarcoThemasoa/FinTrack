// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Predicts upcoming expenses based on historical data.
 *
 * - predictExpenses - Predicts upcoming expenses.
 * - PredictExpensesInput - The input type for the predictExpenses function.
 * - PredictExpensesOutput - The return type for the predictExpenses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictExpensesInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical expense data as a JSON string.  Each entry should contain expense category, amount, and date.'
    ),
  period: z
    .string()
    .describe(
      'The period for which to predict expenses (e.g., "next month", "next quarter").'
    ),
});
export type PredictExpensesInput = z.infer<typeof PredictExpensesInputSchema>;

const PredictExpensesOutputSchema = z.object({
  predictedExpenses: z
    .string()
    .describe(
      'Predicted expenses as a JSON string, including expense category, predicted amount, and period.'
    ),
  summary: z.string().describe('A summary of the predicted expenses.'),
});
export type PredictExpensesOutput = z.infer<typeof PredictExpensesOutputSchema>;

export async function predictExpenses(input: PredictExpensesInput): Promise<PredictExpensesOutput> {
  return predictExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictExpensesPrompt',
  input: {schema: PredictExpensesInputSchema},
  output: {schema: PredictExpensesOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the historical expense data provided and predict upcoming expenses for the specified period.

Historical Data: {{{historicalData}}}
Period: {{{period}}}

Provide the predicted expenses as a JSON string, including expense category, predicted amount, and period. Also, provide a summary of the predicted expenses.

Ensure the predicted expenses include all known recurring payments such as rent, mortgage, subscriptions, etc.

Output:
`, safetySettings: [
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
  ],
});

const predictExpensesFlow = ai.defineFlow(
  {
    name: 'predictExpensesFlow',
    inputSchema: PredictExpensesInputSchema,
    outputSchema: PredictExpensesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
