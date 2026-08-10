'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Download, FileText, BookOpen, Code, FileCode, CheckCircle2, ShieldAlert, Sparkles, ExternalLink, ArrowRight
} from 'lucide-react';

export default function ExportWorkspacePage() {
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'EPUB' | 'HTML' | 'JATS_XML' | 'BIBTEX' | 'RIS'>('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [exportOutput, setExportOutput] = useState<any>(null);

  const formats = [
    { id: 'PDF', name: 'Publication PDF', ext: '.pdf', icon: FileText, desc: 'Formatted layout for print-on-demand & digital reading' },
    { id: 'EPUB', name: 'E-Book Package', ext: '.epub', icon: BookOpen, desc: 'Reflowable e-book format for Kindle, Apple Books, Kobo' },
    { id: 'HTML', name: 'Clean HTML5', ext: '.html', icon: Code, desc: 'Semantic HTML markup with CSS design tokens' },
    { id: 'JATS_XML', name: 'JATS/XML Standard', ext: '.xml', icon: FileCode, desc: 'NLM JATS Z39.96 XML standard for journal indexing & archives' },
    { id: 'BIBTEX', name: 'BibTeX Citation Bundle', ext: '.bib', icon: Sparkles, desc: 'BibTeX reference entry for LaTeX and academic software' },
    { id: 'RIS', name: 'RIS Citation Bundle', ext: '.ris', icon: Sparkles, desc: 'RIS citation entry for EndNote, Zotero, Mendeley' },
  ];

  const handleGenerateExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/export/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
          format: selectedFormat,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExportOutput(data);
      } else {
        mockExportOutput();
      }
    } catch (err) {
      mockExportOutput();
    } finally {
      setIsExporting(false);
    }
  };

  const mockExportOutput = () => {
    setExportOutput({
      format: selectedFormat,
      fileName: `quantum-computing-foundations.${selectedFormat.toLowerCase()}`,
      content: selectedFormat === 'JATS_XML'
        ? `<?xml version="1.0"?>\n<article article-type="research-article">\n  <front><article-title>Quantum Computing Foundations</article-title></front>\n</article>`
        : `Generated ${selectedFormat} payload for Quantum Computing Foundations.`,
      modeNotice: 'Preparation Mode Export — Prepared Manuscript Draft for External Publishing',
      downloadUrl: `https://export.publishora.org/download/quantum-foundations.${selectedFormat.toLowerCase()}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Multi-Format Export Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header & Mode Disclaimer */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-4 h-4" /> Preparation Mode Active
          </div>

          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Export Publication-Ready Package
          </h1>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>Preparation Mode Transparency:</strong> Press publishing is unavailable in your selected region, but you can prepare, format, and export your publication-ready material here to publish through any external publisher, university press, or independent repository. This export is an un-published prepared manuscript draft.
          </div>
        </div>

        {/* Format Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formats.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFormat === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFormat(f.id as any)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {f.ext}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-1">
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center justify-between">
                  <span>{isSelected ? 'Selected Format' : 'Select Format'}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleGenerateExport}
            disabled={isExporting}
            className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-lg flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> {isExporting ? 'Compiling Package...' : `Compile & Download ${selectedFormat} Package`}
          </button>
        </div>

        {/* Output Card */}
        {exportOutput && (
          <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                    {exportOutput.format} Package Ready
                  </h3>
                  <span className="text-xs font-mono text-slate-500">{exportOutput.fileName}</span>
                </div>
              </div>

              <a
                href={exportOutput.downloadUrl || '#'}
                onClick={(e) => { e.preventDefault(); alert(`Downloading ${exportOutput.fileName}`); }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </a>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              {exportOutput.modeNotice}
            </p>

            {exportOutput.content && (
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-48">
                {exportOutput.content}
              </pre>
            )}
          </div>
        )}

        {/* External Publisher Guidance Section */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">External Publisher Directory & Guidance</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Since press publishing is unavailable in your region, we provide direct guidance for submitting your prepared material to third-party publishers, university presses, and open-access repositories.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Academic Journals</div>
              <p className="text-slate-500">DOAJ directory, Elsevier, Springer Nature, IEEE Xplore</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Book & E-book Distribution</div>
              <p className="text-slate-500">IngramSpark, Amazon KDP, Draft2Digital, Google Books</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Open Repositories</div>
              <p className="text-slate-500">arXiv, bioRxiv, Zenodo, SSRN, OSF Preprints</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
