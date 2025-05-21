
import { ExpenseList } from "@/components/core/expense-list";

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <ExpenseList 
        showTitle={true} 
        title="All Transactions" // Changed title
        description="A comprehensive list of all your recorded financial transactions (expenses and income)." // Updated description
        fullHeight={true} 
      />
    </div>
  );
}
