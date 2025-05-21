
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
import { EXPENSE_CATEGORIES } from '@/lib/types';

const expenseCategoriesList = EXPENSE_CATEGORIES.join(', ');

const PredictExpensesInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical expense data as a JSON string. Each entry should contain expense category, amount, and date.'
    ),
  period: z
    .string()
    .describe(
      'The period for which to predict expenses (e.g., "next month", "next quarter").'
    ),
});
export type PredictExpensesInput = z.infer<typeof PredictExpensesInputSchema>;

const PredictedExpenseItemSchema = z.object({
  category: z.string().describe(`The category of the predicted expense. Must be one of: ${expenseCategoriesList}.`),
  predictedAmount: z.number().describe("The predicted monetary amount for this expense category."),
  period: z.string().describe("The period for which this expense is predicted (e.g., 'next month', 'next week').")
});
export type PredictedExpenseItem = z.infer<typeof PredictedExpenseItemSchema>;

const PredictExpensesOutputSchema = z.object({
  predictedExpenses: z.array(PredictedExpenseItemSchema).describe(
      `A list of predicted expenses. Each object in the array must have "category" (string, from the allowed list: ${expenseCategoriesList}), "predictedAmount" (number), and "period" (string) fields. Return an empty array if no specific expenses can be predicted, but always provide a summary.`
    ),
  summary: z.string().describe('A concise summary of the predicted expenses, highlighting key trends or total amounts. If no specific expenses are predicted, explain why (e.g., insufficient data, no recurring patterns for the period).'),
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
Your response must be purely data-driven based on the input and the requested output schema. Do not attempt to invoke external system calls or assume environment-specific functionalities beyond generating the structured data.

Historical Data: {{{historicalData}}}
Period: {{{period}}}

Allowed Expense Categories: ${expenseCategoriesList}

Provide the predicted expenses as a JSON array of objects, where each object has "category" (string from the allowed list), "predictedAmount" (number), and "period" (string) fields.
Also, provide a summary of the predicted expenses.

Ensure the predicted expenses include all known recurring payments such as rent, mortgage, subscriptions, etc., based on the historical data.
If the historical data is insufficient to make specific predictions for itemized expenses, return an empty array for "predictedExpenses" and explain this in the "summary".

Output:
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  }
});

const predictExpensesFlow = ai.defineFlow(
  {
    name: 'predictExpensesFlow',
    inputSchema: PredictExpensesInputSchema,
    outputSchema: PredictExpensesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a prediction.");
    }
    // Ensure predictedExpenses is an array, even if AI fails to produce it sometimes
    // The Zod schema should handle this, but as a fallback:
    if (!Array.isArray(output.predictedExpenses)) {
        console.warn('predictExpensesFlow: output.predictedExpenses was not an array, defaulting to empty array.');
        return { ...output, predictedExpenses: [] };
    }
    return output;
  }
);

