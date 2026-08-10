'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Database, GitBranch, ShieldCheck, Download, Code, CheckCircle2, ArrowUpRight, ExternalLink
} from 'lucide-react';

export default function DatasetsPage() {
  const [datasetsData, setDatasetsData] = useState<any>(null);
  const [cffContent, setCffContent] = useState('cff-version: 1.2.0\ntitle: PUBLISHORA Bio-Simulation Toolkit\nversion: 1.0.0');
  const [parsedCff, setParsedCff] = useState<any>(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/datasets');
      if (res.ok) setDatasetsData(await res.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setDatasetsData({
      total: 1,
      datasets: [
        {
          id: 'ds-101',
          title: 'Global Single-Cell RNA Sequencing Expression Matrix for Neural Tissue',
          doi: '10.5555/dataset.2026.101',
          authors: ['Dr. Ada Lovelace', 'Dr. Marcus Thorne'],
          description: 'Single-cell transcriptomic profiles of human cortical neurons across 12 developmental stages.',
          externalRepository: 'HARVARD_DATAVERSE',
          license: 'CC0 1.0 Universal',
          fileSizeBytes: 14285714285,
          fairScore: { overallPercent: 97.5, findable: 100, accessible: 100, interoperable: 95, reusable: 95 },
        },
      ],
    });
  };

  const handleParseCff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/v1/datasets/parse-cff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cffContent }),
      });
      if (res.ok) setParsedCff(await res.json());
    } catch (err) {
      setParsedCff({
        cffVersion: '1.2.0',
        title: 'PUBLISHORA Bio-Simulation Toolkit',
        authors: [{ name: 'Lovelace, Ada', orcid: 'https://orcid.org/0000-0002-1825-0097' }],
        doi: '10.5555/software.2026.881',
        repositoryCode: 'https://github.com/Omatsulijoshua/PUBLISHORA',
        license: 'MIT',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              DataCite Dataset DOIs & FAIR Data Principles Compliance
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Research Datasets & Software Citation Engine
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Harvard Dataverse and Zenodo direct deposits, DataCite 4.4 XML metadata generation, GitHub `CITATION.cff` parsing, and FAIR compliance auditing.
          </p>
        </div>

        {/* Datasets Catalog */}
        {datasetsData && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" /> DataCite Registered Research Datasets
            </h2>

            <div className="space-y-4">
              {datasetsData.datasets?.map((ds: any) => (
                <div key={ds.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">{ds.title}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">Authors: {ds.authors?.join(', ')}</p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      FAIR Score: {ds.fairScore?.overallPercent}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{ds.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono border-t border-slate-200 dark:border-slate-800">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">DOI: https://doi.org/{ds.doi}</span>
                    <span>Repository: {ds.externalRepository} ({ds.license})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GitHub CITATION.cff Parser */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-500" /> GitHub Code Repository Citation File Format (CFF) Parser
          </h2>

          <form onSubmit={handleParseCff} className="space-y-4">
            <textarea
              rows={4}
              value={cffContent}
              onChange={(e) => setCffContent(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 font-mono text-xs text-slate-100"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-2"
            >
              <Code className="w-4 h-4" /> Parse CITATION.cff
            </button>
          </form>

          {parsedCff && (
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 font-mono text-xs space-y-1">
              <div className="font-bold text-indigo-600 dark:text-indigo-400">
                Software Citation: {parsedCff.title} (CFF v{parsedCff.cffVersion})
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Software DOI: {parsedCff.doi} · License: {parsedCff.license}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
