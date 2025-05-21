
"use client";

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/context/expense-context';
import { predictExpenses } from '@/ai/flows/predict-upcoming-expenses';
import type { PredictExpensesInput, PredictExpensesOutput, PredictedExpenseItem } from '@/ai/flows/predict-upcoming-expenses';
// Note: PredictedExpenseItem from flow and types.ts should be structurally compatible.

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Info } from 'lucide-react';
import { CategoryIcon } from './category-icon';
import { Badge } from '../ui/badge';
import type { ExpenseCategory } from '@/lib/types';

export function ExpensePrediction() {
  const { expenses, currentBalance } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictExpensesOutput | null>(null);
  const [period, setPeriod] = useState<string>("next month");
  const [totalPredictedAmount, setTotalPredictedAmount] = useState<number>(0);

  useEffect(() => {
    if (predictionResult && Array.isArray(predictionResult.predictedExpenses)) {
      const total = predictionResult.predictedExpenses.reduce((sum, item) => sum + item.predictedAmount, 0);
      setTotalPredictedAmount(total);
    } else {
      setTotalPredictedAmount(0);
    }
  }, [predictionResult]);

  const handlePredictExpenses = async () => {
    setLoading(true);
    setError(null);
    setPredictionResult(null);
    setTotalPredictedAmount(0);

    if (expenses.length < 3) {
        setError("Not enough historical data. Please add at least 3 expenses for a better prediction.");
        setLoading(false);
        return;
    }

    const historicalDataForAI = expenses.map(exp => ({
      category: exp.category,
      amount: exp.amount,
      date: exp.date,
    }));

    const input: PredictExpensesInput = {
      historicalData: JSON.stringify(historicalDataForAI),
      period: period,
    };

    try {
      const result = await predictExpenses(input);
      setPredictionResult(result);
    } catch (e: any) {
      console.error("Prediction error:", e);
      setError(e.message || "An unexpected error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  const renderPredictedExpensesTable = () => {
    if (!predictionResult || !Array.isArray(predictionResult.predictedExpenses) || predictionResult.predictedExpenses.length === 0) {
      if (loading || error) return null; // Don't show "no expenses" if loading or error exists
      if (predictionResult && predictionResult.predictedExpenses?.length === 0) { // Explicitly check for empty array after successful prediction
        return <p className="text-muted-foreground text-center py-4">No specific expenses predicted for this period based on available data. Check the summary for more details.</p>;
      }
      return null;
    }
    
    const data = predictionResult.predictedExpenses;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Predicted Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                  <CategoryIcon category={item.category as ExpenseCategory} className="h-3.5 w-3.5" /> 
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">${item.predictedAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="h-6 w-6 text-primary" />
          AI Expense Forecaster
        </CardTitle>
        <CardDescription>
          Let AI predict your upcoming expenses based on your historical data and see the potential impact on your balance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next week">Next Week</SelectItem>
              <SelectItem value="next month">Next Month</SelectItem>
              <SelectItem value="next quarter">Next Quarter</SelectItem>
              <SelectItem value="next 6 months">Next 6 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handlePredictExpenses} disabled={loading || expenses.length === 0} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Expenses"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {predictionResult && (
          <div className="space-y-4 pt-4">
            <Alert variant="default" className="bg-primary/10 border-primary/50">
                <AlertTitle className="text-primary font-semibold">Prediction Summary for {period}</AlertTitle>
                <AlertDescription className="text-foreground/90">
                    {predictionResult.summary}
                </AlertDescription>
            </Alert>
            
            {predictionResult.predictedExpenses.length > 0 && (
              <>
                <h4 className="font-semibold text-lg">Detailed Predicted Expenses:</h4>
                {renderPredictedExpensesTable()}
              </>
            )}

            <Alert variant="default" className="bg-accent/10 border-accent/50 mt-6">
              <Info className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent-foreground font-semibold">Balance Impact Preview</AlertTitle>
              <AlertDescription className="text-accent-foreground/90 space-y-1">
                <p>Current Balance: <span className="font-semibold">${currentBalance.toFixed(2)}</span></p>
                <p>Total Predicted Expenses ({period}): <span className="font-semibold">${totalPredictedAmount.toFixed(2)}</span></p>
                <p className="border-t pt-1 mt-1">Estimated Balance After Deductions: <span className="font-bold text-lg">${(currentBalance - totalPredictedAmount).toFixed(2)}</span></p>
                {(currentBalance - totalPredictedAmount) < 0 && 
                  <p className="text-destructive font-semibold">Warning: Predicted expenses may exceed your current balance.</p>
                }
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      {expenses.length < 3 && expenses.length > 0 && (
         <CardFooter>
            <p className="text-sm text-muted-foreground">Add at least 3 expenses for more accurate predictions.</p>
         </CardFooter>
      )}
       {expenses.length === 0 && (
         <CardFooter>
            <p className="text-sm text-muted-foreground">Add some expenses first to enable predictions.</p>
         </CardFooter>
      )}
    </Card>
  );
}
