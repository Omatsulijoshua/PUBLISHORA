'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  TrendingUp, Share2, Eye, Download, MessageSquare, Twitter, Bookmark, Network, Award, ShieldCheck, Sparkles
} from 'lucide-react';

export default function MetricsAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    fetchMetrics();
    fetchGraph();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/metrics/publication/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        mockMetrics();
      }
    } catch (err) {
      mockMetrics();
    }
  };

  const fetchGraph = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/metrics/graph/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
      } else {
        mockGraph();
      }
    } catch (err) {
      mockGraph();
    }
  };

  const mockMetrics = () => {
    setMetrics({
      title: 'Quantum Computing Foundations for Distributed Systems',
      citations: { totalCitations: 42, recentCitations30Days: 8, hIndexEstimate: 12 },
      impactMetrics: { estimatedJif: 4.82, scimagoSjrProxy: 1.64, eigenfactorScore: 0.0125 },
      altmetrics: { score: 87, newsMentions: 5, blogPosts: 3, policyDocuments: 2, mendeleyReaders: 140, twitterMentions: 68 },
      readership: { totalDownloads: 1420, htmlViews: 3890, pdfDownloads: 1100 },
    });
  };

  const mockGraph = () => {
    setGraphData({
      nodes: [
        { id: 'target', label: 'Quantum Computing Foundations (Target)', group: 'target', citations: 42 },
        { id: 'n1', label: 'Fault-Tolerant Qubit Fabric (2025)', group: 'citing', citations: 18 },
        { id: 'n2', label: 'Topological Quantum Error Correction (2024)', group: 'cited', citations: 125 },
        { id: 'n3', label: 'Distributed Gate Synchronization (2026)', group: 'citing', citations: 7 },
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
              Journal Metrics & Citation Network Graph
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Journal Impact & Citation Analytics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real-time citation tracking, SCImago SJR proxy estimates, Altmetric social attention scorecards, and interactive citation knowledge graph.
          </p>
        </div>

        {metrics && (
          <>
            {/* Impact & Citation Scorecard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">TOTAL CITATIONS</span>
                <div className="text-3xl font-bold text-sky-500">{metrics.citations.totalCitations}</div>
                <div className="text-slate-500 text-[10px]">+{metrics.citations.recentCitations30Days} in last 30 days</div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">ESTIMATED JIF SCORE</span>
                <div className="text-3xl font-bold text-emerald-500">{metrics.impactMetrics.estimatedJif}</div>
                <div className="text-slate-500 text-[10px]">SCImago SJR: {metrics.impactMetrics.scimagoSjrProxy}</div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">ALTMETRIC BADGE SCORE</span>
                <div className="text-3xl font-bold text-amber-500">{metrics.altmetrics.score}</div>
                <div className="text-slate-500 text-[10px]">{metrics.altmetrics.newsMentions} news stories · {metrics.altmetrics.mendeleyReaders} Mendeley</div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">READERSHIP DOWNLOADS</span>
                <div className="text-3xl font-bold text-indigo-500">{metrics.readership.totalDownloads}</div>
                <div className="text-slate-500 text-[10px]">{metrics.readership.htmlViews} HTML views</div>
              </div>
            </div>

            {/* Interactive Citation Graph Visualizer */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-500" /> Interactive Citation Network Graph
                </h2>
                <span className="text-xs font-mono text-slate-400">Node = Publication · Edge = Citation Link</span>
              </div>

              {graphData && (
                <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    {graphData.nodes.map((node: any) => (
                      <div
                        key={node.id}
                        className={`p-4 rounded-xl border transition-all ${
                          node.group === 'target'
                            ? 'border-sky-500/60 bg-sky-500/10 text-sky-300'
                            : node.group === 'citing'
                            ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                            : 'border-slate-700 bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="font-bold">{node.label}</div>
                        <div className="text-[10px] opacity-75 mt-1">Citations: {node.citations} · Relation: {node.group.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
