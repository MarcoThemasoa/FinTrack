
"use client";

import type { Transaction, Expense, Income, ExpenseCategory } from '@/lib/types';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from "date-fns";

interface FinTrackData {
  transactions: Transaction[];
  currentBalance: number;
}

// Initial data now includes types for transactions
const initialData: FinTrackData = {
  transactions: [
    { id: '1', type: 'expense', name: 'Monthly Groceries', amount: 250, category: 'Groceries', date: '2024-07-01', description: 'Aldi haul' },
    { id: 'tx-income-1', type: 'income', name: 'Initial Balance Deposit', amount: 1000, category: 'Funds Added', date: '2024-06-28', description: 'Starting funds' },
    { id: '2', type: 'expense', name: 'Netflix Subscription', amount: 15.99, category: 'Subscriptions', date: '2024-07-05', description: 'Monthly plan' },
    { id: '3', type: 'expense', name: 'Gas Bill', amount: 75.50, category: 'Utilities', date: '2024-07-10' },
    { id: 'tx-income-2', type: 'income', name: 'Freelance Payment', amount: 500, category: 'Funds Added', date: '2024-07-11', description: 'Web design project' },
    { id: '4', type: 'expense', name: 'Dinner with Friends', amount: 60, category: 'Food & Dining', date: '2024-07-12', description: 'Italian place' },
    { id: '5', type: 'expense', name: 'New Book', amount: 22, category: 'Shopping', date: '2024-07-15' },
  ],
  // Calculate initial balance from the sum of income minus sum of expenses in initial transactions
  currentBalance: 1000 + 500 - (250 + 15.99 + 75.50 + 60 + 22),
};


interface ExpenseContextType {
  transactions: Transaction[];
  currentBalance: number;
  addExpense: (expenseData: Omit<Expense, 'id' | 'type'>) => void;
  updateCurrentBalance: (newBalance: number) => void;
  addFunds: (amount: number, description?: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalanceState] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const localDataString = localStorage.getItem('finTrackData');
        if (localDataString) {
          const parsedData = JSON.parse(localDataString) as Partial<FinTrackData>;
          setTransactions(parsedData.transactions ?? initialData.transactions);
          setCurrentBalanceState(parsedData.currentBalance ?? initialData.currentBalance);
        } else {
          setTransactions(initialData.transactions);
          setCurrentBalanceState(initialData.currentBalance);
          localStorage.setItem('finTrackData', JSON.stringify(initialData));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setTransactions(initialData.transactions);
        setCurrentBalanceState(initialData.currentBalance);
         if (typeof window !== 'undefined') {
            localStorage.setItem('finTrackData', JSON.stringify(initialData));
         }
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      // Recalculate balance from transactions to ensure consistency if manual edits occur or for robust state.
      // However, for performance and simplicity with direct balance updates, we might keep currentBalance as the source of truth
      // and only update it through dedicated functions.
      // For now, we'll save the current state of transactions and currentBalance.
      const dataToSave: FinTrackData = { transactions, currentBalance };
      localStorage.setItem('finTrackData', JSON.stringify(dataToSave));
    }
  }, [transactions, currentBalance, isLoaded]);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'type'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
      type: 'expense',
    };
    setTransactions((prevTransactions) => [newExpense, ...prevTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentBalanceState((prevBalance) => prevBalance - newExpense.amount);
  };

  const updateCurrentBalance = (newBalance: number) => {
    setCurrentBalanceState(newBalance);
  };

  const addFunds = (amount: number, description?: string) => {
    const newIncome: Income = {
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
      type: 'income',
      name: description || "Funds Added",
      amount: amount,
      date: format(new Date(), "yyyy-MM-dd"),
      category: 'Funds Added',
      description: description,
    };
    setTransactions((prevTransactions) => [newIncome, ...prevTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentBalanceState((prevBalance) => prevBalance + amount);
  };
  
  // Sort transactions initially and after any change
  useEffect(() => {
    if (isLoaded) {
      setTransactions(prev => [...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [isLoaded]);


  return (
    <ExpenseContext.Provider value={{ transactions, addExpense, currentBalance, updateCurrentBalance, addFunds }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
