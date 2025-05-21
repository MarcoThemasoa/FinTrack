
"use client";

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/context/expense-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CurrentBalanceCard() {
  const { currentBalance, updateCurrentBalance } = useExpenses();
  const [inputValue, setInputValue] = useState<string>(currentBalance.toFixed(0));
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isEditing) {
      setInputValue(currentBalance.toFixed(0));
    }
  }, [currentBalance, isEditing]);

  const handleUpdateBalance = () => {
    const newBalance = parseFloat(inputValue);
    if (!isNaN(newBalance) && newBalance >= 0) {
      updateCurrentBalance(newBalance);
      toast({
        title: "Balance Updated",
        description: `Your current balance is now Rp ${newBalance.toFixed(0)}.`,
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid non-negative number for the balance.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(currentBalance.toFixed(0)); // Reset to current balance
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          Current Balance
        </CardTitle>
        <CardDescription>View and update your current account balance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">Rp {currentBalance.toFixed(0)}</p>
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              type="number"
              step="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter new balance"
              className="text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleUpdateBalance}>Save Balance</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

