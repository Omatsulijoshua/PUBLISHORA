'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AdminApiService } from '../../services/adminApi';
import { Activity, RefreshCw, Server, Cpu } from 'lucide-react';

export default function SystemHealthAdminPage() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    AdminApiService.getSystemHealth().then(setHealth);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" /> All 45 Platform Engines Health Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Real-time latency, NestJS REST route mappings, and high-availability status for all 45 platform engines.
          </p>
        </div>
        <button
          onClick={() => AdminApiService.getSystemHealth().then(setHealth)}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Trigger System Audit
        </button>
      </div>

      {health && (
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/10 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-emerald-500">{health.systemStatus}</span>
            <span className="text-slate-400">Score: {health.healthScorePercent}%</span>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            {health.operationalModulesCount} / {health.totalModulesCount} Services Operational
          </div>
        </div>
      )}
    </div>
  );
}
