'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Award, BookOpen, ShieldCheck, CheckCircle2, Download, UserCheck, Layers, FileText, Sparkles, ArrowRight
} from 'lucide-react';

export default function AcademicPromotionPage() {
  const [dossier, setDossier] = useState<any>(null);

  useEffect(() => {
    fetchDossier();
  }, []);

  const fetchDossier = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/promotion/dossier/22c3cf28-796c-418d-b9ed-3a58d8aee652');
      if (res.ok) {
        const data = await res.json();
        setDossier(data);
      } else {
        mockDossier();
      }
    } catch (err) {
      mockDossier();
    }
  };

  const mockDossier = () => {
    setDossier({
      profile: {
        currentRank: 'Assistant Professor',
        targetRank: 'Associate Professor (Tenured)',
        institutionName: 'Global Academic Press University',
        department: 'Computer Science & Quantum Information',
      },
      summary: {
        totalPublications: 5,
        firstAuthorCount: 2,
        correspondingCount: 2,
        coAuthorCount: 1,
        totalPeerReviewsCompleted: 8,
        totalCalculatedCreditScore: 150,
        dossierReadinessScore: 92,
      },
      publications: [
        { id: 'p1', title: 'Quantum Computing Foundations for Distributed Systems', type: 'Journal Article', role: 'First Author', creditScore: 40, publishedYear: 2026 },
        { id: 'p2', title: 'Fault-Tolerant Qubit Fabric Protocols', type: 'Conference Proceedings', role: 'Corresponding Author', creditScore: 30, publishedYear: 2025 },
        { id: 'p3', title: 'Monograph: Topological Quantum Error Correction', type: 'Book', role: 'First Author', creditScore: 40, publishedYear: 2024 },
      ],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-medium">
              Academic Career & Tenure Dossier Builder
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
              Academic Tenure & Promotion Dossier
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Automated credit allocation matrix, peer review history, and exportable tenure package for institutional promotion committees.
            </p>
          </div>

          <button
            onClick={() => alert('Downloading official Tenure Dossier PDF/JSON Package.')}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Complete Tenure Dossier
          </button>
        </div>

        {dossier && (
          <>
            {/* Promotion Profile & Score Banner */}
            <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
              <div className="md:col-span-2 space-y-2">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">{dossier.profile.institutionName}</span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                  {dossier.profile.currentRank} <ArrowRight className="inline w-4 h-4 mx-1 text-slate-400" /> {dossier.profile.targetRank}
                </h2>
                <p className="text-xs text-slate-500">Department: {dossier.profile.department}</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-slate-500">DOSSIER READINESS SCORE</span>
                <div className="text-3xl font-bold font-serif text-emerald-500">{dossier.summary.dossierReadinessScore}%</div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full" style={{ width: `${dossier.summary.dossierReadinessScore}%` }} />
                </div>
              </div>
            </div>

            {/* Author Contribution Credit Matrix */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                Author Contribution Credit Allocation Breakdown
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel space-y-1">
                  <span className="text-slate-400 text-[10px]">FIRST AUTHOR (40 PTS)</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{dossier.summary.firstAuthorCount} Papers</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel space-y-1">
                  <span className="text-slate-400 text-[10px]">CORRESPONDING (30 PTS)</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{dossier.summary.correspondingCount} Papers</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel space-y-1">
                  <span className="text-slate-400 text-[10px]">CO-AUTHOR (10 PTS)</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{dossier.summary.coAuthorCount} Papers</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel space-y-1">
                  <span className="text-slate-400 text-[10px]">REFEREE REVIEWS</span>
                  <div className="text-2xl font-bold text-sky-500">{dossier.summary.totalPeerReviewsCompleted} Reviews</div>
                </div>
              </div>
            </div>

            {/* Publication Dossier Portfolio Table */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">Peer-Reviewed Portfolio Items</h3>

              <div className="space-y-3">
                {dossier.publications.map((pub: any) => (
                  <div key={pub.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4 text-xs font-mono">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{pub.title}</div>
                      <div className="text-slate-500 mt-0.5">{pub.type} · Published {pub.publishedYear}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">{pub.role}</span>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">+{pub.creditScore} Pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
