
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExpenses } from "@/context/expense-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters."
  }).max(100, { // Matched max length with expense name for consistency
    message: "Description must not exceed 100 characters.",
  }).optional(), // Optional, but if provided, has min length
});

export function AddFundsForm() {
  const { addFunds } = useExpenses();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addFunds(values.amount, values.description || "Funds Added"); // Pass description to context
    toast({
      title: "Funds Added",
      description: `Rp ${values.amount.toFixed(0)} has been successfully added to your balance.`,
      variant: "default",
    });
    form.reset();
    router.push("/");
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Add Funds to Balance</CardTitle>
        <CardDescription>Enter the amount and an optional description for the funds you are adding. This will be recorded as an income transaction.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to Add</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" placeholder="0" {...field} 
                     className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Source</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Monthly Salary, Gift Received, Project Payment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">Add Funds</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

