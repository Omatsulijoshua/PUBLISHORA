'use client';

import React, { useState } from 'react';
import { Palette, Type, Shield, CheckCircle2, Globe, Layers, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export const BrandShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'roles' | 'modes'>('tokens');

  const colorTokens = [
    { name: 'Imperial Sapphire (Brand 600)', hex: '#0270c7', usage: 'Primary CTA, Hero Highlights, Key Emblems' },
    { name: 'Sky Electric (Brand 400)', hex: '#38bdf8', usage: 'Dark Mode Highlights & Gradients' },
    { name: 'Academic Emerald', hex: '#10b981', usage: 'Verification Badges, Accepted Submissions' },
    { name: 'Preparation Amber', hex: '#f59e0b', usage: 'Preparation Mode Warnings & Draft Status' },
    { name: 'Deep Midnight Slate', hex: '#090d16', usage: 'Dark Theme Primary Background' },
  ];

  const rolesList = [
    'PUBLIC_USER', 'AUTHOR', 'RESEARCHER', 'ACADEMIC', 'EDITOR',
    'PEER_REVIEWER', 'JOURNAL_EDITOR', 'PUBLISHER_ADMIN', 'PRODUCTION_EDITOR',
    'DESIGNER', 'COPYEDITOR', 'UNIVERSITY_ADMIN', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 rounded-2xl glass-panel shadow-xl my-12 border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 1 — Brand System & Tokens
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            PUBLISHORA Identity Specification
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Global design system, curated color tokens, role access policies, and dual operating modes.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'tokens' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Tokens
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'typography' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> Typography
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'roles' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Roles (15)
          </button>
          <button
            onClick={() => setActiveTab('modes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'modes' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Dual Modes
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'tokens' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorTokens.map((token, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm">
              <div
                className="h-16 w-full rounded-lg mb-3 shadow-inner border border-black/10"
                style={{ backgroundColor: token.hex }}
              />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{token.name}</div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">{token.hex}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{token.usage}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
            <span className="text-xs font-mono text-sky-600 dark:text-sky-400 block mb-1">SERIF — Headlines & Academic Press</span>
            <div className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              Create. Prepare. Publish. Share.
            </div>
            <p className="text-xs text-slate-500 mt-2">Used for publication titles, section headings, landing headers, and editorial certificates.</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 block mb-1">SANS-SERIF — UI & Functional Reading</span>
            <div className="font-sans text-lg font-medium text-slate-800 dark:text-slate-200">
              Everything you need to bring your work from your idea to publication.
            </div>
            <p className="text-xs text-slate-500 mt-2">Used for document body, inputs, metadata panels, navigation, and workflow dashboards.</p>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            PUBLISHORA multi-role RBAC architecture supports user dynamic role accumulation (e.g. an Author can also be a Reviewer and University Admin).
          </p>
          <div className="flex flex-wrap gap-2">
            {rolesList.map((role) => (
              <span
                key={role}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'modes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Publishing Mode */}
          <div className="p-6 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">1. PUBLISHING MODE</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Activated when our publishing press is legally and operationally available for the user&apos;s country, publication type, and requested service.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-400">
              <li className="flex items-center gap-2">✓ Full Manuscript Submission & Editorial Review</li>
              <li className="flex items-center gap-2">✓ Legitimate DOI / ISBN / ISSN Assignment</li>
              <li className="flex items-center gap-2">✓ Global Press Distribution & Repository Indexing</li>
            </ul>
          </div>

          {/* Preparation Mode */}
          <div className="p-6 rounded-xl border-2 border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">2. PREPARATION MODE</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Activated when press publishing is unavailable in the selected region. Users can still create, AI-proofread, format, export, and prepare publication-ready work.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-400">
              <li className="flex items-center gap-2">✓ AI Proofreading, Formatting & Citations</li>
              <li className="flex items-center gap-2">✓ PDF/EPUB/JATS Export for External Publishing</li>
              <li className="flex items-center gap-2">✓ Honest Transparency — No Fake Press Claims</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
