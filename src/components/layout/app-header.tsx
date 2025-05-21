"use client";

import { PiggyBank } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <SidebarTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Toggle sidebar">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </SidebarTrigger>
        </div>
         <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <PiggyBank className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">FinTrack</span>
        </Link>
      </div>
      {/* Future: User menu, notifications, etc. */}
    </header>
  );
}
