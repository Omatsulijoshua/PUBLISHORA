'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  CreditCard, DollarSign, Tag, Award, CheckCircle2, ArrowRight, ShieldCheck, Download
} from 'lucide-react';

export default function BillingPage() {
  const [royaltyData, setRoyaltyData] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('PLAN_S_WAIVER_100');
  const [couponResult, setCouponResult] = useState<any>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/billing/royalties/user-101');
      if (res.ok) setRoyaltyData(await res.json());
    } catch (err) {
      mockData();
    }
  };

  const mockData = () => {
    setRoyaltyData({
      authorId: 'user-101',
      authorName: 'Dr. Ada Lovelace',
      totalEarned: 1420.00,
      currency: 'USD',
      payoutHistory: [
        { id: 'pay-1', amount: 500.00, date: '2026-07-15', status: 'COMPLETED', method: 'STRIPE_CONNECT' },
      ],
      pendingBalance: 920.00,
    });
  };

  const handleValidateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/v1/billing/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, originalApcAmount: 1800 }),
      });
      if (res.ok) {
        setCouponResult(await res.json());
      }
    } catch (err) {
      setCouponResult({
        code: couponCode,
        discountPercent: 100,
        originalAmount: 1800,
        discountAmount: 1800,
        finalAmount: 0,
        currency: 'USD',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              Financial Settlement, Subscriptions & Author Royalty Engine
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Billing & Author Royalty Ledger
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Track author book and paper sales royalties, institutional subscriptions, and apply APC Plan S waiver discount coupons.
          </p>
        </div>

        {/* Royalty Statement */}
        {royaltyData && (
          <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">AUTHOR ROYALTY EARNINGS</span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-500" /> ${royaltyData.totalEarned.toFixed(2)} USD
                </h2>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">PENDING PAYOUT BALANCE</span>
                <div className="text-xl font-mono font-bold text-emerald-500">
                  ${royaltyData.pendingBalance.toFixed(2)} USD
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white">Payout History</h3>
              {royaltyData.payoutHistory?.map((p: any) => (
                <div key={p.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
                  <span>Payout #{p.id} · {p.method}</span>
                  <span className="font-bold text-emerald-500">${p.amount.toFixed(2)} USD ({p.status})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APC Coupon Validator */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" /> APC Waiver & Discount Coupon Validator
          </h2>

          <form onSubmit={handleValidateCoupon} className="flex gap-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="e.g. PLAN_S_WAIVER_100"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              Validate Coupon
            </button>
          </form>

          {couponResult && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs space-y-1">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                Coupon Applied: {couponResult.code} ({couponResult.discountPercent}% OFF)
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Original APC: ${couponResult.originalAmount} ➔ Final APC: ${couponResult.finalAmount} {couponResult.currency}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
