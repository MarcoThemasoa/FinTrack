
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, ListChecks, DollarSign } from 'lucide-react'; // Added DollarSign
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-expense', label: 'Add Expense', icon: PlusCircle },
  { href: '/add-funds', label: 'Add Funds', icon: DollarSign }, // New item
  { href: '/reports', label: 'All Expenses', icon: ListChecks },
];

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "w-full justify-start"
                )}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <a> {/* <a> tag is needed when asChild is used with Link and SidebarMenuButton expects a button/a element */}
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
