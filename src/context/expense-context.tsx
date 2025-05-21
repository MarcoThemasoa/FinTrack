"use client";

import type { Expense } from '@/lib/types';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  // Future methods: removeExpense, updateExpense
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const initialExpenses: Expense[] = [
  { id: '1', name: 'Monthly Groceries', amount: 250, category: 'Groceries', date: '2024-07-01', description: 'Aldi haul' },
  { id: '2', name: 'Netflix Subscription', amount: 15.99, category: 'Subscriptions', date: '2024-07-05', description: 'Monthly plan' },
  { id: '3', name: 'Gas Bill', amount: 75.50, category: 'Utilities', date: '2024-07-10' },
  { id: '4', name: 'Dinner with Friends', amount: 60, category: 'Food & Dining', date: '2024-07-12', description: 'Italian place' },
  { id: '5', name: 'New Book', amount: 22, category: 'Shopping', date: '2024-07-15' },
];


export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
     if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('expenses');
      return localData ? JSON.parse(localData) : initialExpenses;
    }
    return initialExpenses;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: new Date().toISOString() + Math.random().toString(), // Simple unique ID
    };
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense }}>
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
