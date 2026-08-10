'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Search, Sparkles, BookOpen, Layers, Database, FileText, ExternalLink, Cpu
} from 'lucide-react';

export default function UniversalSearchPage() {
  const [query, setQuery] = useState('quantum computing');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [semanticGraph, setSemanticGraph] = useState<any>(null);
  const [vectorResult, setVectorResult] = useState<any>(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const sRes = await fetch(`http://localhost:4000/api/v1/universal-search?query=${encodeURIComponent(query)}`);
      if (sRes.ok) setSearchResults(await sRes.json());

      const gRes = await fetch(`http://localhost:4000/api/v1/universal-search/semantic-scholar?doi=10.1038/s41586-026-00101-x`);
      if (gRes.ok) setSemanticGraph(await gRes.json());

      const vRes = await fetch('http://localhost:4000/api/v1/universal-search/vector-similarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });
      if (vRes.ok) setVectorResult(await vRes.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setSearchResults({
      query,
      meshExpandedTerms: [query, `${query} algorithms`, `quantum information Science`],
      results: [
        {
          id: 'pub-101',
          contentType: 'JOURNAL_ARTICLE',
          title: 'Quantum Advantage in Cryptographic Protocols',
          authors: ['Dr. Eleanor Vance', 'Prof. Marcus Brody'],
          doi: '10.1038/s41586-026-00101-x',
          journalTitle: 'PUBLISHORA Journal of Quantum Computing',
          relevanceScore: 0.98,
        },
        {
          id: 'prep-204',
          contentType: 'PREPRINT',
          title: 'Fault-Tolerant Surface Codes for Superconducting Qubits',
          authors: ['Dr. Sophia Lin'],
          doi: '10.31219/osf.io/prep204',
          relevanceScore: 0.94,
        },
      ],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-medium">
              Universal Search & HNSW Vector Embedding Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Universal Search & Vector Embedding Discovery Engine
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Federated cross-content search across Journals, Books, Preprints, Datasets & Conferences with Semantic Scholar API graph visualization and MeSH term expansion.
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search across all publications, preprints, datasets, and conferences..."
            className="flex-1 bg-transparent border-none text-sm font-mono focus:outline-none text-slate-900 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Universal Search
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>FOUND {searchResults.results?.length || 0} RESULTS FOR "{searchResults.query}"</span>
              <span>MeSH Expansion: {searchResults.meshExpandedTerms?.join(', ')}</span>
            </div>

            <div className="space-y-4">
              {searchResults.results?.map((res: any) => (
                <div key={res.id} className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 hover:border-cyan-500/50 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-500 font-mono font-bold">
                      {res.contentType}
                    </span>
                    <span className="text-xs font-mono text-emerald-500 font-bold">Match: {Math.round(res.relevanceScore * 100)}%</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white hover:text-cyan-500 transition-colors">
                    {res.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-mono">
                    By {res.authors?.join(', ')} · DOI: {res.doi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semantic Scholar Graph & HNSW Similarity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Semantic Scholar Node */}
          {semanticGraph && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Semantic Scholar Citation Graph
              </h2>

              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 font-mono text-xs space-y-1">
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  {semanticGraph.citationCount} Citations ({semanticGraph.influentialCitationCount} Influential)
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[10px]">
                  Graph ID: {semanticGraph.semanticScholarId}
                </div>
              </div>
            </div>
          )}

          {/* Vector Embedding Similarity */}
          {vectorResult && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-500" /> HNSW Cosine Vector Embedding Similarity
              </h2>

              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs space-y-1">
                <div className="font-bold text-cyan-600 dark:text-cyan-400">
                  Model: {vectorResult.embeddingModel} ({vectorResult.vectorDimensions} dims)
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[10px]">
                  Metric: {vectorResult.distanceMetric}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
