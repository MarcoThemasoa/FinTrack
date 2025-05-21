
"use client";

import React, { useState } from 'react'; // Import useState
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
import { Button } from "@/components/ui/button"; // Import Button
import { Trash2 } from 'lucide-react'; // Import Trash2 icon
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
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { CategoryIcon } from "./category-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ExpenseListProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
  description?: string;
  fullHeight?: boolean;
}

export function ExpenseList({ 
  limit, 
  showTitle = true, 
  title = "Recent Transactions",
  description = "A list of your most recent financial activities.",
  fullHeight = false
}: ExpenseListProps) {
  const { transactions, deleteTransaction } = useExpenses();
  const { toast } = useToast();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Transaction Deleted",
      description: "The transaction has been successfully removed.",
      variant: "default",
    });
    setTransactionToDelete(null); // Close dialog
  };

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        {showTitle && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No transactions recorded yet. Start by adding an expense or funds!</p>
        </CardContent>
      </Card>
    );
  }

  const cardContent = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Name / Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[80px] text-center">Actions</TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium text-xs">
                {new Date(transaction.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </TableCell>
              <TableCell>
                <div className="font-medium">{transaction.name}</div>
                {transaction.description && (
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {transaction.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                  <CategoryIcon category={transaction.category} className="h-3.5 w-3.5" />
                  {transaction.category}
                </Badge>
              </TableCell>
              <TableCell 
                className={cn(
                  "text-right font-semibold",
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                )}
              >
                {transaction.type === 'income' ? `+$${transaction.amount.toFixed(2)}` : `-$${transaction.amount.toFixed(2)}`}
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
                  {/* Conditionally render content only if transactionToDelete matches current transaction to avoid multiple dialogs logic issues */}
                  {transactionToDelete && transactionToDelete.id === transaction.id && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the transaction
                          "{transactionToDelete.name}" (Amount: ${transactionToDelete.amount.toFixed(2)})
                          and adjust your balance accordingly.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(transactionToDelete.id)} className={buttonVariants({ variant: "destructive" })}>
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
  );


  return (
    <Card className="shadow-lg w-full">
      {showTitle && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className={fullHeight ? "p-0" : ""}>
        {fullHeight ? (
          <ScrollArea className="h-[calc(100vh-258px)]">
           {cardContent}
          </ScrollArea>
        ) : (
          cardContent
        )}
      </CardContent>
    </Card>
  );
}

// Helper to get buttonVariants (if not directly imported for AlertDialogAction)
// Ensure this is available or adjust the className for AlertDialogAction
const buttonVariants = ({ variant }: { variant: string }) => {
  if (variant === "destructive") {
    return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  }
  return "";
};
