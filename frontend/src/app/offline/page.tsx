'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Wifi, WifiOff, Smartphone, Zap, RefreshCcw, Database, HardDrive, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function OfflinePage() {
  const [manifestData, setManifestData] = useState<any>(null);
  const [bandwidthData, setBandwidthData] = useState<any>(null);

  useEffect(() => {
    fetchOfflineData();
  }, []);

  const fetchOfflineData = async () => {
    try {
      const mRes = await fetch('http://localhost:4000/api/v1/offline/manifest.json');
      if (mRes.ok) setManifestData(await mRes.json());

      const bRes = await fetch('http://localhost:4000/api/v1/offline/bandwidth-status?type=2g');
      if (bRes.ok) setBandwidthData(await bRes.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setManifestData({
      name: 'PUBLISHORA — Global Publishing Platform',
      display: 'standalone',
      background_color: '#090d16',
      categories: ['education', 'academic', 'publishing'],
    });

    setBandwidthData({
      connectionType: '2g',
      isLowBandwidth: true,
      optimizationStrategy: 'ADAPTIVE_WEBP_AVIF_50_PERCENT_COMPRESSION',
      cachingStrategy: 'STALE_WHILE_REVALIDATE',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-medium">
              Progressive Web App (PWA) & 2G Low-Bandwidth Mode
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Offline Access & Network Resilience
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Workbox service worker cache strategies, IndexedDB offline manuscript sync, and adaptive 2G/3G low-bandwidth WebP image compression.
          </p>
        </div>

        {/* PWA & Low Bandwidth Status */}
        {bandwidthData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-slate-400">NETWORK CONNECTION MODE</span>
              <div className="text-xl font-serif font-bold text-cyan-500 flex items-center gap-2">
                <Wifi className="w-5 h-5" /> Low-Bandwidth Mode ({bandwidthData.connectionType?.toUpperCase()})
              </div>
              <p className="text-[11px] font-mono text-emerald-500">Adaptive Compression Active</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-slate-400">SERVICE WORKER CACHE</span>
              <div className="text-xl font-serif font-bold text-indigo-500 flex items-center gap-2">
                <HardDrive className="w-5 h-5" /> {bandwidthData.cachingStrategy}
              </div>
              <p className="text-[11px] font-mono text-slate-500">Workbox SW Strategy</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-slate-400">INDEXEDDB SYNC QUEUE</span>
              <div className="text-xl font-serif font-bold text-emerald-500 flex items-center gap-2">
                <Database className="w-5 h-5" /> 0 Conflicts Pending
              </div>
              <p className="text-[11px] font-mono text-slate-500">Background Sync Ready</p>
            </div>
          </div>
        )}

        {/* PWA Installation & Web App Manifest */}
        {manifestData && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-500" /> PWA Web App Manifest Status
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">{manifestData.name}</div>
                <div className="text-slate-500">Display Mode: {manifestData.display} · Theme Color: {manifestData.theme_color}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
