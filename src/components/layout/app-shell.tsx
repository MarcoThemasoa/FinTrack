"use client";

import type { ReactNode } from 'react';
import { PiggyBank } from 'lucide-react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppSidebarNav } from './app-sidebar-nav';
import { AppHeader } from './app-header';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: ReactNode }) {
  const { open, setOpen } = useSidebar();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar
        variant="sidebar" // "sidebar", "floating", "inset"
        collapsible="icon" // "offcanvas", "icon", "none"
        side="left"
        className="border-r bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <PiggyBank className="h-8 w-8 text-sidebar-primary-foreground" />
            <span className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              FinTrack
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <AppSidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
          {/* Footer content if any, e.g., settings, logout */}
          <p className="text-xs text-sidebar-foreground/70 text-center">© {new Date().getFullYear()} FinTrack</p>
        </SidebarFooter>
      </Sidebar>

      <div className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-[margin-left] duration-300 ease-in-out",
          // Adjust margin based on sidebar state for desktop
          "md:ml-[var(--sidebar-width)] group-data-[sidebar-state=collapsed]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]"
        )}>
        <AppHeader />
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
