
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useExpenses } from "@/context/expense-context";
import type { Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { CategoryIcon } from "./category-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseListProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
  description?: string;
  fullHeight?: boolean;
  showFilters?: boolean; // New prop
}

const ALL_FILTER_VALUE = "__ALL__"; // Special value for "All" options

export function ExpenseList({
  limit,
  showTitle = true,
  title = "Recent Transactions",
  description = "A list of your most recent financial activities.",
  fullHeight = false,
  showFilters = false // Default to false
}: ExpenseListProps) {
  const { transactions, deleteTransaction } = useExpenses();
  const { toast } = useToast();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const monthOptions = useMemo(() => [
    { value: "01", label: "January" }, { value: "02", label: "February" },
    { value: "03", label: "March" }, { value: "04", label: "April" },
    { value: "05", label: "May" }, { value: "06", label: "June" },
    { value: "07", label: "July" }, { value: "08", label: "August" },
    { value: "09", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" },
  ], []);

  const availableYears = useMemo(() => {
    if (!transactions || transactions.length === 0) return [new Date().getFullYear()];
    const years = new Set<number>();
    transactions.forEach(t => {
      const dateObj = new Date(t.date + 'T00:00:00');
      if (!isNaN(dateObj.getTime())) {
        years.add(dateObj.getFullYear());
      }
    });
    if (years.size === 0) return [new Date().getFullYear()];
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!showFilters) return transactions;

    let items = [...transactions];
    if (selectedYear && selectedYear !== ALL_FILTER_VALUE) {
      items = items.filter(t => t.date.startsWith(selectedYear));
    }
    if (selectedMonth && selectedMonth !== ALL_FILTER_VALUE && selectedYear && selectedYear !== ALL_FILTER_VALUE) {
      items = items.filter(t => t.date.substring(5, 7) === selectedMonth);
    }
    return items;
  }, [transactions, selectedMonth, selectedYear, showFilters]);

  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Transaction Deleted",
      description: "The transaction has been successfully removed.",
      variant: "default",
    });
    setTransactionToDelete(null);
  };

  const listContent = displayedTransactions.length > 0 ? (
    <Table className="min-w-max">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] whitespace-nowrap">Date</TableHead>
          <TableHead className="whitespace-nowrap">Name / Description</TableHead>
          <TableHead className="whitespace-nowrap">Category</TableHead>
          <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
          <TableHead className="w-[80px] text-center whitespace-nowrap">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium text-xs whitespace-nowrap">
              {new Date(transaction.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </TableCell>
            <TableCell>
              <div className="font-medium whitespace-nowrap">{transaction.name}</div>
              {transaction.description && (
                <div className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">
                  {transaction.description}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center gap-1.5 w-fit whitespace-nowrap">
                <CategoryIcon category={transaction.category} className="h-3.5 w-3.5" />
                {transaction.category}
              </Badge>
            </TableCell>
            <TableCell
              className={cn(
                "text-right font-semibold whitespace-nowrap",
                transaction.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
              )}
            >
              {transaction.type === 'income' ? `+Rp ${transaction.amount.toFixed(0)}` : `-Rp ${transaction.amount.toFixed(0)}`}
            </TableCell>
            <TableCell className="text-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTransactionToDelete(transaction)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                {transactionToDelete && transactionToDelete.id === transaction.id && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the transaction
                        "{transactionToDelete.name}" (Amount: Rp {transactionToDelete.amount.toFixed(0)})
                        and adjust your balance accordingly.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(transactionToDelete.id)} className={localButtonVariants({ variant: "destructive" })}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
     <div className={cn("text-muted-foreground text-center", fullHeight ? "flex h-full items-center justify-center" : "py-8")}>
        <p>
        {showFilters && (selectedMonth || selectedYear)
            ? "No transactions match your filters for the selected period."
            : "No transactions recorded yet. Start by adding an expense or funds!"}
        </p>
    </div>
  );

  const scrollAreaHeightClass = cn({
    "h-[calc(100vh-328px)]": fullHeight && showFilters,
    "h-[calc(100vh-258px)]": fullHeight && !showFilters,
  });


  return (
    <Card className="shadow-lg w-full">
      {showTitle && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="p-6">
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:items-center border-b pb-6">
            <Select
              value={selectedYear || ALL_FILTER_VALUE}
              onValueChange={(value) => {
                const newYear = value === ALL_FILTER_VALUE ? null : value;
                setSelectedYear(newYear);
                if (!newYear) { // If "All Years" is selected, clear month
                  setSelectedMonth(null);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedMonth || ALL_FILTER_VALUE}
              onValueChange={(value) => setSelectedMonth(value === ALL_FILTER_VALUE ? null : value)}
              disabled={!selectedYear || selectedYear === ALL_FILTER_VALUE} // Disable if no year is selected or "All Years"
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Months</SelectItem>
                {monthOptions.map(month => (
                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => { setSelectedMonth(null); setSelectedYear(null); }}
              className="w-full sm:w-auto"
              disabled={(!selectedMonth || selectedMonth === ALL_FILTER_VALUE) && (!selectedYear || selectedYear === ALL_FILTER_VALUE)}
            >
              Clear Filters
            </Button>
          </div>
        )}
        {fullHeight ? (
          <ScrollArea className={scrollAreaHeightClass || undefined}>
           {listContent}
          </ScrollArea>
        ) : (
          listContent
        )}
      </CardContent>
    </Card>
  );
}

const localButtonVariants = ({ variant }: { variant: string }) => {
  if (variant === "destructive") {
    return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  }
  return "";
};

