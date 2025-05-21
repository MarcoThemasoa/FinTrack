
"use client";

import type { Transaction, Expense, Income, ExpenseCategory } from '@/lib/types';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from "date-fns";

interface FinTrackData {
  transactions: Transaction[];
  currentBalance: number;
}

// Initial data now includes types for transactions with Indonesian examples
const initialData: FinTrackData = {
  transactions: [
    { id: 'tx-income-1', type: 'income', name: 'Gaji Awal Bulan', amount: 5000000, category: 'Funds Added', date: '2024-07-01', description: 'Gaji Juli dari Perusahaan X' },
    { id: 'tx-expense-1', type: 'expense', name: 'Bayar Kos Agustus', amount: 1200000, category: 'Housing', date: '2024-07-02', description: 'Sewa kamar kos bulan Agustus' },
    { id: 'tx-expense-2', type: 'expense', name: 'Belanja Kebutuhan Pokok', amount: 750000, category: 'Groceries', date: '2024-07-03', description: 'Belanja di Super Indo' },
    { id: 'tx-expense-3', type: 'expense', name: 'Tagihan Listrik Juli', amount: 200000, category: 'Utilities', date: '2024-07-05' },
    { id: 'tx-expense-4', type: 'expense', name: 'Langganan Streaming Vidio', amount: 49000, category: 'Subscriptions', date: '2024-07-06', description: 'Paket bulanan' },
    { id: 'tx-expense-5', type: 'expense', name: 'Isi Bensin Pertamax', amount: 60000, category: 'Transport', date: '2024-07-07', description: 'Untuk motor Vario' },
    { id: 'tx-expense-6', type: 'expense', name: 'Makan Siang Warteg Bahari', amount: 25000, category: 'Food & Dining', date: '2024-07-08' },
    { id: 'tx-expense-7', type: 'expense', name: 'Beli Buku "Filosofi Teras"', amount: 85000, category: 'Shopping', date: '2024-07-09', description: 'Di Gramedia' },
    { id: 'tx-income-2', type: 'income', name: 'Bonus Proyek Akhir', amount: 1500000, category: 'Funds Added', date: '2024-07-10', description: 'Bonus penyelesaian proyek Y' },
    { id: 'tx-expense-8', type: 'expense', name: 'Nonton Bioskop XXI', amount: 50000, category: 'Entertainment', date: '2024-07-11', description: 'Film Agak Laen' },
  ],
  // Calculate initial balance from the sum of income minus sum of expenses in initial transactions
  // Income: 5,000,000 + 1,500,000 = 6,500,000
  // Expenses: 1,200,000 + 750,000 + 200,000 + 49,000 + 60,000 + 25,000 + 85,000 + 50,000 = 2,419,000
  // Balance: 6,500,000 - 2,419,000 = 4,081,000
  currentBalance: 4081000,
};


interface ExpenseContextType {
  transactions: Transaction[];
  currentBalance: number;
  addExpense: (expenseData: Omit<Expense, 'id' | 'type'>) => void;
  updateCurrentBalance: (newBalance: number) => void;
  addFunds: (amount: number, description?: string) => void;
  deleteTransaction: (transactionId: string) => void; // New function
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
      name: description || "Dana Ditambahkan", // Changed to Indonesian
      amount: amount,
      date: format(new Date(), "yyyy-MM-dd"),
      category: 'Funds Added',
      description: description,
    };
    setTransactions((prevTransactions) => [newIncome, ...prevTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentBalanceState((prevBalance) => prevBalance + amount);
  };
  
  const deleteTransaction = (transactionId: string) => {
    setTransactions((prevTransactions) => {
      const transactionToDelete = prevTransactions.find(t => t.id === transactionId);
      if (transactionToDelete) {
        if (transactionToDelete.type === 'expense') {
          setCurrentBalanceState((prevBalance) => prevBalance + transactionToDelete.amount);
        } else if (transactionToDelete.type === 'income') {
          setCurrentBalanceState((prevBalance) => prevBalance - transactionToDelete.amount);
        }
      }
      return prevTransactions.filter((transaction) => transaction.id !== transactionId);
    });
  };

  // Sort transactions initially and after any change
  useEffect(() => {
    if (isLoaded) {
      setTransactions(prev => [...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [isLoaded]);


  return (
    <ExpenseContext.Provider value={{ transactions, addExpense, currentBalance, updateCurrentBalance, addFunds, deleteTransaction }}>
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

