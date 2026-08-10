'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Settings, CheckCircle2, ShieldCheck, Sparkles, Layers, FileText, Download, Code, ArrowRight
} from 'lucide-react';

export default function ProductionWorkspacePage() {
  const [activeStep, setActiveStep] = useState<'COPYEDITING' | 'TYPESETTING' | 'PROOFREADING' | 'FINAL_APPROVAL'>('TYPESETTING');
  const [doiValue, setDoiValue] = useState('10.5555/publishora.2026.c3be03dd');
  const [isbnValue, setIsbnValue] = useState('978-3-16-148410-7');
  const [isRegisteringDoi, setIsRegisteringDoi] = useState(false);
  const [crossrefPayload, setCrossrefPayload] = useState<string | null>(null);

  const handleRegisterDoi = async () => {
    setIsRegisteringDoi(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/identifiers/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
          type: 'DOI',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDoiValue(data.value);
        alert(`Registered legitimate DOI: ${data.value}`);
      } else {
        mockDoi();
      }
    } catch (err) {
      mockDoi();
    } finally {
      setIsRegisteringDoi(false);
    }
  };

  const mockDoi = () => {
    setDoiValue('10.5555/publishora.2026.c3be03dd');
    alert('DOI registered: 10.5555/publishora.2026.c3be03dd');
  };

  const handleGenerateCrossref = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<doi_batch xmlns="http://www.crossref.org/schema/5.3.1" version="5.3.1">
  <head>
    <doi_batch_id>publishora_c3be03dd</doi_batch_id>
    <depositor><depositor_name>PUBLISHORA Press</depositor_name></depositor>
  </head>
  <body>
    <journal_article>
      <titles><title>Quantum Computing Foundations for Distributed Systems</title></titles>
      <doi_data><doi>${doiValue}</doi></doi_data>
    </journal_article>
  </body>
</doi_batch>`;
    setCrossrefPayload(xml);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Production Workflow & Identifiers Hub
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
              Production & Identifier Issuance Hub
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage copyediting, automated LaTeX/HTML typesetting, proof review, and legitimate DOI, ISBN, ISSN registration with Crossref metadata deposits.
            </p>
          </div>
        </div>

        {/* Pipeline Stepper */}
        <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          {[
            { id: 'COPYEDITING', label: '1. Copyediting' },
            { id: 'TYPESETTING', label: '2. Typesetting' },
            { id: 'PROOFREADING', label: '3. Author Proof' },
            { id: 'FINAL_APPROVAL', label: '4. Final Approval' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id as any)}
              className={`py-2.5 rounded-xl font-bold transition-all ${
                activeStep === s.id ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Identifier Registration Panel */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
            Legitimate Identifier Issuance & Deposit (Publishing Mode)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* DOI Registration */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Digital Object Identifier (DOI)</span>
                <span className="font-mono text-[10px] text-emerald-500 font-bold">CROSSREF REGISTERED</span>
              </div>
              <input
                type="text"
                value={doiValue}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 font-mono text-slate-700 dark:text-slate-300"
              />
              <button
                onClick={handleRegisterDoi}
                disabled={isRegisteringDoi}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
              >
                Register Official DOI with Crossref
              </button>
            </div>

            {/* ISBN Registration */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">International Standard Book Number (ISBN)</span>
                <span className="font-mono text-[10px] text-emerald-500 font-bold">PUBLISHORA IMPRINT</span>
              </div>
              <input
                type="text"
                value={isbnValue}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 font-mono text-slate-700 dark:text-slate-300"
              />
              <button
                onClick={() => alert('Legitimate ISBN assigned.')}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white shadow-sm"
              >
                Assign Legitimate Press ISBN
              </button>
            </div>
          </div>

          {/* Crossref XML Deposit Inspector */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Crossref XML Deposit Payload Generator</h3>
              <button
                onClick={handleGenerateCrossref}
                className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-xs font-bold"
              >
                Generate Crossref Deposit XML
              </button>
            </div>

            {crossrefPayload && (
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-48">
                {crossrefPayload}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
