
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useExpenses } from "@/context/expense-context";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Filter out 'Funds Added' for expense categories
const availableExpenseCategories = EXPENSE_CATEGORIES.filter(
  (cat) => cat !== 'Funds Added'
) as [Exclude<ExpenseCategory, 'Funds Added'>, ...Exclude<ExpenseCategory, 'Funds Added'>[]];


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Expense name must be at least 2 characters.",
  }).max(100, {
    message: "Expense name must not exceed 100 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  category: z.enum(availableExpenseCategories, { // Use filtered categories
    errorMap: () => ({ message: "Please select a valid expense category." }),
  }),
  date: z.date({
    required_error: "A date for the expense is required.",
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters.",
  }).optional(),
});

export function ExpenseForm() {
  const { addExpense } = useExpenses();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      category: undefined,
      date: new Date(),
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // The addExpense function in context will handle adding the 'type: expense'
    addExpense({
      ...values,
      date: format(values.date, "yyyy-MM-dd"), // Format date to string
      // Ensure the category is correctly typed if needed by addExpense signature
      category: values.category as Exclude<ExpenseCategory, 'Funds Added'>,
    });
    toast({
      title: "Expense Added",
      description: `"${values.name}" (Rp ${values.amount.toFixed(0)}) has been successfully added and balance updated.`,
      variant: "default",
    });
    form.reset();
    router.push("/");
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Expense</CardTitle>
        <CardDescription>Fill in the details of your expense below. The amount will be deducted from your current balance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee, Monthly Rent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="0" {...field} 
                       className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an expense category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableExpenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                   <Controller
                      name="date"
                      control={form.control}
                      render={({ field: controllerField }) => (
                        <DatePicker
                          value={controllerField.value}
                          onChange={controllerField.onChange}
                          className="w-full"
                        />
                      )}
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about the expense..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">Add Expense</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

