'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Users, UserCheck, FolderGit2, MessageSquare, Plus, CheckCircle2, ShieldCheck, ArrowRight, BookOpen
} from 'lucide-react';

export default function ResearchLabsPage() {
  const [lab, setLab] = useState<any>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');

  useEffect(() => {
    fetchLabDetails();
  }, []);

  const fetchLabDetails = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/labs/lab-101');
      if (res.ok) {
        const data = await res.json();
        setLab(data);
      } else {
        mockLab();
      }
    } catch (err) {
      mockLab();
    }
  };

  const mockLab = () => {
    setLab({
      id: 'lab-101',
      name: 'Quantum Information Systems Lab',
      institutionName: 'MIT & Global Academic Press',
      description: 'Researching fault-tolerant qubit interconnects and topological error correction.',
      members: [
        { userId: 'user-101', name: 'Dr. Ada Lovelace', role: 'PI', email: 'ada@mit.edu' },
        { userId: 'user-102', name: 'Dr. Elena Rostova', role: 'POSTDOC', email: 'elena@mit.edu' },
        { userId: 'user-103', name: 'Marcus Thorne', role: 'PHD_STUDENT', email: 'marcus@mit.edu' },
      ],
      sharedManuscripts: [
        { id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51', title: 'Quantum Computing Foundations for Distributed Systems', status: 'IN_PREPARATION' },
      ],
      discussions: [
        { id: 'disc-1', authorName: 'Dr. Elena Rostova', topicTitle: 'Feedback on Figure 4 Error Rates', content: 'The transmon qubit coherence time in Figure 4 looks solid, but let’s double check the noise margin.' },
      ],
    });
  };

  const handlePostDiscussion = () => {
    if (!newTopicTitle || !newTopicContent) return;
    setLab({
      ...lab,
      discussions: [
        ...lab.discussions,
        {
          id: `disc-${Date.now()}`,
          authorName: 'Dr. Ada Lovelace',
          topicTitle: newTopicTitle,
          content: newTopicContent,
        },
      ],
    });
    setNewTopicTitle('');
    setNewTopicContent('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono font-medium">
              Collaborative Research Groups & Lab Spaces
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {lab && (
          <>
            {/* Lab Space Banner */}
            <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3 shadow-xl">
              <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">{lab.institutionName}</span>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                {lab.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{lab.description}</p>
            </div>

            {/* Grid Layout: Members & Manuscripts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Member Roster */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-500" /> Lab Member Roster
                </h2>

                <div className="space-y-3 text-xs font-mono">
                  {lab.members.map((m: any) => (
                    <div key={m.userId} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-500">{m.email}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Manuscripts & Repositories */}
              <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-emerald-500" /> Shared Lab Manuscript Repositories
                </h2>

                <div className="space-y-3 text-xs font-mono">
                  {lab.sharedManuscripts.map((manu: any) => (
                    <div key={manu.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{manu.title}</div>
                        <div className="text-slate-500 mt-1">Status: {manu.status}</div>
                      </div>
                      <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Co-Editing Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lab Discussion Threads & Journal Club */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-500" /> Lab Discussion Threads & Manuscript Critiques
              </h2>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80">
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Discussion topic title..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none text-slate-900 dark:text-white"
                  />
                  <textarea
                    rows={2}
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    placeholder="Post critique or lab note..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handlePostDiscussion}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
                  >
                    Post Lab Discussion
                  </button>
                </div>

                <div className="space-y-3">
                  {lab.discussions.map((disc: any) => (
                    <div key={disc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{disc.topicTitle}</div>
                      <div className="text-slate-400 text-[10px]">Posted by {disc.authorName}</div>
                      <p className="text-slate-600 dark:text-slate-300 mt-2">{disc.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
