'use client';

import React from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import { AiAssistantPanel } from '@/components/ai/AiAssistantPanel';
import { Sparkles, Cpu, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AiWorkspacePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              AI Publication & Research Assistant
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold academic-badge mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Phase 4 — AI Assistant & Guardrails Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
            Academic Proofreading & Research Assistant
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Enhance clarity, structure literature, identify research gaps, and format citations with strict authorship preservation and zero source fabrication.
          </p>
        </div>

        <AiAssistantPanel initialText="Quantum entanglement represents a fundamental resource for next-generation distributed quantum computing architectures. In this manuscript, we present a novel fault-tolerant qubit fabric protocol capable of maintaining coherence across non-local quantum nodes." />
      </main>
    </div>
  );
}
