
import { ExpenseList } from "@/components/core/expense-list";

export default function AllTransactionsPage() {
  return (
    <div className="container mx-auto py-8">
      <ExpenseList 
        showTitle={true}
        title="All Transactions"
        description="View and filter all your recorded financial activities."
        fullHeight={true} 
        showFilters={true} 
      />
    </div>
  );
}
