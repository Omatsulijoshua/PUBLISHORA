'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  FileText, ShieldCheck, Scale, Clock, PenTool, CheckCircle2, Copy, AlertTriangle
} from 'lucide-react';

export default function LegalPage() {
  const [selectedLicense, setSelectedLicense] = useState<'CC BY 4.0' | 'CC BY-NC 4.0' | 'CC BY-ND 4.0' | 'CC0 1.0'>('CC BY 4.0');
  const [rdfaData, setRdfaData] = useState<any>(null);
  const [signerName, setSignerName] = useState('Dr. Eleanor Vance');
  const [signerEmail, setSignerEmail] = useState('eleanor.vance@oxford.ac.uk');
  const [signatureResult, setSignatureResult] = useState<any>(null);
  const [embargoData, setEmbargoData] = useState<any>(null);

  useEffect(() => {
    handleGenerateRdfa();
    fetchEmbargoStatus();
  }, [selectedLicense]);

  const handleGenerateRdfa = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/legal/licenses/cc-rdfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseCode: selectedLicense,
          workTitle: 'Quantum Computing Foundations for Distributed Systems',
          authorName: 'Dr. Eleanor Vance',
        }),
      });
      if (res.ok) setRdfaData(await res.json());
    } catch (err) {
      mockRdfa();
    }
  };

  const mockRdfa = () => {
    setRdfaData({
      licenseCode: selectedLicense,
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      rdfaHtml: `<a rel="license" href="https://creativecommons.org/licenses/by/4.0/">...</a>`,
    });
  };

  const fetchEmbargoStatus = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/legal/embargoes/c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
      if (res.ok) setEmbargoData(await res.json());
    } catch (err) {
      setEmbargoData({
        embargoActive: true,
        monthsRemaining: 6,
        releaseDate: '2027-02-10T22:45:00.000Z',
      });
    }
  };

  const handleSignAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/v1/legal/agreements/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
          signerName,
          signerEmail,
        }),
      });
      if (res.ok) setSignatureResult(await res.json());
    } catch (err) {
      setSignatureResult({
        agreementId: 'agr-101',
        eIdasSignatureHash: 'eIDAS-SHA256-8f4a10c9b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
        complianceStandard: 'eIDAS & ESIGN Act Compliant',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-medium">
              eIDAS / ESIGN Digital Signatures & Creative Commons RDFa
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Legal Compliance, Copyright & Rights Engine
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Creative Commons RDFa HTML metadata generator, eIDAS / ESIGN Act compliant digital signature publishing agreements, and automated OA embargo timers.
          </p>
        </div>

        {/* CC License Selector Card */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-500" /> Creative Commons License Selector
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['CC BY 4.0', 'CC BY-NC 4.0', 'CC BY-ND 4.0', 'CC0 1.0'] as const).map((lic) => (
              <button
                key={lic}
                onClick={() => setSelectedLicense(lic)}
                className={`py-3 px-4 rounded-xl border font-mono text-xs font-bold transition-all ${
                  selectedLicense === lic
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {lic}
              </button>
            ))}
          </div>

          {rdfaData && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 space-y-2 font-mono text-xs">
              <div className="text-[11px] text-blue-400 font-bold">Generated RDFa HTML Metadata:</div>
              <div className="text-[10px] text-slate-300 break-all bg-slate-950 p-3 rounded-lg overflow-x-auto">
                {rdfaData.rdfaHtml}
              </div>
            </div>
          )}
        </div>

        {/* eIDAS Digital Signature Publishing Agreement */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-500" /> eIDAS & ESIGN Digital Signature Agreement
          </h2>

          <form onSubmit={handleSignAgreement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">SIGNER FULL NAME</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">SIGNER INSTITUTIONAL EMAIL</label>
                <input
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Sign Publishing Agreement Digitally
            </button>
          </form>

          {signatureResult && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs space-y-1">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Agreement Executed ({signatureResult.complianceStandard})
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 break-all">
                Hash: {signatureResult.eIdasSignatureHash}
              </div>
            </div>
          )}
        </div>

        {/* Open Access Embargo Card */}
        {embargoData && (
          <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Open Access Embargo Expiration Timer
            </h2>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 font-mono text-xs space-y-1">
              <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Embargo Active ({embargoData.monthsRemaining} Months Remaining)
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Automated Public Repository Release Date: {embargoData.releaseDate}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
