import { ExpenseList } from "@/components/core/expense-list";

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <ExpenseList 
        showTitle={true} 
        title="All Expenses" 
        description="A comprehensive list of all your recorded expenses."
        fullHeight={true} 
      />
    </div>
  );
}
