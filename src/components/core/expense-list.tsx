"use client";

import { useExpenses } from "@/context/expense-context";
import type { Expense } from "@/lib/types";
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
  title = "Recent Expenses", 
  description = "A list of your most recent expenses.",
  fullHeight = false
}: ExpenseListProps) {
  const { expenses } = useExpenses();

  const displayedExpenses = limit ? expenses.slice(0, limit) : expenses;

  if (expenses.length === 0) {
    return (
      <Card className="shadow-lg">
        {showTitle && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No expenses recorded yet. Start by adding an expense!</p>
        </CardContent>
      </Card>
    );
  }

  const cardContent = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium text-xs">
                {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </TableCell>
              <TableCell>
                <div className="font-medium">{expense.name}</div>
                {expense.description && (
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {expense.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                  <CategoryIcon category={expense.category} className="h-3.5 w-3.5" />
                  {expense.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                ${expense.amount.toFixed(2)}
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
          <ScrollArea className="h-[calc(100vh-258px)]"> {/* Adjusted height */}
           {cardContent}
          </ScrollArea>
        ) : (
          cardContent
        )}
      </CardContent>
    </Card>
  );
}
