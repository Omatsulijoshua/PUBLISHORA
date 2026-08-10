'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  BookOpen, Bookmark, Highlighter, MessageSquare, Sparkles, Plus, CheckCircle2, ArrowRight, Compass
} from 'lucide-react';

export default function ReaderWorkspacePage() {
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'green' | 'blue' | 'pink'>('yellow');
  const [selectedText, setSelectedText] = useState('distributed quantum computing protocol achieves fault tolerance');
  const [noteComment, setNoteComment] = useState('Key methodology breakthrough for Chapter 3 review.');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [bookshelf, setBookshelf] = useState<any[]>([]);

  useEffect(() => {
    fetchAnnotations();
    fetchBookshelf();
  }, []);

  const fetchAnnotations = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/reader/annotations/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51?userId=user-101');
      if (res.ok) {
        const data = await res.json();
        setAnnotations(data);
      } else {
        mockAnnotations();
      }
    } catch (err) {
      mockAnnotations();
    }
  };

  const fetchBookshelf = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/reader/bookshelf/user-101');
      if (res.ok) {
        const data = await res.json();
        setBookshelf(data);
      } else {
        mockBookshelf();
      }
    } catch (err) {
      mockBookshelf();
    }
  };

  const mockAnnotations = () => {
    setAnnotations([
      {
        id: 'ann-1',
        selectedText: 'distributed quantum computing protocol achieves fault tolerance',
        color: 'yellow',
        noteComment: 'Key methodology breakthrough for Chapter 3 review.',
      },
    ]);
  };

  const mockBookshelf = () => {
    setBookshelf([
      { id: 'b1', title: 'Quantum Computing Foundations for Distributed Systems', progressPercent: 75 },
      { id: 'b2', title: 'Fault-Tolerant Qubit Fabric Protocols', progressPercent: 40 },
    ]);
  };

  const handleAddAnnotation = () => {
    if (!selectedText) return;
    setAnnotations([
      ...annotations,
      {
        id: `ann-${Date.now()}`,
        selectedText,
        color: selectedColor,
        noteComment,
      },
    ]);
    setSelectedText('');
    setNoteComment('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
              Reader Workspace & Research Notes Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Personal Academic Reader & Manuscript Annotator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Save articles to your personal bookshelf, highlight text across multicolor themes, attach sticky notes, and browse AI-curated research feeds.
          </p>
        </div>

        {/* Reader Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bookshelf Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-500" /> Personal Academic Bookshelf
            </h2>

            <div className="space-y-3">
              {bookshelf.map((book) => (
                <div key={book.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel space-y-2 text-xs font-mono">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{book.title}</div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Reading Progress</span>
                    <span className="font-bold text-indigo-500">{book.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${book.progressPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annotator Main Workspace */}
          <div className="md:col-span-2 space-y-6">
            {/* Multicolor Text Annotator */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Highlighter className="w-5 h-5 text-amber-500" /> Multicolor Text Annotator & Margin Notes
              </h2>

              <div className="space-y-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400">HIGHLIGHT COLOR</label>
                  <div className="flex items-center gap-2">
                    {(['yellow', 'green', 'blue', 'pink'] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent opacity-60'
                        } ${
                          color === 'yellow' ? 'bg-yellow-400' : color === 'green' ? 'bg-emerald-400' : color === 'blue' ? 'bg-sky-400' : 'bg-pink-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">SELECTED MANUSCRIPT TEXT</label>
                  <textarea
                    rows={2}
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    placeholder="Paste text excerpt..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">MARGIN STICKY NOTE</label>
                  <input
                    type="text"
                    value={noteComment}
                    onChange={(e) => setNoteComment(e.target.value)}
                    placeholder="Attach research note..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <button
                  onClick={handleAddAnnotation}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                >
                  Save Manuscript Annotation
                </button>
              </div>
            </div>

            {/* Saved Annotations List */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Active Manuscript Highlights & Notes</h3>

              <div className="space-y-3">
                {annotations.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-2 text-xs font-mono">
                    <div className={`p-2.5 rounded-lg font-medium text-slate-900 ${
                      ann.color === 'yellow' ? 'bg-yellow-300/40 text-yellow-950' : ann.color === 'green' ? 'bg-emerald-300/40 text-emerald-950' : 'bg-sky-300/40 text-sky-950'
                    }`}>
                      "{ann.selectedText}"
                    </div>

                    {ann.noteComment && (
                      <div className="text-slate-500 flex items-center gap-1.5 pl-1">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> {ann.noteComment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
