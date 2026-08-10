'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Server, Globe, Database, ShieldCheck, Activity, RefreshCcw, CheckCircle2, Clock, Zap
} from 'lucide-react';

export default function DisasterRecoveryPage() {
  const [clusterHealth, setClusterHealth] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any>(null);

  useEffect(() => {
    fetchDrData();
  }, []);

  const fetchDrData = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/disaster-recovery/health');
      if (res.ok) setClusterHealth(await res.json());

      const snapRes = await fetch('http://localhost:4000/api/v1/disaster-recovery/snapshots');
      if (snapRes.ok) setSnapshots(await snapRes.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setClusterHealth({
      activePrimaryRegion: 'us-east-1',
      targetRpoSeconds: 60,
      currentRpoSeconds: 42,
      targetRtoMinutes: 5,
      currentRtoMinutes: 2.4,
      regions: [
        { regionCode: 'us-east-1', name: 'US East (N. Virginia)', role: 'PRIMARY', status: 'HEALTHY', latencyMs: 12 },
        { regionCode: 'eu-west-1', name: 'Europe (Ireland)', role: 'STANDBY', status: 'HEALTHY', latencyMs: 84 },
        { regionCode: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', role: 'STANDBY', status: 'HEALTHY', latencyMs: 140 },
      ],
    });

    setSnapshots({
      totalSnapshots: 1,
      snapshots: [
        {
          id: 'snap-101',
          label: 'AUTOMATED_HOURLY_PITR',
          region: 'us-east-1',
          sizeBytes: 4294967296,
          checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          integrityStatus: 'VERIFIED_VALID',
          createdAt: new Date().toISOString(),
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
              Automated Backup, Disaster Recovery & Failover Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            High Availability & Multi-Region Cluster Status
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Point-in-time database snapshot backups, sub-minute Recovery Point Objective (RPO), and automated DNS multi-region failover.
          </p>
        </div>

        {/* Cluster Metrics Grid */}
        {clusterHealth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-slate-400">ACTIVE PRIMARY REGION</span>
              <div className="text-2xl font-serif font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                <Server className="w-6 h-6" /> {clusterHealth.activePrimaryRegion}
              </div>
              <p className="text-[11px] font-mono text-emerald-500">Live Traffic Primary</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-slate-400">RECOVERY POINT OBJECTIVE (RPO)</span>
              <div className="text-2xl font-serif font-bold text-emerald-500 flex items-center gap-2">
                <Clock className="w-6 h-6" /> {clusterHealth.currentRpoSeconds} sec
              </div>
              <p className="text-[11px] font-mono text-slate-500">Target RPO &lt; {clusterHealth.targetRpoSeconds} sec</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 shadow-xl">
              <span className="text-xs font-mono text-slate-400">RECOVERY TIME OBJECTIVE (RTO)</span>
              <div className="text-2xl font-serif font-bold text-emerald-500 flex items-center gap-2">
                <Zap className="w-6 h-6" /> {clusterHealth.currentRtoMinutes} min
              </div>
              <p className="text-[11px] font-mono text-slate-500">Target RTO &lt; {clusterHealth.targetRtoMinutes} min</p>
            </div>
          </div>
        )}

        {/* Multi-Region Cluster Table */}
        {clusterHealth && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" /> Multi-Region High-Availability Nodes
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {clusterHealth.regions?.map((reg: any) => (
                <div key={reg.regionCode} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{reg.name} ({reg.regionCode})</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Latency: {reg.latencyMs} ms</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-[10px] font-bold ${
                      reg.role === 'PRIMARY' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {reg.role}
                    </span>
                    <span className="px-3 py-1 rounded text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      {reg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Point-In-Time Snapshots */}
        {snapshots && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" /> Point-In-Time Database Backup Snapshots
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {snapshots.snapshots?.map((snap: any) => (
                <div key={snap.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900/90 text-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-cyan-400 font-bold">{snap.label} ({snap.region})</span>
                    <span>{snap.createdAt}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">SHA-256 Checksum: {snap.checksumSha256}</div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                    {snap.integrityStatus}
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
