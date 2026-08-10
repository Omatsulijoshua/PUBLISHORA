'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  BookOpen, Plus, Sliders, DollarSign, Layers, ShieldCheck, CheckCircle2, FileText, Globe
} from 'lucide-react';

export default function PublisherDashboardPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [issnPrint, setIssnPrint] = useState('');
  const [issnOnline, setIssnOnline] = useState('');
  const [apcUsd, setApcUsd] = useState(0);
  const [openAccessType, setOpenAccessType] = useState<'GOLD' | 'GREEN' | 'HYBRID' | 'DIAMOND'>('DIAMOND');

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/journals');
      if (res.ok) {
        const data = await res.json();
        setJournals(data);
      } else {
        mockJournals();
      }
    } catch (err) {
      mockJournals();
    }
  };

  const mockJournals = () => {
    setJournals([
      {
        id: 'j-01',
        title: 'Global Journal of Quantum Information & Computing',
        code: 'gjqic',
        issnPrint: '2981-0012',
        issnOnline: '2981-0020',
        publisherName: 'PUBLISHORA Academic Press',
        openAccessType: 'DIAMOND',
        apcAwardUsd: 0,
        issues: [{ id: 'iss-1', volumeNumber: 1, issueNumber: 1, title: 'Volume 1, Issue 1' }],
      },
      {
        id: 'j-02',
        title: 'International Review of Sustainable Energy & Policy',
        code: 'irsep',
        issnPrint: '2710-8819',
        issnOnline: '2710-8827',
        publisherName: 'PUBLISHORA Academic Press',
        openAccessType: 'GOLD',
        apcAwardUsd: 350,
        issues: [],
      },
    ]);
  };

  const handleCreateJournal = async () => {
    if (!newTitle || !newCode) return;
    try {
      const res = await fetch('http://localhost:4000/api/v1/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          code: newCode,
          issnPrint,
          issnOnline,
          apcAwardUsd: Number(apcUsd),
          openAccessType,
        }),
      });

      if (res.ok) {
        fetchJournals();
        setShowCreateModal(false);
        setNewTitle('');
        setNewCode('');
      } else {
        alert('Failed to create journal.');
      }
    } catch (err) {
      alert('Error connecting to backend API.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Publisher Admin & Journal Management
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
              Publisher Dashboard & Journal Management
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Configure press imprints, create academic journals, manage volume/issue releases, and setup Article Processing Charges (APCs).
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Launch New Academic Journal
          </button>
        </div>

        {/* Publication Type Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Academic Books', count: '4 Formats', desc: 'Monographs, Textbooks, Fiction & Non-Fiction' },
            { title: 'Academic Journals', count: `${journals.length} Managed`, desc: 'Peer-reviewed articles, Special Issues' },
            { title: 'Working Papers', count: 'Preprint Archive', desc: 'Open Access preliminary research' },
            { title: 'Policy Briefs', count: 'Institutional', desc: 'Whitepapers, Reports & Institutional briefs' },
          ].map((type, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400">{type.count}</span>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">{type.title}</h3>
              <p className="text-xs text-slate-500">{type.desc}</p>
            </div>
          ))}
        </div>

        {/* Journals Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Managed Academic Journals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journals.map((j) => (
              <div key={j.id} className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                      {j.openAccessType} ACCESS
                    </span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white mt-1.5">{j.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">Code: {j.code}</p>
                  </div>

                  <span className="text-xs font-mono text-slate-500">
                    APC: {j.apcAwardUsd === 0 ? 'DIAMOND (Free)' : `$${j.apcAwardUsd} USD`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>pISSN: {j.issnPrint || 'Pending'}</div>
                  <div>eISSN: {j.issnOnline || 'Pending'}</div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <span className="text-xs text-slate-500">{j.issues?.length || 0} Issues Published</span>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    Manage Issues & Board
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Journal Creation */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">Create New Journal Imprint</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Journal Full Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Journal of Advanced Robotics"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Journal Code / Slug</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. jarobotics"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Print ISSN</label>
                    <input
                      type="text"
                      value={issnPrint}
                      onChange={(e) => setIssnPrint(e.target.value)}
                      placeholder="2981-XXXX"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Online ISSN</label>
                    <input
                      type="text"
                      value={issnOnline}
                      onChange={(e) => setIssnOnline(e.target.value)}
                      placeholder="2981-YYYY"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Open Access Model</label>
                    <select
                      value={openAccessType}
                      onChange={(e) => setOpenAccessType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none"
                    >
                      <option value="DIAMOND">DIAMOND (Free for all)</option>
                      <option value="GOLD">GOLD Open Access</option>
                      <option value="HYBRID">HYBRID Access</option>
                      <option value="GREEN">GREEN Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">APC Charge ($ USD)</label>
                    <input
                      type="number"
                      value={apcUsd}
                      onChange={(e) => setApcUsd(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJournal}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md"
                >
                  Save & Launch Journal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
