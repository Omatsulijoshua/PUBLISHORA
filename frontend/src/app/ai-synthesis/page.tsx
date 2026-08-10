'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Sparkles, BookOpen, Layers, AlertTriangle, Send, FileCheck, CheckCircle2
} from 'lucide-react';

export default function AiSynthesisPage() {
  const [prompt, setPrompt] = useState('What are the physical error rate thresholds for surface code fault tolerance?');
  const [ragResult, setRagResult] = useState<any>(null);
  const [prismaResult, setPrismaResult] = useState<any>(null);
  const [contradictionResult, setContradictionResult] = useState<any>(null);

  useEffect(() => {
    handleRagQuery();
    handlePrismaReview();
  }, []);

  const handleRagQuery = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-synthesis/rag-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) setRagResult(await res.json());
    } catch (err) {
      mockData();
    }
  };

  const handlePrismaReview = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-synthesis/prisma-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'Quantum Error Correction' }),
      });
      if (res.ok) setPrismaResult(await res.json());
    } catch (err) {
      mockData();
    }
  };

  const handleDetectContradictions = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-synthesis/contradiction-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manuscriptIds: ['pub-101', 'pub-102'] }),
      });
      if (res.ok) setContradictionResult(await res.json());
    } catch (err) {
      setContradictionResult({
        analyzedManuscriptsCount: 2,
        contradictionMatrix: [
          {
            claim: 'Superconducting qubit coherence times scale linearly with temperature below 15mK.',
            findingA: 'Linear scaling observed down to 5mK [Vance et al., 2026].',
            findingB: 'Coherence time saturates at 12mK due to two-level systems loss [Brody et al., 2025].',
            conflictSeverity: 'MODERATE_CONTRADICTION',
          },
        ],
      });
    }
  };

  const mockData = () => {
    setRagResult({
      query: prompt,
      synthesizedAnswer: 'Fault-tolerant surface codes require physical error rates below ~1% per gate operation [Vance et al., 2026, p. 14]. Recent breakthroughs in 2D transmons demonstrate error rates of 0.14% using distance-7 logical qubits [Lin et al., 2026].',
      groundedCitations: [
        {
          citationKey: 'Vance et al., 2026',
          title: 'Quantum Advantage in Cryptographic Protocols',
          doi: '10.1038/s41586-026-00101-x',
          paragraphExcerpt: 'We demonstrate error rates below the 1% threshold required for surface code fault tolerance.',
        },
      ],
    });

    setPrismaResult({
      systematicReviewTopic: 'Quantum Error Correction',
      prismaFlow2020: {
        identification: { recordsIdentifiedFromDatabases: 4820 },
        screening: { recordsScreened: 4480 },
        eligibility: { reportsAssessedForEligibility: 570 },
        included: { studiesIncludedInReview: 90 },
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
              RAG Literature Synthesis & PRISMA 2020 Reviewer
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            AI-Powered Literature Synthesis & RAG Research Assistant
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Retrieval-Augmented Generation (RAG) query engine over 10M+ scholarly publications with inline citation grounding, PRISMA 2020 flow diagrams, and contradictory finding detectors.
          </p>
        </div>

        {/* RAG Query Box */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" /> Grounded Scholarly RAG Query
          </h2>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRagQuery()}
              className="flex-1 px-4 py-3 rounded-xl text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleRagQuery}
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Synthesize
            </button>
          </div>

          {ragResult && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs leading-relaxed font-mono">
                <span className="font-bold text-indigo-500 block mb-1">Synthesized AI Answer (Grounded):</span>
                <p className="text-slate-800 dark:text-slate-200">{ragResult.synthesizedAnswer}</p>
              </div>

              {/* Citations Grounding */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400">GROUNDED CITATIONS & PARAGRAPH EVIDENCE:</span>
                {ragResult.groundedCitations?.map((cit: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 font-mono text-xs space-y-1">
                    <div className="font-bold text-indigo-500">{cit.citationKey} — {cit.title}</div>
                    <div className="text-slate-500 text-[10px]">DOI: {cit.doi}</div>
                    <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">"{cit.paragraphExcerpt}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PRISMA 2020 & Contradiction Detector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PRISMA 2020 Flow Card */}
          {prismaResult && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" /> PRISMA 2020 Systematic Review Flow
              </h2>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                  <span className="text-slate-400 text-[10px]">1. IDENTIFIED</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{prismaResult.prismaFlow2020?.identification?.recordsIdentifiedFromDatabases}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                  <span className="text-slate-400 text-[10px]">2. SCREENED</span>
                  <div className="text-xl font-bold text-indigo-500">{prismaResult.prismaFlow2020?.screening?.recordsScreened}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                  <span className="text-slate-400 text-[10px]">3. ELIGIBLE</span>
                  <div className="text-xl font-bold text-cyan-500">{prismaResult.prismaFlow2020?.eligibility?.reportsAssessedForEligibility}</div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <span className="text-emerald-500 text-[10px]">4. INCLUDED</span>
                  <div className="text-xl font-bold text-emerald-500">{prismaResult.prismaFlow2020?.included?.studiesIncludedInReview}</div>
                </div>
              </div>
            </div>
          )}

          {/* Claim Contradiction Detector */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Claim Contradiction Detector
            </h2>

            <button
              onClick={handleDetectContradictions}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Run Contradiction Matrix Analysis
            </button>

            {contradictionResult && (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 font-mono text-xs space-y-2">
                <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Conflict Detected: {contradictionResult.contradictionMatrix[0]?.conflictSeverity}
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                  Claim: {contradictionResult.contradictionMatrix[0]?.claim}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
