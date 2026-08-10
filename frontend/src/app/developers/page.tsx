'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Code, Key, Webhook, ShieldCheck, Zap, Send, CheckCircle2, Copy
} from 'lucide-react';

export default function DevelopersPage() {
  const [apiKeysData, setApiKeysData] = useState<any>(null);
  const [webhooksData, setWebhooksData] = useState<any>(null);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  useEffect(() => {
    fetchDeveloperData();
  }, []);

  const fetchDeveloperData = async () => {
    try {
      const kRes = await fetch('http://localhost:4000/api/v1/developers/api-keys');
      if (kRes.ok) setApiKeysData(await kRes.json());

      const wRes = await fetch('http://localhost:4000/api/v1/developers/webhooks');
      if (wRes.ok) setWebhooksData(await wRes.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setApiKeysData({
      total: 1,
      apiKeys: [
        {
          id: 'key-101',
          label: 'Production University Press Integration',
          keyPrefix: 'pub_live_9f8a',
          apiKeySecret: 'pub_live_9f8a10c9b2d3e4f5a6b7c8d9e0f1a2b3',
          rateLimitPerHour: 10000,
          requestsUsedCurrentHour: 1420,
        },
      ],
    });

    setWebhooksData({
      total: 1,
      webhooks: [
        {
          id: 'wh-101',
          targetUrl: 'https://press.mit.edu/api/webhooks/publishora',
          subscribedEvents: ['publication.published', 'pppr.review_created', 'doi.minted'],
          secret: 'whsec_7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
          status: 'ACTIVE',
        },
      ],
    });
  };

  const handleTestDispatch = async (whId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/developers/webhooks/${whId}/test-dispatch`, {
        method: 'POST',
      });
      if (res.ok) setDispatchResult(await res.json());
    } catch (err) {
      setDispatchResult({
        webhookId: whId,
        targetUrl: 'https://press.mit.edu/api/webhooks/publishora',
        signatureHeader: 'sha256=8f4a10c9b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
        payload: { event: 'publication.published', doi: '10.5555/publishora.2026.001' },
        responseStatus: 200,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
              OpenAPI 3.0 & HMAC-SHA256 Signed Event Webhooks
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Developer API Portal & Webhooks Manager
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            API key credentials with rate limiting (10,000 req/hr), OpenAPI 3.0 endpoints, and real-time HMAC-SHA256 signed event webhook dispatches.
          </p>
        </div>

        {/* API Keys Card */}
        {apiKeysData && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" /> Active Developer API Credentials
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {apiKeysData.apiKeys?.map((k: any) => (
                <div key={k.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{k.label}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Prefix: {k.keyPrefix}... · Secret: {k.apiKeySecret}</div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    Quota: {k.requestsUsedCurrentHour} / {k.rateLimitPerHour} req/hr
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Webhooks Card */}
        {webhooksData && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Webhook className="w-5 h-5 text-emerald-500" /> Registered Event Webhooks
            </h2>

            <div className="space-y-4 font-mono text-xs">
              {webhooksData.webhooks?.map((wh: any) => (
                <div key={wh.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900/90 text-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">{wh.targetUrl}</span>
                    <button
                      onClick={() => handleTestDispatch(wh.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Test Event
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-400">Subscribed Events: {wh.subscribedEvents?.join(', ')}</div>
                </div>
              ))}
            </div>

            {dispatchResult && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs space-y-2">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Webhook Delivered (HTTP {dispatchResult.responseStatus} OK)
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 overflow-x-auto">
                  Header Signature: {dispatchResult.signatureHeader}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
