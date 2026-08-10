'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Zap, ShieldCheck, History, ExternalLink, CheckCircle2, ArrowRight, BookOpen, Clock, Tag
} from 'lucide-react';

export default function PreprintsPage() {
  const [preprints, setPreprints] = useState<any[]>([]);

  useEffect(() => {
    fetchPreprints();
  }, []);

  const fetchPreprints = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/preprints');
      if (res.ok) {
        const data = await res.json();
        setPreprints(data);
      } else {
        mockPreprints();
      }
    } catch (err) {
      mockPreprints();
    }
  };

  const mockPreprints = () => {
    setPreprints([
      {
        id: 'prep-2026-881',
        title: 'Scalable Transmon Qubit Control via Cryogenic Microwave CMOS Drivers',
        abstract: 'We present a 4 Kelvin CMOS driver circuit capable of addressing 64 transmon qubits with sub-nanosecond phase resolution...',
        category: 'Quantum Hardware',
        screeningStatus: 'PASSED_SCREENING',
        doi: '10.5555/publishora.preprint.2026.881',
        authors: [
          { name: 'Dr. Ada Lovelace', email: 'ada@mit.edu', affiliation: 'MIT Quantum Lab' },
          { name: 'Marcus Thorne', email: 'marcus@mit.edu', affiliation: 'MIT' },
        ],
        license: 'CC-BY 4.0 International',
        versions: [
          { versionNumber: 1, publishedAt: '2026-08-01', revisionNotes: 'Initial preprint release.' },
          { versionNumber: 2, publishedAt: '2026-08-08', revisionNotes: 'Updated Figure 3 with 77K control benchmark.' },
        ],
        versionOfRecord: {
          journalArticleDoi: '10.5555/publishora.2026.001',
          journalTitle: 'PUBLISHORA Quantum Systems',
        },
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Preprint Server & Versioned Instant Open Access Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            PUBLISHORA Preprints Server
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Instant 24-hour peer screening, versioned preprint updates (v1, v2), and automated Crossref Version of Record (VOR) linking.
          </p>
        </div>

        {/* Preprints List */}
        <div className="space-y-6">
          {preprints.map((prep) => (
            <div key={prep.id} className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      {prep.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> 24h Rapid Screening Passed
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900 dark:text-white">{prep.title}</h2>
                  <p className="text-xs font-mono text-slate-500">
                    Authors: {prep.authors.map((a: any) => a.name).join(', ')}
                  </p>
                </div>
              </div>

              {/* Abstract */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{prep.abstract}</p>

              {/* Version History & VOR Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Version History Timeline */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-serif font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <History className="w-4 h-4 text-sky-500" /> Version History
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    {prep.versions.map((ver: any) => (
                      <div key={ver.versionNumber} className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5 last:border-0 last:pb-0">
                        <div>
                          <span className="font-bold text-sky-500">v{ver.versionNumber}</span>
                          <span className="text-slate-400 ml-2">{ver.revisionNotes}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{ver.publishedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Version of Record (VOR) Linking */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-serif font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-500" /> Version of Record (VOR) Article
                  </h3>

                  {prep.versionOfRecord ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="text-emerald-500 font-bold">Published in {prep.versionOfRecord.journalTitle}</div>
                      <div className="text-slate-400">Journal Article DOI: {prep.versionOfRecord.journalArticleDoi}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                        Crossref `isPreprintOf` Linked
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px]">Under Peer Review in Journal Pipeline</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
