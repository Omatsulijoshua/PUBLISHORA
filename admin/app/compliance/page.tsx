'use client';

import React from 'react';
import { ShieldCheck, FileCheck, Lock, AlertTriangle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-500" /> Platform Compliance & SOC2 / GDPR Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
          Review immutable SOC2 audit logs, Plan S Rights Retention compliance, and GDPR data export requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-500" /> SOC2 Type II Immutable Audit Stream
          </h2>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            [2026-08-11 00:15:02 UTC] SUPER_ADMIN (Dr. Marcus Thorne) initialized regional mode audit. SHA-256 Digest: `9f8a...31b2`.
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-500" /> Plan S & cOAlition S Compliance
          </h2>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
            100% of open access publications feature CC-BY 4.0 licenses & zero embargo mandates.
          </div>
        </div>
      </div>
    </div>
  );
}
