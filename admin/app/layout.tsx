import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { AdminHeader } from '../components/layout/AdminHeader';

export const metadata: Metadata = {
  title: 'PUBLISHORA Super-Admin Console',
  description: 'Global Academic Press Administration & Operations Console',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
