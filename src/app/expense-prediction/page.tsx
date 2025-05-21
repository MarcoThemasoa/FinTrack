
import { ExpensePrediction } from "@/components/core/expense-prediction";

export default function ExpensePredictionPage() {
  return (
    <div className="container mx-auto py-8">
      {/* The ExpensePrediction component is already a Card, so we render it directly.
          It includes its own title and description suitable for a page context. 
      */}
      <ExpensePrediction />
    </div>
  );
}
