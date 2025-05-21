import type { LucideIcon } from 'lucide-react';
import { ShoppingCart, Home, Zap, Car, Utensils, Tv, HeartPulse, Shirt, GraduationCap, Plane, UserCircle, Gift, Repeat, MoreHorizontal, PiggyBank, Landmark } from 'lucide-react';
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
  'Personal Care': UserCircle,
  'Gifts & Donations': Gift,
  'Subscriptions': Repeat,
  'Funds Added': Landmark, // Using Landmark for Funds Added, PiggyBank is app icon
  'Other': MoreHorizontal,
};

export const getDefaultCategoryIcon = (): LucideIcon => PiggyBank; // Fallback icon remains PiggyBank

export const CategoryIcon = ({ category, className }: { category: ExpenseCategory; className?: string }) => {
  const IconComponent = categoryIcons[category] || getDefaultCategoryIcon();
  return <IconComponent className={cn("h-5 w-5", className)} />;
};

export const getCategoryIconComponent = (category: ExpenseCategory): LucideIcon => {
    return categoryIcons[category] || getDefaultCategoryIcon();
};
