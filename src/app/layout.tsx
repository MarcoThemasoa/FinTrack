import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import based on original
import './globals.css';
import { ExpenseProvider } from '@/context/expense-context';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FinTrack - Personal Finance Tracker',
  description: 'Track and manage your finances effortlessly with FinTrack. Input expenses, generate reports, and predict upcoming costs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <ExpenseProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
          </ExpenseProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
