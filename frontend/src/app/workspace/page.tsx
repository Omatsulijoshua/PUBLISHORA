'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Plus, BookOpen, FileText, Layers, Clock, Sparkles, Filter, Search, ArrowRight, CheckCircle2, ShieldAlert
} from 'lucide-react';

interface PublicationItem {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  mode: 'PUBLISHING_MODE' | 'PREPARATION_MODE';
  publicationType: { name: string; code: string };
  currentVersionNum: number;
  updatedAt: string;
}

export default function WorkspaceDashboard() {
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTypeCode, setNewTypeCode] = useState('JOURNAL_ARTICLE');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/publications');
      if (res.ok) {
        const data = await res.json();
        setPublications(data);
      } else {
        mockPublications();
      }
    } catch (err) {
      mockPublications();
    } finally {
      setLoading(false);
    }
  };

  const mockPublications = () => {
    setPublications([
      {
        id: 'pub-001-quantum',
        title: 'Quantum Entanglement in Distributed Supercomputing Architectures',
        subtitle: 'A Comparative Analysis of Fault-Tolerant Qubit Fabrics',
        status: 'DRAFT',
        mode: 'PREPARATION_MODE',
        publicationType: { name: 'Journal Article', code: 'JOURNAL_ARTICLE' },
        currentVersionNum: 3,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pub-002-novel',
        title: 'Echoes Beyond the Horizon: A Sci-Fi Anthology',
        subtitle: 'Volume 1',
        status: 'SUBMITTED',
        mode: 'PUBLISHING_MODE',
        publicationType: { name: 'Book', code: 'BOOK' },
        currentVersionNum: 5,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'pub-003-report',
        title: 'Global Renewable Energy Infrastructure Readiness Report 2026',
        subtitle: 'Prepared for Institutional Stakeholders',
        status: 'EDITORIAL_SCREENING',
        mode: 'PUBLISHING_MODE',
        publicationType: { name: 'Report', code: 'REPORT' },
        currentVersionNum: 2,
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]);
  };

  const handleCreate = async () => {
    if (!newTitle) return;
    try {
      const res = await fetch('http://localhost:4000/api/v1/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          publicationTypeCode: newTypeCode,
          ownerUserId: 'demo-user-id',
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle('');
        fetchPublications();
      } else {
        alert('Publication created in demo workspace mode!');
        setShowCreateModal(false);
      }
    } catch (err) {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      {/* Workspace Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Unified Publication Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> New Publication
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Active Publications</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage your manuscripts, edit content, review versions, and track publishing progress.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> All Publications ({publications.length})
            </button>
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {pub.publicationType.name}
                  </span>

                  {pub.mode === 'PUBLISHING_MODE' ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Publishing Mode
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Preparation Mode
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                  {pub.title}
                </h2>
                {pub.subtitle && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-4">
                    {pub.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 font-mono">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-sky-500" /> v{pub.currentVersionNum}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(pub.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {pub.status}
                </span>

                <a
                  href={`/workspace/${pub.id}/editor`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  Open Editor <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create New Publication Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Create New Publication</h2>
              <p className="text-xs text-slate-500 mt-1">Initialize a manuscript in your publication workspace.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Publication Title</label>
              <input
                type="text"
                placeholder="e.g. Advanced Quantum Algorithms for Cryptanalysis"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Publication Type</label>
              <select
                value={newTypeCode}
                onChange={(e) => setNewTypeCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="JOURNAL_ARTICLE">Academic Journal Article</option>
                <option value="BOOK">Book / Monograph</option>
                <option value="RESEARCH_PAPER">Research Paper</option>
                <option value="THESIS">Thesis / Dissertation</option>
                <option value="REPORT">Professional Report</option>
                <option value="MAGAZINE">Magazine Issue</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md"
              >
                Initialize Publication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
