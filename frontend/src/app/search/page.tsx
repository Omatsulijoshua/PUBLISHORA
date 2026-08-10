'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Search as SearchIcon, Network, Sparkles, Filter, CheckCircle2, ArrowRight, ExternalLink, BookOpen, Layers
} from 'lucide-react';

export default function GlobalSearchPage() {
  const [searchTerm, setSearchTerm] = useState('Quantum');
  const [activeTab, setActiveTab] = useState<'FULLTEXT' | 'SEMANTIC' | 'GRAPH'>('FULLTEXT');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [semanticResults, setSemanticResults] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    executeSearch();
  }, []);

  const executeSearch = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/search?query=${encodeURIComponent(searchTerm)}`);
      if (res.ok) setSearchResults(await res.json());

      const semRes = await fetch(`http://localhost:4000/api/v1/search/semantic?q=${encodeURIComponent(searchTerm)}`);
      if (semRes.ok) setSemanticResults(await semRes.json());

      const graphRes = await fetch(`http://localhost:4000/api/v1/search/graph/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51`);
      if (graphRes.ok) setGraphData(await graphRes.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setSearchResults({
      total: 2,
      facets: {
        journals: [{ name: 'PUBLISHORA Quantum Systems', count: 1 }, { name: 'PUBLISHORA Preprints', count: 1 }],
        years: [{ year: 2026, count: 2 }],
        licenses: [{ name: 'CC-BY 4.0', count: 2 }],
      },
      hits: [
        {
          id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
          title: 'Quantum Computing Foundations for Distributed Systems',
          abstract: 'We introduce a unified framework for topological quantum error correction across distributed nodes...',
          journal: 'PUBLISHORA Quantum Systems',
          year: 2026,
          doi: '10.5555/publishora.2026.001',
          authors: ['Ada Lovelace', 'Charles Babbage'],
          citationCount: 42,
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
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Global Search & Knowledge Graph Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Search Bar Input */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-inner">
            <SearchIcon className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, abstract, DOI, author, or dense vector concepts..."
              className="w-full bg-transparent text-sm outline-none text-slate-900 dark:text-white"
            />
            <button
              onClick={executeSearch}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
            >
              Search
            </button>
          </div>

          {/* Search Mode Toggles */}
          <div className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-mono">
            <button
              onClick={() => setActiveTab('FULLTEXT')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'FULLTEXT'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <SearchIcon className="w-3.5 h-3.5" /> Full-Text Facets
            </button>

            <button
              onClick={() => setActiveTab('SEMANTIC')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'SEMANTIC'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Dense Semantic Vectors (1536-D)
            </button>

            <button
              onClick={() => setActiveTab('GRAPH')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'GRAPH'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Citation Knowledge Graph
            </button>
          </div>
        </div>

        {/* View Mode 1: Full-Text Facets */}
        {activeTab === 'FULLTEXT' && searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Facets Sidebar */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-mono">
              <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-sky-500" /> Filter Facets
              </h3>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400">JOURNALS</span>
                {searchResults.facets?.journals?.map((j: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="truncate">{j.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">{j.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hits */}
            <div className="md:col-span-3 space-y-4">
              <span className="text-xs font-mono text-slate-400">{searchResults.total} Publications Found</span>
              {searchResults.hits?.map((hit: any) => (
                <div key={hit.id} className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
                    {hit.journal}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">{hit.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{hit.abstract}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode 2: Dense Semantic Vector Search */}
        {activeTab === 'SEMANTIC' && semanticResults && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Semantic Vector Cosine Similarity Search
            </h2>

            <div className="space-y-3">
              {semanticResults.results?.map((res: any) => (
                <div key={res.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4 text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{res.title}</div>
                    <div className="text-slate-500 mt-1">{res.journal} · {res.authors.join(', ')}</div>
                  </div>
                  <span className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                    Similarity: {(res.similarityScore * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode 3: Citation Knowledge Graph */}
        {activeTab === 'GRAPH' && graphData && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-500" /> Citation Knowledge Graph Traversal
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {graphData.nodes?.map((node: any) => (
                <div key={node.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{node.label}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {node.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
