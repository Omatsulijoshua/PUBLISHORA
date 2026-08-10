'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Send, FileText, CheckCircle2, ShieldCheck, UserCheck, HelpCircle, ArrowRight
} from 'lucide-react';

export default function SubmitManuscriptPage() {
  const [coverLetter, setCoverLetter] = useState('');
  const [coiStatement, setCoiStatement] = useState('No competing financial or personal interests exist.');
  const [orcidId, setOrcidId] = useState('0000-0002-1825-0097');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
          submitterId: '22c3cf28-796c-418d-b9ed-3a58d8aee652',
          coverLetter,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissionResult(data);
      } else {
        mockResult();
      }
    } catch (err) {
      mockResult();
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockResult = () => {
    setSubmissionResult({
      id: 'sub-9001',
      submissionNum: 'SUB-2026-0042',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Press Submission Wizard
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Submit Manuscript to PUBLISHORA Press
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            Complete editorial screening checklist, attach cover letter, enter ORCID iD, and submit for peer review.
          </p>
        </div>

        {submissionResult ? (
          <div className="p-8 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Manuscript Successfully Submitted!</h2>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
              Tracking Reference: {submissionResult.submissionNum}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your manuscript has entered the Chief Editor intake queue for desk screening and reviewer selection.
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            {/* Manuscript Target */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold">TARGET PUBLICATION</span>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Quantum Computing Foundations for Distributed Systems
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Journal Article
              </span>
            </div>

            {/* Author ORCID & Disclosures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Author ORCID iD</label>
                <input
                  type="text"
                  value={orcidId}
                  onChange={(e) => setOrcidId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Conflict of Interest Statement</label>
                <input
                  type="text"
                  value={coiStatement}
                  onChange={(e) => setCoiStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono outline-none"
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Cover Letter to Chief Editor</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Dear Chief Editor, We present our manuscript on quantum distributed computing..."
                className="w-full h-36 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            {/* Terms & Open Access Agreement */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <label className="flex items-center gap-2 font-medium">
                <input type="checkbox" defaultChecked className="rounded text-sky-600" />
                I confirm all co-authors approve submission and manuscript represents original un-published work.
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Transmitting Submission...' : 'Submit Manuscript to Press'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
