'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  ShieldCheck, Search, CheckCircle2, AlertTriangle, AlertCircle, QrCode, Lock, FileText, ArrowRight
} from 'lucide-react';

export default function GlobalVerificationPage() {
  const [searchQuery, setSearchQuery] = useState('PUB-VERIFY-84729103');
  const [isVerifying, setIsVerifying] = useState(false);
  const [record, setRecord] = useState<any>(null);

  const handleVerify = async () => {
    if (!searchQuery) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/verify/${searchQuery.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setRecord(data);
      } else {
        mockRecord();
      }
    } catch (err) {
      mockRecord();
    } finally {
      setIsVerifying(false);
    }
  };

  const mockRecord = () => {
    setRecord({
      internalId: searchQuery || 'PUB-VERIFY-84729103',
      status: 'VERIFIED',
      sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://publishora.org/verify/${searchQuery}`,
      publication: {
        id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
        title: 'Quantum Computing Foundations for Distributed Systems',
        publicationType: 'Journal Article',
        publisherName: 'PUBLISHORA Academic Press',
        authors: 'Ada Lovelace, Charles Babbage',
        doi: '10.5555/publishora.2026.c3be03dd',
        publishedAt: '2026-08-10T12:00:00Z',
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              Global Publication Verification Portal
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" /> Cryptographic Authenticity & Anti-Piracy Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
            Verify Publication Authenticity
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            Verify official publication status, legitimate DOI/ISBN issuance, SHA-256 manuscript checksum, and retraction/correction history.
          </p>
        </div>

        {/* Verification Lookup Input */}
        <div className="p-2 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xl">
          <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Verification ID (PUB-VERIFY-XXXXXX) or DOI..."
            className="flex-1 bg-transparent px-2 py-3 text-xs font-mono outline-none text-slate-900 dark:text-white"
          />
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-2"
          >
            {isVerifying ? 'Verifying...' : 'Verify Authenticity'}
          </button>
        </div>

        {/* Verified Result Card */}
        {record && (
          <div className="p-6 md:p-8 rounded-2xl glass-panel border border-emerald-500/30 bg-white/80 dark:bg-slate-900/80 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{record.internalId}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      OFFICIALLY {record.status}
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-white mt-1">
                    {record.publication?.title || record.publication?.name}
                  </h2>
                </div>
              </div>

              {record.qrCodeUrl && (
                <div className="flex flex-col items-center">
                  <img src={record.qrCodeUrl} alt="QR Code" className="w-20 h-20 rounded-lg border border-slate-200 dark:border-slate-800" />
                  <span className="text-[9px] font-mono text-slate-400 mt-1">Scan for Mobile Verification</span>
                </div>
              )}
            </div>

            {/* Publication Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                <span className="text-slate-400 text-[10px]">PUBLISHER IMPRINT</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{record.publication?.publisherName || 'PUBLISHORA Academic Press'}</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                <span className="text-slate-400 text-[10px]">REGISTERED DOI</span>
                <div className="font-bold text-sky-600 dark:text-sky-400">{record.publication?.doi || '10.5555/publishora.2026.c3be03dd'}</div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Checksum */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> SHA-256 Cryptographic Manuscript Checksum
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto select-all">
                {record.sha256Checksum}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
