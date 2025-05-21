
"use client";

import type { Transaction, Expense, Income, ExpenseCategory, FinTrackData } from '@/lib/types'; // Ensure FinTrackData is imported
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from "date-fns";

// Initial data now includes types for transactions with Indonesian examples
const initialData: FinTrackData = {
  transactions: [
    { id: 'tx-income-1', type: 'income', name: 'Gaji Bulanan', amount: 7500000, category: 'Funds Added', date: '2024-07-01', description: 'Gaji Juli dari PT Maju Jaya' },
    { id: 'tx-expense-1', type: 'expense', name: 'Sewa Apartemen', amount: 2000000, category: 'Housing', date: '2024-07-02', description: 'Pembayaran sewa bulan Juli' },
    { id: 'tx-expense-2', type: 'expense', name: 'Belanja Bulanan Supermarket', amount: 1200000, category: 'Groceries', date: '2024-07-03', description: 'Kebutuhan pokok di Transmart' },
    { id: 'tx-expense-3', type: 'expense', name: 'Tagihan Listrik & Air', amount: 350000, category: 'Utilities', date: '2024-07-05', description: 'PLN dan PDAM' },
    { id: 'tx-expense-4', type: 'expense', name: 'Langganan Internet & TV Kabel', amount: 400000, category: 'Subscriptions', date: '2024-07-06', description: 'IndiHome paket bulanan' },
    { id: 'tx-expense-5', type: 'expense', name: 'Transportasi (Bensin & Ojek Online)', amount: 500000, category: 'Transport', date: '2024-07-07', description: 'Pengeluaran transportasi sebulan' },
    { id: 'tx-expense-6', type: 'expense', name: 'Makan di Restoran (Akhir Pekan)', amount: 300000, category: 'Food & Dining', date: '2024-07-08', description: 'Makan malam bersama keluarga' },
    { id: 'tx-expense-7', type: 'expense', name: 'Kebutuhan Pribadi (Skincare, dll)', amount: 250000, category: 'Personal Care', date: '2024-07-09', description: 'Pembelian produk perawatan' },
    { id: 'tx-income-2', type: 'income', name: 'Proyek Sampingan Selesai', amount: 2500000, category: 'Funds Added', date: '2024-07-10', description: 'Pembayaran proyek desain web' },
    { id: 'tx-expense-8', type: 'expense', name: 'Nonton Film & Cemilan', amount: 150000, category: 'Entertainment', date: '2024-07-11', description: 'Tiket bioskop dan popcorn' },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // Pre-sort initial transactions
  currentBalance: 4850000,
};


interface ExpenseContextType {
  transactions: Transaction[];
  currentBalance: number;
  addExpense: (expenseData: Omit<Expense, 'id' | 'type'>) => void;
  updateCurrentBalance: (newBalance: number) => void;
  addFunds: (amount: number, description?: string) => void;
  deleteTransaction: (transactionId: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [currentBalance, setCurrentBalanceState] = useState<number>(initialData.currentBalance);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after initial mount to sync with localStorage
    if (typeof window !== 'undefined') {
      setIsLoaded(true); // Signal that client has mounted and localStorage can be accessed
      try {
        const localDataString = localStorage.getItem('finTrackData');
        if (localDataString) {
          const parsedData = JSON.parse(localDataString) as Partial<FinTrackData>;
          const loadedTransactions = parsedData.transactions ?? initialData.transactions;
          setTransactions(loadedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          setCurrentBalanceState(parsedData.currentBalance ?? initialData.currentBalance);
        } else {
          // No data in localStorage, so save the initialData (which is already in state)
          localStorage.setItem('finTrackData', JSON.stringify({
            transactions: initialData.transactions, // Use already sorted initialData.transactions
            currentBalance: initialData.currentBalance
          }));
        }
      } catch (error) {
        console.error("Error loading/parsing data from localStorage:", error);
        // If there's an error, state remains as initialData.
        // Attempt to re-save initialData to localStorage in case it was corrupted.
        localStorage.setItem('finTrackData', JSON.stringify({
            transactions: initialData.transactions,
            currentBalance: initialData.currentBalance
        }));
      }
    }
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  useEffect(() => {
    // This effect saves data to localStorage whenever transactions or balance change,
    // but only after the initial client-side load is complete (isLoaded is true).
    if (typeof window !== 'undefined' && isLoaded) {
      const dataToSave: FinTrackData = { 
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
        currentBalance 
      };
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
      name: description || "Dana Ditambahkan",
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
      let newBalance = currentBalance;
      if (transactionToDelete) {
        if (transactionToDelete.type === 'expense') {
          newBalance += transactionToDelete.amount;
        } else if (transactionToDelete.type === 'income') {
          newBalance -= transactionToDelete.amount;
        }
      }
      setCurrentBalanceState(newBalance);
      return prevTransactions.filter((transaction) => transaction.id !== transactionId)
                             .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

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

