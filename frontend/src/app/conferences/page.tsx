'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Calendar, MapPin, Layers, FileText, CheckCircle2, Clock, Download, ExternalLink, ShieldCheck, Video
} from 'lucide-react';

export default function ConferencesPage() {
  const [conference, setConference] = useState<any>(null);

  useEffect(() => {
    fetchConferenceDetails();
  }, []);

  const fetchConferenceDetails = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/conferences/conf-2026-qis');
      if (res.ok) {
        const data = await res.json();
        setConference(data);
      } else {
        mockConference();
      }
    } catch (err) {
      mockConference();
    }
  };

  const mockConference = () => {
    setConference({
      id: 'conf-2026-qis',
      name: 'International Conference on Quantum Information & Distributed Systems (QIDS 2026)',
      acronym: 'QIDS 2026',
      location: 'Boston, MA & Virtual',
      startDate: '2026-10-15',
      endDate: '2026-10-18',
      cfpDeadline: '2026-08-30',
      tracks: ['Quantum Algorithms', 'Fault-Tolerant Hardware', 'Quantum Cryptography', 'Photonic Interconnects'],
      proceedings: {
        volumeTitle: 'Proceedings of QIDS 2026 - Volume I',
        isbn: '978-3-16-148499-1',
        totalAcceptedPapers: 18,
        tableOfContents: [
          { title: 'Quantum Computing Foundations for Distributed Systems', authors: 'Ada Lovelace, Charles Babbage', slidesUrl: 'https://slides.publishora.org/qids2026-keynote.pdf' },
          { title: 'Topological Qubit Fabric Architectures', authors: 'Elena Rostova, Marcus Thorne', slidesUrl: 'https://slides.publishora.org/qids2026-sess1.pdf' },
        ],
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-medium">
              Conferences & Symposia Publishing Platform
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {conference && (
          <>
            {/* Conference Header Card */}
            <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {conference.acronym}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" /> CFP Deadline: {conference.cfpDeadline}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                {conference.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-rose-500" /> {conference.startDate} to {conference.endDate}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-500" /> {conference.location}</span>
              </div>
            </div>

            {/* Conference Tracks Grid */}
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Call for Papers (CFP) Tracks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                {conference.tracks.map((track: string, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel space-y-1">
                    <span className="text-slate-400 text-[10px]">TRACK 0{idx + 1}</span>
                    <div className="font-bold text-slate-900 dark:text-white">{track}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conference Proceedings Volume */}
            {conference.proceedings && (
              <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                      {conference.proceedings.volumeTitle}
                    </h2>
                    <span className="text-xs font-mono text-slate-400">ISBN: {conference.proceedings.isbn} · {conference.proceedings.totalAcceptedPapers} Camera-Ready Papers</span>
                  </div>

                  <button
                    onClick={() => alert('Downloading Proceedings BibTeX / PDF Package.')}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Proceedings Package
                  </button>
                </div>

                {/* Table of Contents */}
                <div className="space-y-3">
                  <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-white">Proceedings Table of Contents</h3>
                  {conference.proceedings.tableOfContents.map((paper: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4 text-xs font-mono">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{paper.title}</div>
                        <div className="text-slate-500 mt-1">{paper.authors}</div>
                      </div>

                      <a href={paper.slidesUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" /> Slides / Video
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
