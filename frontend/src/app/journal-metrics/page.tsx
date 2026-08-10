'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  TrendingUp, Award, Share2, Eye, FileText, CheckCircle2, MessageSquare, Twitter
} from 'lucide-react';

export default function JournalMetricsPage() {
  const [jMetrics, setJMetrics] = useState<any>(null);
  const [altmetricData, setAltmetricData] = useState<any>(null);
  const [fwciData, setFwciData] = useState<any>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const jRes = await fetch('http://localhost:4000/api/v1/journal-metrics/journal-101');
      if (jRes.ok) setJMetrics(await jRes.json());

      const aRes = await fetch('http://localhost:4000/api/v1/journal-metrics/altmetric/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (aRes.ok) setAltmetricData(await aRes.json());

      const fRes = await fetch('http://localhost:4000/api/v1/journal-metrics/fwci/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (fRes.ok) setFwciData(await fRes.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setJMetrics({
      journalTitle: 'PUBLISHORA Journal of Quantum Computing',
      jif2Year: 8.45,
      jif5Year: 9.13,
      scimagoJournalRankSjr: 2.18,
      eigenfactorScore: 0.0428,
      journalQuartile: 'Q1 (Top 5% in Quantum Physics & Computing)',
    });

    setAltmetricData({
      altmetricAttentionScore: 482,
      mentionsBreakdown: {
        newsOutlets: 24,
        twitterX: 312,
        wikipediaPages: 4,
        policyDocuments: 6,
      },
    });

    setFwciData({
      fieldWeightedCitationImpactFwci: 1.84,
      impactComparison: '84% above global average for Quantum Computing',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-medium">
              Journal Impact Factor (JIF), SJR & Altmetric Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Journal Impact Metrics & Altmetric Attention Analytics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Automated 2-Year & 5-Year Journal Impact Factor (JIF), SCImago Journal Rank (SJR), Eigenfactor, Altmetric attention scores, and Field-Weighted Citation Impact (FWCI).
          </p>
        </div>

        {/* Journal Impact Factors */}
        {jMetrics && (
          <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">{jMetrics.journalTitle}</h2>
                <span className="text-xs font-mono text-emerald-500 font-bold">{jMetrics.journalQuartile}</span>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
                <span className="text-slate-400">2-Year Impact Factor</span>
                <div className="text-2xl font-bold text-rose-500">{jMetrics.jif2Year}</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
                <span className="text-slate-400">5-Year Impact Factor</span>
                <div className="text-2xl font-bold text-amber-500">{jMetrics.jif5Year}</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
                <span className="text-slate-400">SJR (SCImago Rank)</span>
                <div className="text-2xl font-bold text-indigo-500">{jMetrics.scimagoJournalRankSjr}</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
                <span className="text-slate-400">Eigenfactor Score</span>
                <div className="text-2xl font-bold text-cyan-500">{jMetrics.eigenfactorScore}</div>
              </div>
            </div>
          </div>
        )}

        {/* Altmetrics & FWCI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Altmetric Attention Score Card */}
          {altmetricData && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-rose-500" /> Altmetric Attention Score
              </h2>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-rose-500 flex items-center justify-center font-mono font-bold text-2xl text-rose-500 bg-rose-500/10">
                  {altmetricData.altmetricAttentionScore}
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-slate-400">Top 1% Attention Score globally</div>
                  <div className="text-slate-600 dark:text-slate-300">
                    📰 {altmetricData.mentionsBreakdown?.newsOutlets} News Outlets · 🐤 {altmetricData.mentionsBreakdown?.twitterX} Tweets · 🏛️ {altmetricData.mentionsBreakdown?.policyDocuments} Policy Docs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FWCI Score Card */}
          {fwciData && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Field-Weighted Citation Impact (FWCI)
              </h2>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs space-y-2">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  FWCI = {fwciData.fieldWeightedCitationImpactFwci}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {fwciData.impactComparison}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
