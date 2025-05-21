
"use client";

import { useExpenses } from "@/context/expense-context";
import type { Transaction } from "@/lib/types"; // Updated to use Transaction type
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
  title = "Recent Transactions", // Changed title to reflect income and expenses
  description = "A list of your most recent financial activities.",
  fullHeight = false
}: ExpenseListProps) {
  const { transactions } = useExpenses(); // Use transactions from context

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

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
                {transaction.description && transaction.type === 'expense' && ( // Show description for expenses
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {transaction.description}
                  </div>
                )}
                 {transaction.type === 'income' && transaction.description && ( // Show description for income if different from name
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
