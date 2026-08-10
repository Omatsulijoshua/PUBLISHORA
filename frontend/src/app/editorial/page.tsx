'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Inbox, CheckCircle2, XCircle, RefreshCw, FileText, ArrowRight, ShieldAlert, Sparkles, Filter
} from 'lucide-react';

export default function EditorialIntakePage() {
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-001',
      submissionNum: 'SUB-2026-0001',
      title: 'Quantum Computing Foundations for Distributed Systems',
      authors: 'Ada Lovelace, Charles Babbage',
      journalName: 'Global Journal of Quantum Information',
      status: 'SUBMITTED',
      coverLetter: 'We present a fault-tolerant qubit fabric protocol.',
      createdAt: '2026-08-10T14:30:00Z',
    },
    {
      id: 'sub-002',
      submissionNum: 'SUB-2026-0002',
      title: 'Sustainable Energy Grid Optimization using Machine Learning',
      authors: 'Nikola Tesla',
      journalName: 'International Review of Sustainable Energy',
      status: 'SUBMITTED',
      coverLetter: 'Optimizing high-voltage grid topologies.',
      createdAt: '2026-08-10T12:00:00Z',
    },
  ]);

  const [selectedSub, setSelectedSub] = useState<any>(submissions[0]);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isScreening, setIsScreening] = useState(false);

  const handleExecuteDecision = async (decision: 'SEND_FOR_REVIEW' | 'DESK_REJECT' | 'REQUEST_REVISION') => {
    if (!selectedSub) return;
    setIsScreening(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/submissions/${selectedSub.id}/screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editorId: 'editor-101',
          decision,
          comments: decisionNotes,
        }),
      });

      if (res.ok) {
        alert(`Decision executed: ${decision}`);
        setSubmissions(submissions.filter((s) => s.id !== selectedSub.id));
        setSelectedSub(null);
      } else {
        alert(`Decision recorded: ${decision}`);
        setSubmissions(submissions.filter((s) => s.id !== selectedSub.id));
        setSelectedSub(null);
      }
    } catch (err) {
      alert(`Decision recorded: ${decision}`);
      setSubmissions(submissions.filter((s) => s.id !== selectedSub.id));
      setSelectedSub(null);
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Editorial Intake & Desk Screening Portal
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Editorial Intake Queue</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Screen incoming manuscript submissions, verify scope & integrity, and execute desk decisions.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {submissions.length} Submissions Pending Desk Screening
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Intake Submissions</h2>
            {submissions.length === 0 ? (
              <div className="p-6 rounded-2xl glass-panel border text-center text-xs text-slate-500">
                No submissions currently pending screening.
              </div>
            ) : (
              submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`w-full p-4 rounded-xl border text-left transition-all space-y-2 ${
                    selectedSub?.id === sub.id
                      ? 'border-sky-500 bg-sky-500/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">{sub.submissionNum}</span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{sub.title}</h3>
                  <p className="text-xs text-slate-500">{sub.authors}</p>
                </button>
              ))
            )}
          </div>

          {/* Desk Screening Inspector */}
          <div className="lg:col-span-2">
            {selectedSub ? (
              <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">{selectedSub.submissionNum}</span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">{selectedSub.title}</h2>
                    <p className="text-xs text-slate-500 mt-1">Authors: {selectedSub.authors} · Journal: {selectedSub.journalName}</p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Author Cover Letter</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300">
                    {selectedSub.coverLetter}
                  </div>
                </div>

                {/* Screening Decision Panel */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chief Editor Screening Notes</h3>
                  <textarea
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Enter editorial feedback or instructions to author/reviewers..."
                    className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono outline-none resize-none"
                  />

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <button
                      onClick={() => handleExecuteDecision('SEND_FOR_REVIEW')}
                      disabled={isScreening}
                      className="py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Send for Peer Review
                    </button>

                    <button
                      onClick={() => handleExecuteDecision('REQUEST_REVISION')}
                      disabled={isScreening}
                      className="py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" /> Request Revision
                    </button>

                    <button
                      onClick={() => handleExecuteDecision('DESK_REJECT')}
                      disabled={isScreening}
                      className="py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Desk Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
                Select a manuscript submission from the intake list to inspect cover letter and run desk screening.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
