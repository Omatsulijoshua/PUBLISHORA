import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'PUBLISHORA — Global Publishing & Manuscript Preparation Platform',
  description: 'Create. Prepare. Publish. Share. Everything you need to bring your work from your idea to publication worldwide.',
  keywords: ['publishing', 'manuscript preparation', 'academic papers', 'books', 'research papers', 'journals', 'theses', 'DOI', 'ISBN'],
  authors: [{ name: 'PUBLISHORA Press' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
