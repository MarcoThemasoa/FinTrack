import type { LucideIcon } from 'lucide-react';
import { ShoppingCart, Home, Zap, Car, Utensils, Tv, HeartPulse, Shirt, GraduationCap, Plane, UserCircle, Gift, Repeat, MoreHorizontal, PiggyBank } from 'lucide-react';
import type { ExpenseCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

export const categoryIcons: Record<ExpenseCategory, LucideIcon> = {
  'Groceries': ShoppingCart,
  'Housing': Home,
  'Utilities': Zap,
  'Transport': Car,
  'Food & Dining': Utensils,
  'Entertainment': Tv,
  'Healthcare': HeartPulse,
  'Shopping': Shirt,
  'Education': GraduationCap,
  'Travel': Plane,
  'Personal Care': UserCircle, // Changed from PersonStanding as it's more common for profile/personal
  'Gifts & Donations': Gift,
  'Subscriptions': Repeat,
  'Other': MoreHorizontal,
};

export const getDefaultCategoryIcon = (): LucideIcon => PiggyBank; // Fallback icon

export const CategoryIcon = ({ category, className }: { category: ExpenseCategory; className?: string }) => {
  const IconComponent = categoryIcons[category] || getDefaultCategoryIcon();
  return <IconComponent className={cn("h-5 w-5", className)} />;
};

// Helper function to get the icon component directly if needed
export const getCategoryIconComponent = (category: ExpenseCategory): LucideIcon => {
    return categoryIcons[category] || getDefaultCategoryIcon();
};
