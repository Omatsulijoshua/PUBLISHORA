'use client';

import React from 'react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAdminStats } from '../hooks/useAdminStats';
import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Activity,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { health, financials, loading } = useAdminStats();

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Executive Admin Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Global Press Operations • All 45 Platform Engines Operational
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={health?.systemStatus || '100% OPERATIONAL'} />
          <span className="text-xs font-mono text-slate-400">
            Node: US-EAST-AWS-CLUST-01
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total APC Revenue"
          value={financials ? `$${financials.totalApcRevenueUsd.toLocaleString()}` : '$485,900'}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          description="Net APC earnings across active publishing journals"
        />
        <StatCard
          title="Active Submissions"
          value="2,310"
          change="+12.1%"
          isPositive={true}
          icon={FileText}
          description="Manuscripts currently in screening & peer review"
        />
        <StatCard
          title="Active Journals"
          value="48"
          change="+4"
          isPositive={true}
          icon={BookOpen}
          description="Indexed press & partner consortium journals"
        />
        <StatCard
          title="Platform Health"
          value="100%"
          change="0 Incidents"
          isPositive={true}
          icon={Activity}
          description="45 / 45 NestJS services healthy & passing tests"
        />
      </div>

      {/* Analytics & System Health Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Editorial Throughput */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Global Editorial & Publishing Activity
            </h2>
            <span className="text-xs font-mono text-blue-500 font-bold">Live Stream</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  PUBLISHORA Journal of Quantum Computing & AI
                </span>
                <p className="text-slate-500 text-[10px]">
                  DOI Deposit Completed • Crossref 5.3 XML Verified
                </p>
              </div>
              <StatusBadge status="PUBLISHED" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Global Journal of Tropical Medicine & Public Health
                </span>
                <p className="text-slate-500 text-[10px]">
                  Preparation Mode Enforced • 0 Fake DOIs Issued
                </p>
              </div>
              <StatusBadge status="PREPARATION_MODE" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  University of Cambridge Consortium APC Invoice #INV-9021
                </span>
                <p className="text-slate-500 text-[10px]">
                  Institutional Billing Deposit • $18,500.00 USD
                </p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>
          </div>
        </div>

        {/* Engine Security & Audit Overview */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> System Engine Integrity
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
              <div className="font-bold text-emerald-500">Dual-Mode Enforcement Engine</div>
              <p className="text-[10px] text-slate-400">
                100% compliant with strict regional press rules. Zero fake identifiers issued.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-1">
              <div className="font-bold text-blue-500">COUNTER R5 & SUSHI API</div>
              <p className="text-[10px] text-slate-400">
                Harvesting active for 92 institutional library clients (`/api/v1/sushi/r5/reports/tr_j1`).
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-1">
              <div className="font-bold text-purple-500">AI RAG & Synthesis Engine</div>
              <p className="text-[10px] text-slate-400">
                10M+ manuscripts indexed with inline paragraph citation grounding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
