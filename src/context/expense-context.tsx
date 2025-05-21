
"use client";

import type { Expense } from '@/lib/types';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface FinTrackData {
  expenses: Expense[];
  currentBalance: number;
}

const initialData: FinTrackData = {
  expenses: [
    { id: '1', name: 'Monthly Groceries', amount: 250, category: 'Groceries', date: '2024-07-01', description: 'Aldi haul' },
    { id: '2', name: 'Netflix Subscription', amount: 15.99, category: 'Subscriptions', date: '2024-07-05', description: 'Monthly plan' },
    { id: '3', name: 'Gas Bill', amount: 75.50, category: 'Utilities', date: '2024-07-10' },
    { id: '4', name: 'Dinner with Friends', amount: 60, category: 'Food & Dining', date: '2024-07-12', description: 'Italian place' },
    { id: '5', name: 'New Book', amount: 22, category: 'Shopping', date: '2024-07-15' },
  ],
  currentBalance: 1000, // Initial default balance
};

interface ExpenseContextType {
  expenses: Expense[];
  currentBalance: number;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateCurrentBalance: (newBalance: number) => void;
  addFunds: (amount: number, description?: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentBalance, setCurrentBalanceState] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load data from localStorage on initial client-side render
    if (typeof window !== 'undefined') {
      try {
        const localDataString = localStorage.getItem('finTrackData');
        if (localDataString) {
          const parsedData = JSON.parse(localDataString) as Partial<FinTrackData>;
          setExpenses(parsedData.expenses ?? initialData.expenses);
          setCurrentBalanceState(parsedData.currentBalance ?? initialData.currentBalance);
        } else {
          // If no data in localStorage, prime it with initialData
          setExpenses(initialData.expenses);
          setCurrentBalanceState(initialData.currentBalance);
          localStorage.setItem('finTrackData', JSON.stringify(initialData));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        // Fallback to initial data if parsing fails
        setExpenses(initialData.expenses);
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
    // Save data to localStorage whenever expenses or currentBalance change
    if (typeof window !== 'undefined' && isLoaded) {
      const dataToSave: FinTrackData = { expenses, currentBalance };
      localStorage.setItem('finTrackData', JSON.stringify(dataToSave));
    }
  }, [expenses, currentBalance, isLoaded]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: new Date().toISOString() + Math.random().toString(), // Simple unique ID
    };
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    setCurrentBalanceState((prevBalance) => prevBalance - newExpense.amount);
  };

  const updateCurrentBalance = (newBalance: number) => {
    setCurrentBalanceState(newBalance);
  };

  const addFunds = (amount: number, description?: string) => {
    // For now, description is not stored, but can be used later for logging income.
    setCurrentBalanceState((prevBalance) => prevBalance + amount);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, currentBalance, updateCurrentBalance, addFunds }}>
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
