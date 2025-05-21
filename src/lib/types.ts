export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Housing',
  'Utilities',
  'Transport',
  'Food & Dining',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Personal Care',
  'Gifts & Donations',
  'Subscriptions',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  description?: string;
}

export interface PredictedExpenseItem {
  category: string;
  predictedAmount: number; // Changed from amount to predictedAmount to match common usage
  period: string;
}

export interface PredictedExpensesOutput {
  predictedExpenses: PredictedExpenseItem[];
  summary: string;
}
