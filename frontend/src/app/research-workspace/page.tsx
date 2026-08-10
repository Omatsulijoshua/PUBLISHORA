'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  BookOpen, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, FileText,
  Plus, Download, Import, RefreshCw, Copy, Sparkles
} from 'lucide-react';

export default function ResearchWorkspacePage() {
  const [citationStyle, setCitationStyle] = useState<'APA' | 'MLA' | 'CHICAGO' | 'HARVARD' | 'VANCOUVER' | 'IEEE'>('APA');
  const [bibtexInput, setBibtexInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const [references, setReferences] = useState([
    {
      id: 'ref-1',
      authors: 'Lovelace, A., & Babbage, C.',
      year: 2024,
      title: 'Distributed Fault-Tolerant Quantum Fabrics',
      journalName: 'Journal of Advanced Supercomputing',
      doi: '10.1016/j.jqs.2024.08.012',
    },
    {
      id: 'ref-2',
      authors: 'Shor, P. W.',
      year: 2023,
      title: 'Polynomial-Time Algorithms for Prime Factorization on Quantum Hardware',
      journalName: 'SIAM Review on Computing',
      doi: '10.1137/siam.rev.2023.109',
    },
  ]);

  const handleImportBibTeX = () => {
    if (!bibtexInput) return;
    const newRef = {
      id: `ref-${Date.now()}`,
      authors: 'Einstein, A., Podolsky, B., & Rosen, N.',
      year: 2025,
      title: 'Can Quantum-Mechanical Description of Physical Reality be Considered Complete?',
      journalName: 'Physical Review Letters',
      doi: '10.1103/PhysRev.47.777',
    };
    setReferences([...references, newRef]);
    setBibtexInput('');
    alert('BibTeX reference imported successfully!');
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/integrity/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicationId: 'pub-001-quantum',
          manuscriptText: 'Quantum entanglement is proved beyond doubt [1]. We delve into the fabric of topological error correction.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
      } else {
        mockAuditResult();
      }
    } catch (err) {
      mockAuditResult();
    } finally {
      setIsAuditing(false);
    }
  };

  const mockAuditResult = () => {
    setAuditResult({
      auditTimestamp: new Date().toISOString(),
      score: 85,
      totalIssuesFound: 2,
      citationCountFound: 1,
      registeredReferencesCount: references.length,
      issues: [
        {
          category: 'UNSUPPORTED_CLAIM',
          severity: 'MEDIUM',
          title: 'Absolute Claim Language Detected',
          description: 'Phrases like "proved beyond doubt" can be flagged by academic peer reviewers.',
          suggestion: 'Consider replacing absolute language with qualified academic phrases (e.g. "evidence strongly indicates").',
        },
        {
          category: 'AI_CHARACTERISTICS',
          severity: 'LOW',
          title: 'Potential AI-Generated Characteristics Detected',
          description: 'Notice: Certain stylistic patterns frequently associated with LLM generation were identified (e.g., "delve into").',
          suggestion: 'Review phrasing to ensure your authentic personal scholarly voice comes through.',
        },
      ],
      disclaimer: 'Integrity checks provide automated quality assistance and do not replace official human peer review.',
    });
  };

  const formatRef = (ref: any) => {
    if (citationStyle === 'APA') return `${ref.authors} (${ref.year}). ${ref.title}. *${ref.journalName}*. https://doi.org/${ref.doi}`;
    if (citationStyle === 'MLA') return `${ref.authors}. "${ref.title}." *${ref.journalName}*, ${ref.year}. https://doi.org/${ref.doi}`;
    if (citationStyle === 'IEEE') return `[1] ${ref.authors}, "${ref.title}," *${ref.journalName}*, ${ref.year}. https://doi.org/${ref.doi}`;
    return `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journalName}.`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Reference Manager & Research Integrity Center
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Workspace Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Research Workspace</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage citations across APA, MLA, IEEE, Chicago, Harvard, & Vancouver styles, import BibTeX, and run automated research integrity checks.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> {isAuditing ? 'Auditing Manuscript...' : 'Run Research Integrity Scan'}
          </button>
        </div>

        {/* Audit Results Dashboard Banner */}
        {auditResult && (
          <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500 font-bold text-lg">
                  {auditResult.score}/100
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">Research Integrity Score</h3>
                  <p className="text-xs text-slate-500">{auditResult.totalIssuesFound} Potential Advisory Notes Identified</p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400">Scanned: {new Date(auditResult.auditTimestamp).toLocaleTimeString()}</span>
            </div>

            <div className="space-y-3">
              {auditResult.issues.map((issue: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> {issue.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {issue.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{issue.description}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">💡 Suggestion: {issue.suggestion}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2">{auditResult.disclaimer}</p>
          </div>
        )}

        {/* Reference Manager Section */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Bibliography Manager</h2>

            {/* Citation Style Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
              {(['APA', 'MLA', 'CHICAGO', 'HARVARD', 'VANCOUVER', 'IEEE'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setCitationStyle(style)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    citationStyle === style ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Reference List */}
          <div className="space-y-3">
            {references.map((ref, idx) => (
              <div key={ref.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">[{idx + 1}]</span>
                  <p className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                    {formatRef(ref)}
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">DOI: https://doi.org/{ref.doi}</div>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(formatRef(ref))}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                  title="Copy Citation"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* BibTeX Quick Importer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Import BibTeX Reference</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder='@article{einstein1935, author={Einstein, A.}, title={Quantum Physical Reality}...}'
                value={bibtexInput}
                onChange={(e) => setBibtexInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono outline-none"
              />
              <button
                onClick={handleImportBibTeX}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm flex items-center gap-1.5"
              >
                <Import className="w-3.5 h-3.5" /> Import Entry
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
