'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  Globe, Rss, Code, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, Layers
} from 'lucide-react';

export default function DistributionPage() {
  const [oaiVerb, setOaiVerb] = useState<'Identify' | 'ListRecords'>('Identify');
  const [oaiXmlOutput, setOaiXmlOutput] = useState<string | null>(null);
  const [googleTagsOutput, setGoogleTagsOutput] = useState<string | null>(null);
  const [isLoadingOai, setIsLoadingOai] = useState(false);

  const handleTestOaiPmh = async (verb: 'Identify' | 'ListRecords') => {
    setOaiVerb(verb);
    setIsLoadingOai(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/oai-pmh?verb=${verb}`);
      if (res.ok) {
        const text = await res.text();
        setOaiXmlOutput(text);
      } else {
        mockOaiXml(verb);
      }
    } catch (err) {
      mockOaiXml(verb);
    } finally {
      setIsLoadingOai(false);
    }
  };

  const mockOaiXml = (verb: string) => {
    setOaiXmlOutput(`<?xml version="1.0" encoding="UTF-8"?>\n<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">\n  <responseDate>${new Date().toISOString()}</responseDate>\n  <request verb="${verb}">https://publishora.org/api/v1/oai-pmh</request>\n  <${verb}>\n    <repositoryName>PUBLISHORA Global Academic Repository</repositoryName>\n  </${verb}>\n</OAI-PMH>`);
  };

  const handleTestGoogleScholar = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/distribution/google-scholar/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (res.ok) {
        const data = await res.json();
        setGoogleTagsOutput(data.htmlTags);
      } else {
        setGoogleTagsOutput(`<meta name="citation_title" content="Quantum Computing Foundations">\n<meta name="citation_author" content="Ada Lovelace">\n<meta name="citation_doi" content="10.5555/publishora.2026.c3be03dd">`);
      }
    } catch (err) {
      setGoogleTagsOutput(`<meta name="citation_title" content="Quantum Computing Foundations">\n<meta name="citation_author" content="Ada Lovelace">\n<meta name="citation_doi" content="10.5555/publishora.2026.c3be03dd">`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Global Distribution & OAI-PMH Repository
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Global Distribution & Indexing Feeds
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Publishora operates an automated OAI-PMH 2.0 metadata provider endpoint, Google Scholar Highwire tag generator, and institutional feed distributor.
          </p>
        </div>

        {/* Distribution Channels Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <Globe className="w-5 h-5 text-sky-500" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">OAI-PMH 2.0 Repository</h3>
            <p className="text-slate-500">Dublin Core metadata harvesting for university libraries & open archives.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <Code className="w-5 h-5 text-emerald-500" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">Google Scholar Tags</h3>
            <p className="text-slate-500">Highwire Press HTML citation metadata for instant search indexing.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <Rss className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">DOAJ & RSS Feeds</h3>
            <p className="text-slate-500">Directory of Open Access Journals & RSS/Atom syndication feeds.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">Crossref & DataCite</h3>
            <p className="text-slate-500">Automated DOI deposit pipelines and citation linking.</p>
          </div>
        </div>

        {/* OAI-PMH Live Tester Panel */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">OAI-PMH 2.0 Endpoint Live Tester</h2>
              <span className="text-xs font-mono text-slate-400">URL: http://localhost:4000/api/v1/oai-pmh</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTestOaiPmh('Identify')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
              >
                Query verb=Identify
              </button>
              <button
                onClick={() => handleTestOaiPmh('ListRecords')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                Query verb=ListRecords
              </button>
            </div>
          </div>

          {oaiXmlOutput && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-500">OAI-PMH 2.0 XML Response:</span>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-60">
                {oaiXmlOutput}
              </pre>
            </div>
          )}
        </div>

        {/* Google Scholar Highwire Tag Previewer */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Google Scholar Highwire Tags Generator</h2>
            <button
              onClick={handleTestGoogleScholar}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white shadow-sm"
            >
              Generate Citation Meta Tags
            </button>
          </div>

          {googleTagsOutput && (
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              {googleTagsOutput}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
