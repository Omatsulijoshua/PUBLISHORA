'use client';

import React from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import { BrandShowcase } from '@/components/brand/BrandShowcase';
import {
  BookOpen, FileText, Award, ShieldCheck, Globe2, Sparkles, ArrowRight,
  CheckCircle, Lock, Cpu, Layers, HelpCircle, GraduationCap, Building2, User
} from 'lucide-react';

export default function Home() {
  const principles = [
    { title: "1. Global Access", desc: "Anyone can publish or prepare manuscripts from home." },
    { title: "2. Guided Assistance", desc: "Beginners receive step-by-step guidance." },
    { title: "3. Advanced Control", desc: "Experienced publishers have full workflow customization." },
    { title: "4. No AI Fabrication", desc: "AI assists writing; it never invents sources, data, or peer reviews." },
    { title: "5. Human Oversight", desc: "Editorial and peer-review decisions remain strictly human decisions." },
    { title: "6. Configurable Policies", desc: "Country & service availability is dynamically controlled by policy." },
    { title: "7. Honest Expectations", desc: "Zero false promises of guaranteed indexing, promotion, or citations." },
    { title: "8. Authorized Identifiers", desc: "ISBN, ISSN, & DOI issued only via official registration agencies." },
    { title: "9. Rights & Ownership", desc: "Author ownership is preserved with transparent licensing models." },
    { title: "10. Scalable Foundation", desc: "Engineered from day one for global expansion and multi-tenant scale." },
  ];

  const publicationTypes = [
    "Books", "E-books", "Academic Journal Articles", "Research Papers",
    "Conference Papers", "Theses & Dissertations", "Magazines", "Newsletters",
    "Newspapers", "Reports", "White Papers", "Manuals", "Guides",
    "Poetry", "Fiction", "Non-fiction", "Children's Books", "Biographies",
    "Technical Publications", "Organizational Publications"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="full" size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#principles" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Principles</a>
            <a href="#types" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Publication Types</a>
            <a href="#modes" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Dual Operating Modes</a>
            <a href="#brand-system" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Design System</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
              Sign In
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-6 py-20 md:py-28 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium academic-badge mb-6 shadow-sm">
              <Globe2 className="w-4 h-4 text-emerald-500" />
              Global Publishing & Preparation Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight mb-6 leading-tight">
              Create. Prepare. <span className="gradient-text">Publish. Share.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed mb-10">
              Everything you need to bring your work from your initial idea to publication — supporting both full press publishing and preparation mode worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-lg hover:shadow-sky-500/25 transition-all flex items-center justify-center gap-2">
                Start Publishing & Preparation <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#brand-system" className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Inspect Design Architecture
              </a>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/80 text-left">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">20+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Publication Schemas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">15 Roles</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">RBAC Fine Control</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">2 Modes</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Publishing & Preparation</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">100% Honest</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Zero Fake Identifiers</div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PRODUCT PRINCIPLES */}
        <section id="principles" className="px-6 py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">Phase 0 Foundations</span>
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">Core Product Principles</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Built around strict standards of integrity, transparency, and accessible technology.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {principles.map((p, i) => (
                <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/50 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs mb-3">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPORTED PUBLICATION TYPES */}
        <section id="types" className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">Extensible Schema Engine</span>
                <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">Supported Publication Formats</h2>
              </div>
              <span className="text-xs text-slate-500">Add new publication types dynamically without core rewrites.</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {publicationTypes.map((type, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:border-emerald-500/50 transition-colors">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND SYSTEM SHOWCASE */}
        <section id="brand-system" className="px-6 py-8">
          <BrandShowcase />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="glass-panel border-t border-slate-200 dark:border-slate-800 px-6 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="full" size="sm" />
            <span className="text-slate-400">|</span>
            <span>© 2026 PUBLISHORA Press. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Phase 1 Verification Complete</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Integrity Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
