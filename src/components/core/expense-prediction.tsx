"use client";

import React, { useState } from 'react';
import { useExpenses } from '@/context/expense-context';
import { predictExpenses } from '@/ai/flows/predict-upcoming-expenses'; // Ensure this path is correct
import type { PredictExpensesInput, PredictExpensesOutput } from '@/ai/flows/predict-upcoming-expenses';
import type { PredictedExpenseItem } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2 } from 'lucide-react';
import { CategoryIcon } from './category-icon';
import { Badge } from '../ui/badge';


export function ExpensePrediction() {
  const { expenses } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictExpensesOutput | null>(null);
  const [period, setPeriod] = useState<string>("next month");

  const handlePredictExpenses = async () => {
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    if (expenses.length < 3) { // Require some data for meaningful prediction
        setError("Not enough historical data. Please add at least 3 expenses for a better prediction.");
        setLoading(false);
        return;
    }

    const historicalDataForAI = expenses.map(exp => ({
      category: exp.category,
      amount: exp.amount,
      date: exp.date, // Assuming date is already YYYY-MM-DD
    }));

    const input: PredictExpensesInput = {
      historicalData: JSON.stringify(historicalDataForAI),
      period: period,
    };

    try {
      const result = await predictExpenses(input);
      // Attempt to parse predictedExpenses if it's a string
      let parsedResult = {...result};
      if (typeof result.predictedExpenses === 'string') {
        try {
          const parsedExpenses: PredictedExpenseItem[] = JSON.parse(result.predictedExpenses);
          // Validate structure
          if (Array.isArray(parsedExpenses) && parsedExpenses.every(item => 'category' in item && 'predictedAmount' in item && 'period' in item)) {
             parsedResult.predictedExpenses = parsedExpenses as any; // Cast after validation
          } else {
            console.warn("Parsed predictedExpenses is not in the expected format. Using raw string.");
          }
        } catch (parseError) {
          console.error("Failed to parse predictedExpenses JSON string:", parseError);
          // Keep result.predictedExpenses as string if parsing fails
        }
      }
      setPredictionResult(parsedResult);
    } catch (e: any) {
      console.error("Prediction error:", e);
      setError(e.message || "An unexpected error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  const renderPredictedExpenses = () => {
    if (!predictionResult || !predictionResult.predictedExpenses) return null;

    // Check if predictedExpenses is an array (parsed successfully) or string
    if (Array.isArray(predictionResult.predictedExpenses)) {
      const data = predictionResult.predictedExpenses as PredictedExpenseItem[];
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
                    <CategoryIcon category={item.category as any} className="h-3.5 w-3.5" /> 
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">${item.predictedAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    } else if (typeof predictionResult.predictedExpenses === 'string') {
      // Fallback: Display raw JSON string if it wasn't parsed or was not an array
      return (
        <div className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
          <p className="font-semibold mb-2">Raw Prediction Data:</p>
          <pre>{predictionResult.predictedExpenses}</pre>
        </div>
      );
    }
    return null;
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Expense Prediction
        </CardTitle>
        <CardDescription>
          Let AI predict your upcoming expenses based on your historical data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Alert variant="default" className="bg-accent/20 border-accent">
                <AlertTitle className="text-accent-foreground font-semibold">Prediction Summary</AlertTitle>
                <AlertDescription className="text-accent-foreground/90">
                    {predictionResult.summary}
                </AlertDescription>
            </Alert>
            
            <h4 className="font-semibold text-lg">Predicted Expenses for {period}:</h4>
            {renderPredictedExpenses()}
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
