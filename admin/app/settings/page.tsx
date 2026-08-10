'use client';

import React from 'react';
import { Settings, Globe, Key, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-500" /> Multi-Tenant & Platform System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
          Configure multi-tenant custom domains (CNAME verification), SSO / SAML 2.0 authentication, and global API keys.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 font-mono text-xs max-w-2xl">
        <div className="space-y-2">
          <label className="text-slate-400 font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" /> Platform Base URL Domain
          </label>
          <input
            type="text"
            defaultValue="https://publishora.org"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-slate-400 font-bold flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-500" /> Backend API Server URL
          </label>
          <input
            type="text"
            defaultValue="http://localhost:4000/api/v1"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
