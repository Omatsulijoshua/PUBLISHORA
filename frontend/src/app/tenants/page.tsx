'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Globe, ShieldCheck, Key, Lock, Palette, CheckCircle2, ArrowRight, Building2, Server
} from 'lucide-react';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/tenants');
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
      } else {
        mockTenants();
      }
    } catch (err) {
      mockTenants();
    }
  };

  const mockTenants = () => {
    setTenants([
      {
        id: 'tenant-mit-press',
        pressName: 'MIT Quantum Academic Press',
        subdomain: 'mitquantum',
        customDomain: 'press.mit.edu',
        domainStatus: 'ACTIVE_SSL',
        institutionName: 'Massachusetts Institute of Technology',
        primaryColor: '#A31F34',
        ssoConfig: {
          provider: 'SHIBBOLETH_SAML2',
          idpEntityId: 'https://idp.mit.edu/shibboleth',
          status: 'ENABLED',
        },
        apiKey: 'pub_live_mit_8472910384712049',
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
              Multi-Tenant Press Network & Whitelabel Platform
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Publisher Network & University Press Tenants
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Manage multi-tenant university presses, custom CNAME domain binding, automated SSL certificates, and enterprise SAML 2.0 / Shibboleth SSO integration.
          </p>
        </div>

        {/* Tenants List */}
        <div className="space-y-6">
          {tenants.map((t) => (
            <div key={t.id} className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xl">{t.pressName}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> CNAME & SSL Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" /> {t.institutionName}
                  </div>
                </div>
              </div>

              {/* Tenant Configurations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                {/* Domain & CNAME Status */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-500" /> CUSTOM PRESS DOMAIN
                  </span>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{t.customDomain}</div>
                  <div className="text-[10px] text-emerald-500 font-bold">Status: {t.domainStatus}</div>
                </div>

                {/* Enterprise SAML SSO */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-500" /> ENTERPRISE SINGLE SIGN-ON (SSO)
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white">{t.ssoConfig?.provider || 'SAML 2.0'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{t.ssoConfig?.idpEntityId}</div>
                </div>

                {/* Whitelabel API Key */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-500" /> ENTERPRISE API KEY
                  </span>
                  <div className="font-bold text-amber-600 dark:text-amber-400 text-xs truncate">{t.apiKey}</div>
                  <div className="text-[10px] text-slate-400">Rate Limit: 10,000 req/min</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
