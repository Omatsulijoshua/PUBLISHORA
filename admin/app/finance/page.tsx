'use client';

import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { AdminApiService } from '../../services/adminApi';
import { DollarSign, CreditCard, Award, FileSpreadsheet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function FinancePage() {
  const [financials, setFinancials] = useState<any>(null);

  useEffect(() => {
    AdminApiService.getFinancials().then(setFinancials);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-500" /> APC Billing & Author Royalties Financials
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
          Article Processing Charge (APC) invoices, institutional waivers, and book author royalty payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Net APC Revenue"
          value={financials ? formatCurrency(financials.totalApcRevenueUsd) : '$485,900.00'}
          change="+18.4%"
          icon={DollarSign}
        />
        <StatCard
          title="Author Royalty Payouts"
          value={financials ? formatCurrency(financials.authorRoyaltyPayoutsUsd) : '$68,400.00'}
          change="Paid YTD"
          icon={Award}
        />
        <StatCard
          title="Approved APC Waivers"
          value={financials ? financials.activeWaiversCount : 42}
          change="LMIC Authors"
          icon={CreditCard}
        />
      </div>
    </div>
  );
}
