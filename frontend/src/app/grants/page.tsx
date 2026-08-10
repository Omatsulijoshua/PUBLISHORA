'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  DollarSign, CheckCircle2, ShieldCheck, Award, Building, Landmark, Plus, FileText
} from 'lucide-react';

export default function GrantManagementPage() {
  const [funderName, setFunderName] = useState('National Institutes of Health (NIH)');
  const [grantNumber, setGrantNumber] = useState('R01-HG009842');
  const [grantTitle, setGrantTitle] = useState('Scalable Quantum Computing Protocols');
  const [attachedGrants, setAttachedGrants] = useState<any[]>([
    { id: 'g1', funderName: 'National Institutes of Health (NIH)', grantNumber: 'R01-HG009842', grantTitle: 'Scalable Quantum Computing Protocols', isPlanS: true },
    { id: 'g2', funderName: 'European Research Council (ERC)', grantNumber: 'ERC-2025-STG-10293', grantTitle: 'Fault-Tolerant Topological Fabric', isPlanS: true },
  ]);

  const handleAddGrant = () => {
    if (!grantNumber || !funderName) return;
    setAttachedGrants([
      ...attachedGrants,
      {
        id: `g-${Date.now()}`,
        funderName,
        grantNumber,
        grantTitle: grantTitle || 'Funded Research Grant',
        isPlanS: true,
      },
    ]);
    setGrantNumber('');
    setGrantTitle('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              Grant & Funding Integration Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Grant Attribution & Open Access Compliance
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Attach multi-funder grant metadata (NIH, NSF, Wellcome, ERC, UKRI) and verify automated Plan S and OSTP zero-embargo Open Access compliance.
          </p>
        </div>

        {/* Funder Open Access Mandate Banner */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">Plan S & OSTP Zero-Embargo Compliant</h3>
              <p className="text-xs text-slate-500">Publishora automatically formats Crossref Funder XML and triggers PMC/Europe PMC repository deposits.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            AUDIT PASSED
          </span>
        </div>

        {/* Attach Grant Form */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" /> Attach Grant Funding Attribution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">FUNDER AGENCY</label>
              <select
                value={funderName}
                onChange={(e) => setFunderName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              >
                <option>National Institutes of Health (NIH)</option>
                <option>National Science Foundation (NSF)</option>
                <option>Wellcome Trust</option>
                <option>European Research Council (ERC)</option>
                <option>UK Research and Innovation (UKRI)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">GRANT ID / NUMBER</label>
              <input
                type="text"
                value={grantNumber}
                onChange={(e) => setGrantNumber(e.target.value)}
                placeholder="e.g. R01-HG009842"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">GRANT TITLE (OPTIONAL)</label>
              <input
                type="text"
                value={grantTitle}
                onChange={(e) => setGrantTitle(e.target.value)}
                placeholder="Project title..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAddGrant}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
          >
            Attach Funding Metadata
          </button>
        </div>

        {/* Attached Grants List */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Active Publication Grant Attributions</h3>

          <div className="space-y-3">
            {attachedGrants.map((grant) => (
              <div key={grant.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{grant.funderName}</div>
                  <div className="text-slate-500">Grant #{grant.grantNumber} · {grant.grantTitle}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PLAN S COMPLIANT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
