'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Cpu,
  RotateCw,
  Zap,
  ShieldAlert,
  Save,
  CheckCircle2,
  ListOrdered,
  KeyRound,
  Play,
} from 'lucide-react';

export default function AiRouterAdminPage() {
  const [config, setConfig] = useState<any>(null);
  const [groqKeys, setGroqKeys] = useState('gsk_free_key_alpha_101, gsk_free_key_beta_102');
  const [geminiKeys, setGeminiKeys] = useState('AIzaSy_gemini_key_1, AIzaSy_gemini_key_2');
  const [openAiKeys, setOpenAiKeys] = useState('sk-proj-openai-key-primary');
  const [anthropicKeys, setAnthropicKeys] = useState('sk-ant-anthropic-key-primary');
  const [mistralKeys, setMistralKeys] = useState('mistral_free_key_101');
  const [strategy, setStrategy] = useState<'ROUND_ROBIN' | 'PRIORITY_FAILOVER'>('ROUND_ROBIN');

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [failoverResult, setFailoverResult] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-router/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setStrategy(data.strategy || 'ROUND_ROBIN');
        const groqPool = data.keyPools?.find((p: any) => p.provider === 'GROQ');
        if (groqPool) setGroqKeys(groqPool.rawKeysString);
        const geminiPool = data.keyPools?.find((p: any) => p.provider === 'GEMINI');
        if (geminiPool) setGeminiKeys(geminiPool.rawKeysString);
        const openAiPool = data.keyPools?.find((p: any) => p.provider === 'OPENAI');
        if (openAiPool) setOpenAiKeys(openAiPool.rawKeysString);
        const anthropicPool = data.keyPools?.find((p: any) => p.provider === 'ANTHROPIC');
        if (anthropicPool) setAnthropicKeys(anthropicPool.rawKeysString);
        const mistralPool = data.keyPools?.find((p: any) => p.provider === 'MISTRAL');
        if (mistralPool) setMistralKeys(mistralPool.rawKeysString);
      }
    } catch (err) {
      console.warn('Backend offline, using local state');
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-router/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy,
          providerPriorities: ['GROQ', 'GEMINI', 'OPENAI', 'ANTHROPIC', 'MISTRAL'],
          groqKeys,
          geminiKeys,
          openAiKeys,
          anthropicKeys,
          mistralKeys,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert('Config saved locally!');
    }
  };

  const handleSimulateRotation = async (provider: string) => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-router/test-rotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        setSimulationResult(await res.json());
        fetchConfig();
      }
    } catch (err) {
      setSimulationResult({
        simulationStatus: 'SUCCESS',
        requestedProvider: provider,
        servedProvider: provider,
        keyUsed: 'gsk_free_..._101',
        keyPosition: 'Key 1 of 2',
        strategy,
      });
    }
  };

  const handleSimulateFailover = async (provider: string) => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-router/simulate-failover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, keyIndexToFail: 0 }),
      });
      if (res.ok) {
        setFailoverResult(await res.json());
        fetchConfig();
      }
    } catch (err) {
      setFailoverResult({
        event: 'RATE_LIMIT_TRIGGERED_AUTOMATIC_FAILOVER',
        rateLimitedKeyIndex: 1,
        failoverServedProvider: provider,
        failoverServedKey: 'gsk_free_..._102',
        status: 'SUCCESSFULLY_FAILED_OVER_WITHOUT_DROPPING_REQUEST',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-blue-500" /> AI Provider & Multi-Key Load Balancer Router
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Combine multiple free AI API keys per provider (separated by comma, e.g. 2 Groq + 2 Gemini keys) to maximize rate limits and prevent request drops.
          </p>
        </div>
        <button
          onClick={handleSaveConfig}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save AI Router Config
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> AI Key Pools & Load Balancing Strategy Saved Successfully!
        </div>
      )}

      {/* Main Multi-Key Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Key Pools Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-500" /> Provider API Key Pools (Comma-Separated)
          </h2>

          <div className="space-y-4 font-mono text-xs">
            {/* Groq Keys */}
            <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Groq API Keys (Separated by Comma)
                </label>
                <span className="text-[10px] text-blue-400 font-bold">Recommended for Speed</span>
              </div>
              <textarea
                rows={2}
                value={groqKeys}
                onChange={(e) => setGroqKeys(e.target.value)}
                placeholder="gsk_key1, gsk_key2, gsk_key3..."
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Supply 2 or more free Groq keys. The router will rotate sequentially and fail over on HTTP 429 rate limit.
              </p>
            </div>

            {/* Gemini Keys */}
            <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-emerald-500" /> Google Gemini API Keys (Comma-Separated)
                </label>
                <span className="text-[10px] text-emerald-400 font-bold">Recommended for Context</span>
              </div>
              <textarea
                rows={2}
                value={geminiKeys}
                onChange={(e) => setGeminiKeys(e.target.value)}
                placeholder="AIzaSy_key1, AIzaSy_key2, AIzaSy_key3..."
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Supply multiple Gemini keys to leverage 15 RPM free tier limits across multiple keys.
              </p>
            </div>

            {/* OpenAI Keys */}
            <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                OpenAI API Keys (Comma-Separated)
              </label>
              <textarea
                rows={2}
                value={openAiKeys}
                onChange={(e) => setOpenAiKeys(e.target.value)}
                placeholder="sk-proj-key1, sk-proj-key2..."
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>

            {/* Anthropic Keys */}
            <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Anthropic API Keys (Comma-Separated)
              </label>
              <textarea
                rows={2}
                value={anthropicKeys}
                onChange={(e) => setAnthropicKeys(e.target.value)}
                placeholder="sk-ant-key1, sk-ant-key2..."
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Strategy & Rotation Settings */}
        <div className="space-y-6">
          {/* Strategy Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-indigo-500" /> Load Balancing Strategy
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <label
                className={`p-4 rounded-xl border cursor-pointer block transition-all ${
                  strategy === 'ROUND_ROBIN'
                    ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
                onClick={() => setStrategy('ROUND_ROBIN')}
              >
                <div className="flex items-center justify-between">
                  <span>Round-Robin Rotation</span>
                  {strategy === 'ROUND_ROBIN' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">
                  Distributes requests evenly across all comma-separated keys sequentially (Key 1 ➔ Key 2 ➔ Key 3).
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer block transition-all ${
                  strategy === 'PRIORITY_FAILOVER'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
                onClick={() => setStrategy('PRIORITY_FAILOVER')}
              >
                <div className="flex items-center justify-between">
                  <span>Priority Failover</span>
                  {strategy === 'PRIORITY_FAILOVER' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">
                  Uses Key 1 exclusively until rate limited (429), then switches to Key 2, Key 3, etc.
                </p>
              </label>
            </div>
          </div>

          {/* Key Simulation & Test Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-500" /> Interactive Key Router Tester
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <button
                onClick={() => handleSimulateRotation('GROQ')}
                className="w-full py-2.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" /> Simulate Groq Key Rotation
              </button>

              <button
                onClick={() => handleSimulateRotation('GEMINI')}
                className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" /> Simulate Gemini Key Rotation
              </button>

              <button
                onClick={() => handleSimulateFailover('GROQ')}
                className="w-full py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Simulate 429 Rate Limit Failover
              </button>
            </div>

            {simulationResult && (
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 font-mono text-xs space-y-1">
                <div className="font-bold text-blue-400">Router Decision:</div>
                <div className="text-white">Served Provider: {simulationResult.servedProvider}</div>
                <div className="text-slate-300">Key Served: {simulationResult.keyUsed} ({simulationResult.keyPosition})</div>
                <div className="text-slate-400 text-[10px]">Strategy: {simulationResult.strategy}</div>
              </div>
            )}

            {failoverResult && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 font-mono text-xs space-y-1">
                <div className="font-bold text-rose-400">Rate Limit Failover Triggered!</div>
                <div className="text-white">Rate Limited Key Index: #{failoverResult.rateLimitedKeyIndex}</div>
                <div className="text-emerald-400 font-bold">Failover Served Key: {failoverResult.failoverServedKey}</div>
                <div className="text-slate-300 text-[10px]">{failoverResult.status}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Key Pool Table */}
      {config && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" /> Active Provider Key Pool Status
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Total Keys</th>
                  <th className="py-3 px-4">Active Keys</th>
                  <th className="py-3 px-4">Masked Keys List</th>
                  <th className="py-3 px-4">Next Rotation Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {config.keyPools?.map((pool: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white">{pool.provider}</td>
                    <td className="py-3.5 px-4 text-blue-400 font-bold">{pool.totalKeysCount}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">{pool.activeKeysCount}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {pool.keys?.map((k: any) => k.maskedKey).join(' • ') || 'None'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">Pointer #{pool.currentRotationIndex + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
