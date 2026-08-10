'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  BookOpen, Layers, Bookmark, CheckCircle2, ShieldCheck, Calculator, Download, ExternalLink, Hash
} from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(320);
  const [paperStock, setPaperStock] = useState<'50lb_white' | '60lb_cream' | '70lb_matte'>('60lb_cream');
  const [bindingType, setBindingType] = useState<'HARDCOVER' | 'PAPERBACK'>('HARDCOVER');
  const [spineResult, setSpineResult] = useState<any>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        mockBooks();
      }
    } catch (err) {
      mockBooks();
    }
  };

  const mockBooks = () => {
    setBooks([
      {
        id: 'book-101',
        title: 'Topological Quantum Error Correction and Fault-Tolerant Architectures',
        subtitle: 'Principles, Hardware Interconnects, and Protocols',
        bookType: 'MONOGRAPH',
        publisherName: 'PUBLISHORA Academic Press',
        isbnHardcover: '978-3-16-148410-0',
        isbnPaperback: '978-3-16-148411-7',
        doi: '10.5555/publishora.book.2026.101',
        editors: ['Dr. Ada Lovelace', 'Dr. Charles Babbage'],
        chapters: [
          { chapterNumber: 1, title: 'Foundations of Anyonic Braiding', authors: ['Ada Lovelace'], doi: '10.5555/publishora.book.2026.101.ch1', startPage: 1, endPage: 45 },
          { chapterNumber: 2, title: 'Surface Code Lattice Surgery', authors: ['Charles Babbage', 'Elena Rostova'], doi: '10.5555/publishora.book.2026.101.ch2', startPage: 46, endPage: 92 },
        ],
      },
    ]);
  };

  const handleCalculateSpine = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/books/spine-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageCount, paperStock, bindingType }),
      });
      if (res.ok) {
        const data = await res.json();
        setSpineResult(data);
      } else {
        mockSpine();
      }
    } catch (err) {
      mockSpine();
    }
  };

  const mockSpine = () => {
    const ppi = paperStock === '60lb_cream' ? 434 : 500;
    let inches = pageCount / ppi;
    if (bindingType === 'HARDCOVER') inches += 0.15;
    setSpineResult({
      pageCount,
      paperStock,
      bindingType,
      spineWidthInches: parseFloat(inches.toFixed(4)),
      spineWidthMillimeters: parseFloat((inches * 25.4).toFixed(2)),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-medium">
              Monograph & Academic Book Publishing Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Monographs, Edited Volumes & Chapter-Level DOIs
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Publish peer-reviewed academic books with individual chapter DOIs, Crossref Book deposits, and Print-On-Demand (POD) cover spine calculations.
          </p>
        </div>

        {/* Book Spine Width Calculator */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" /> Book Cover Spine Width Calculator
            </h2>
            <span className="text-xs font-mono text-slate-400">POD Spec Tool</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">TOTAL MANUSCRIPT PAGE COUNT</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value) || 100)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">PAPER STOCK</label>
              <select
                value={paperStock}
                onChange={(e: any) => setPaperStock(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none text-slate-900 dark:text-white"
              >
                <option value="60lb_cream">60lb Cream Academic Stock (434 PPI)</option>
                <option value="50lb_white">50lb White Offset (500 PPI)</option>
                <option value="70lb_matte">70lb Matte Coated (380 PPI)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">BINDING SPECIFICATION</label>
              <select
                value={bindingType}
                onChange={(e: any) => setBindingType(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none text-slate-900 dark:text-white"
              >
                <option value="HARDCOVER">Case Laminate Hardcover (+0.15")</option>
                <option value="PAPERBACK">Perfect Bound Paperback</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              onClick={handleCalculateSpine}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
            >
              Calculate Spine Thickness
            </button>

            {spineResult && (
              <div className="text-xs font-mono text-emerald-500 font-bold">
                Spine Width: {spineResult.spineWidthMillimeters} mm ({spineResult.spineWidthInches} in)
              </div>
            )}
          </div>
        </div>

        {/* Academic Monograph Catalog */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Published Academic Books</h2>

          {books.map((book) => (
            <div key={book.id} className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {book.bookType}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">{book.title}</h3>
                  <p className="text-xs text-slate-500">{book.subtitle}</p>
                </div>
              </div>

              {/* Identifiers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-400 text-[10px]">BOOK DOI</span>
                  <div className="font-bold text-sky-500">{book.doi}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-400 text-[10px]">HARDCOVER ISBN</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{book.isbnHardcover}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-400 text-[10px]">PAPERBACK ISBN</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{book.isbnPaperback}</div>
                </div>
              </div>

              {/* Chapters Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white">Chapter-Level DOIs & Contributors</h4>

                {book.chapters.map((ch: any) => (
                  <div key={ch.chapterNumber} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4 text-xs font-mono">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Chapter {ch.chapterNumber}: {ch.title}
                      </div>
                      <div className="text-slate-500 mt-1">Authors: {ch.authors.join(', ')} · pp. {ch.startPage}-{ch.endPage}</div>
                    </div>

                    <span className="px-3 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">{ch.doi}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
