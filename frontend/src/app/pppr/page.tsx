'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  MessageSquare, CheckCircle2, ShieldCheck, UserCheck, RefreshCw, CornerDownRight, FlaskConical, ExternalLink
} from 'lucide-react';

export default function PpprPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/pppr/publication/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        mockReviews();
      }
    } catch (err) {
      mockReviews();
    }
  };

  const mockReviews = () => {
    setReviews([
      {
        id: 'pppr-101',
        publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
        reviewerName: 'Dr. Niels Bohr',
        orcidId: '0000-0002-1825-0097',
        affiliation: 'Copenhagen Institute for Advanced Study',
        title: 'Clarification on Equation 12 Decoherence Rate',
        comment: 'The transmon qubit coherence time in Equation 12 holds under thermal noise below 15 mK, but non-Markovian noise may alter the asymptotic limit.',
        createdAt: '2026-08-05',
        authorResponses: [
          {
            authorName: 'Dr. Ada Lovelace',
            responseContent: 'We thank Dr. Bohr for pointing this out. We have added a Supplementary Note demonstrating that non-Markovian memory effects remain bounded within 0.02%.',
            createdAt: '2026-08-06',
          },
        ],
        replicationReports: [
          {
            labName: 'Stanford Quantum Photonics Lab',
            leadResearcher: 'Dr. Elena Rostova',
            replicationResult: 'REPLICATED_SUCCESSFULLY',
            notes: 'Independently reproduced 99.4% two-qubit gate fidelity using transmon testbed.',
            createdAt: '2026-08-07',
          },
        ],
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-medium">
              Post-Publication Peer Review (PPPR) & Dynamic Annotations
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Post-Publication Peer Review & Open Critiques
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Verified scholar peer reviews with ORCID identity, official author response threads, and independent lab replication reports.
          </p>
        </div>

        {/* Post-Publication Reviews List */}
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              {/* Reviewer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">{rev.reviewerName}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> ORCID: {rev.orcidId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{rev.affiliation}</div>
                </div>
                <span className="text-xs font-mono text-slate-400">{rev.createdAt}</span>
              </div>

              {/* Review Title & Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">{rev.title}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>

              {/* Replication Attempt Reports */}
              {rev.replicationReports && rev.replicationReports.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-serif font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4" /> Independent Lab Replication Report
                  </h4>
                  {rev.replicationReports.map((rep: any, idx: number) => (
                    <div key={idx} className="text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{rep.labName} ({rep.leadResearcher})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                          {rep.replicationResult}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">{rep.notes}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Author Official Response Threads */}
              {rev.authorResponses && rev.authorResponses.length > 0 && (
                <div className="ml-4 md:ml-8 pl-4 border-l-2 border-teal-500 space-y-3">
                  <h4 className="text-xs font-serif font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <CornerDownRight className="w-4 h-4 text-teal-500" /> Official Author Response
                  </h4>
                  {rev.authorResponses.map((resp: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900 dark:text-white">
                        <span>{resp.authorName} (Corresponding Author)</span>
                        <span className="text-[10px] text-slate-500">{resp.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{resp.responseContent}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
