'use client';

import React from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useJournals } from '../../hooks/useJournals';
import { AdminJournal } from '../../types';
import { BookOpen, Plus, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function JournalsPage() {
  const { journals, loading, toggleJournalMode } = useJournals();

  const columns = [
    {
      header: 'Journal Title & ISSN',
      cell: (j: AdminJournal) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            {j.title}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            ISSN: {j.issn} • eISSN: {j.eIssn}
          </div>
        </div>
      ),
    },
    {
      header: 'Operating Mode',
      cell: (j: AdminJournal) => <StatusBadge status={j.mode} />,
    },
    {
      header: 'Submissions / Published',
      cell: (j: AdminJournal) => (
        <div className="font-mono text-xs">
          <span className="text-blue-500 font-bold">{j.totalSubmissions}</span> /{' '}
          <span className="text-emerald-500 font-bold">{j.publishedCount}</span>
        </div>
      ),
    },
    {
      header: 'APC Fee',
      cell: (j: AdminJournal) => (
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          {j.apcPriceUsd > 0 ? formatCurrency(j.apcPriceUsd) : 'Waiver / Free'}
        </span>
      ),
    },
    {
      header: 'Mode Override',
      cell: (j: AdminJournal) => (
        <button
          onClick={() => toggleJournalMode(j.id)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5"
        >
          {j.mode === 'PUBLISHING_MODE' ? (
            <>
              <ToggleRight className="w-4 h-4 text-emerald-400" /> Switch to Preparation
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4 text-slate-400" /> Enable Press Publishing
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" /> Journal & Press Operations Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Manage journal onboarding, APC rates, and enforce regional Preparation vs. Press Publishing modes.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Journal
        </button>
      </div>

      <DataTable columns={columns} data={journals} />
    </div>
  );
}
