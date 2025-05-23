
import { ExpenseList } from "@/components/core/expense-list";
import { ExpensePrediction } from "@/components/core/expense-prediction";
import { CurrentBalanceCard } from "@/components/core/current-balance-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to FinTrack!</CardTitle>
          <CardDescription>Your personal finance dashboard. Manage your transactions, view reports, and get smart predictions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Get started by <a href="/add-expense" className="text-primary hover:underline font-medium">adding a new expense</a> or <a href="/add-funds" className="text-primary hover:underline font-medium">adding funds</a>. Explore your financial overview below.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* ExpenseList now shows all transactions by default */}
          <ExpenseList limit={5} title="Recent Transactions" description="A quick look at your latest financial activities." />
        </div>
        <div className="lg:col-span-1 space-y-8">
         <CurrentBalanceCard />
         <ExpensePrediction />
        </div>
      </div>
      
    </div>
  );
}
