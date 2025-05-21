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
  'Funds Added', // New category for income/funds added
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type TransactionType = 'expense' | 'income';

export interface BaseTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  description?: string;
}

// Represents an actual expense
export interface Expense extends BaseTransaction {
  type: 'expense';
  name: string;
  // Expenses cannot be categorized as 'Funds Added'
  category: Exclude<ExpenseCategory, 'Funds Added'>;
}

// Represents funds being added to the balance
export interface Income extends BaseTransaction {
  type: 'income';
  name: string; // e.g., "Funds deposited", "Salary" or user-provided description
  category: 'Funds Added'; // Income is always categorized as 'Funds Added'
}

export type Transaction = Expense | Income;

// This remains for AI prediction output, which should only predict expenses
export interface PredictedExpenseItem {
  category: Exclude<ExpenseCategory, 'Funds Added'>; // AI should predict actual expense categories
  predictedAmount: number;
  period: string;
}

export interface PredictedExpensesOutput {
  predictedExpenses: PredictedExpenseItem[];
  summary: string;
}
