'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Save, History, MessageSquare, Eye, FileText, Download, Check, Sparkles,
  Heading1, Heading2, List, Table, Image as ImageIcon, Link as LinkIcon,
  RotateCcw, ShieldCheck, AlertCircle, Plus, Send, CornerDownRight
} from 'lucide-react';

interface VersionItem {
  id: string;
  versionNumber: number;
  title: string;
  changeSummary: string;
  createdAt: string;
}

export default function WebDocumentEditor({ params }: { params: { id: string } }) {
  const publicationId = params.id || 'pub-001-quantum';

  const [title, setTitle] = useState('Quantum Entanglement in Distributed Supercomputing Architectures');
  const [content, setContent] = useState(
`# Abstract

Quantum entanglement represents a fundamental resource for next-generation distributed quantum computing architectures. In this manuscript, we present a novel fault-tolerant qubit fabric protocol capable of maintaining coherence across non-local quantum nodes.

## 1. Introduction

Distributed quantum computing relies on high-fidelity quantum channels connecting individual quantum processing units (QPUs). Recent breakthroughs in topological error correction have opened new pathways toward scalable quantum networks.

$$E = mc^2 \\quad \\text{and} \\quad |\\Psi\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$$

### Key Architectural Contributions:
* Fault-tolerant Bell state synthesis.
* Sub-millisecond entanglement purification loops.
* Real-time topological error syndromes.

> Footnote 1: Experimental validation conducted on 128-qubit superconducting processors.`
  );

  const [autosaveStatus, setAutosaveStatus] = useState('Autosaved just now');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'history' | 'comments' | 'export'>('history');

  const [versions, setVersions] = useState<VersionItem[]>([
    { id: 'v3', versionNumber: 3, title: 'Quantum Entanglement in Distributed Architectures', changeSummary: 'Added LaTeX equation and Bell state synthesis section', createdAt: new Date().toISOString() },
    { id: 'v2', versionNumber: 2, title: 'Quantum Entanglement Protocols', changeSummary: 'Updated introduction and topological error correction footnotes', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'v1', versionNumber: 1, title: 'Initial Draft', changeSummary: 'Initial manuscript creation', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ]);

  const [comments, setComments] = useState([
    { id: 'c1', author: 'Dr. Sarah Chen', text: 'Consider clarifying the purification loop latency in Section 1.', line: 12, date: '10 mins ago' },
    { id: 'c2', author: 'Prof. Marcus Vance', text: 'The Bell state equation formatting is clean and compliant.', line: 8, date: '1 hour ago' },
  ]);

  const [newComment, setNewComment] = useState('');

  // Handle Autosave Simulation
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setAutosaveStatus('Saving changes...');
    setTimeout(() => {
      setAutosaveStatus('Autosaved just now');
    }, 1200);
  };

  const handleSaveSnapshot = () => {
    const nextNum = versions[0].versionNumber + 1;
    const newVer: VersionItem = {
      id: `v${nextNum}`,
      versionNumber: nextNum,
      title: title,
      changeSummary: `Manual snapshot v${nextNum} saved`,
      createdAt: new Date().toISOString(),
    };
    setVersions([newVer, ...versions]);
    alert(`Version ${nextNum} snapshot successfully recorded!`);
  };

  const handleRestoreVersion = (ver: VersionItem) => {
    if (confirm(`Are you sure you want to restore Version ${ver.versionNumber}?`)) {
      setTitle(ver.title);
      handleSaveSnapshot();
    }
  };

  const handleAddComment = () => {
    if (!newComment) return;
    setComments([
      { id: `c-${Date.now()}`, author: 'You (Author)', text: newComment, line: 1, date: 'Just now' },
      ...comments,
    ]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="icon" size="sm" />
            <a href="/workspace" className="text-xs text-slate-500 hover:underline">
              Workspace
            </a>
            <span className="text-slate-400">/</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-serif font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 outline-none px-1 max-w-md"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-mono hidden sm:inline">{autosaveStatus}</span>
            <ThemeToggle />
            <button
              onClick={handleSaveSnapshot}
              className="px-3.5 py-2 rounded-xl font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" /> Snapshot
            </button>
            <button
              onClick={() => alert('Manuscript ready for Phase 6 Preparation Export & Submission')}
              className="px-4 py-2 rounded-xl font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Export & Submit
            </button>
          </div>
        </div>
      </header>

      {/* Editor Formatting Toolbar */}
      <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Bullet List"><List className="w-4 h-4" /></button>
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Insert Table"><Table className="w-4 h-4" /></button>
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Insert Image"><ImageIcon className="w-4 h-4" /></button>
          <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Insert Footnote / Equation"><LinkIcon className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
          <span className="text-slate-400 font-mono text-[11px] px-2">Track Changes: ON</span>
        </div>
      </div>

      {/* Main Workspace Layout (Editor + Sidebar) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        {/* Editor Main Canvas */}
        <div className="flex-1 glass-panel p-6 md:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-lg">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full min-h-[500px] bg-transparent font-mono text-sm leading-relaxed outline-none resize-none"
            placeholder="Type manuscript markdown or formatted text..."
          />
        </div>

        {/* Workspace Right Sidebar (Version History / Comments / Export) */}
        <div className="w-80 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium mb-4">
            <button
              onClick={() => setActiveSidebarTab('history')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                activeSidebarTab === 'history' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Versions ({versions.length})
            </button>
            <button
              onClick={() => setActiveSidebarTab('comments')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                activeSidebarTab === 'comments' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Comments ({comments.length})
            </button>
          </div>

          {/* Tab 1: Version History */}
          {activeSidebarTab === 'history' && (
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Version History</span>
                <span className="font-mono text-sky-500">v{versions[0].versionNumber} Active</span>
              </div>

              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Version {ver.versionNumber}</span>
                    <button
                      onClick={() => handleRestoreVersion(ver)}
                      className="text-sky-600 dark:text-sky-400 hover:underline text-[11px] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-tight">{ver.changeSummary}</p>
                  <div className="text-[10px] text-slate-400 font-mono">{new Date(ver.createdAt).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Comments */}
          {activeSidebarTab === 'comments' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 overflow-y-auto pr-1 flex-1 mb-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                />
                <button
                  onClick={handleAddComment}
                  className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
