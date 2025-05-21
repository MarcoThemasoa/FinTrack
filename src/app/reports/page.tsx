
import { ExpenseList } from "@/components/core/expense-list";

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <ExpenseList 
        showTitle={true} 
        title="All Transactions" 
        description="A comprehensive list of all your recorded financial transactions. Use filters to narrow down by month and year." // Updated description
        fullHeight={true} 
        showFilters={true} // Enable filters for this page
      />
    </div>
  );
}
