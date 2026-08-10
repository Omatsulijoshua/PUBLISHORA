'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export interface AvailabilityData {
  countryCode: string;
  countryName: string;
  status: 'FULLY_AVAILABLE' | 'LIMITED' | 'PREPARATION_ONLY' | 'UNAVAILABLE' | 'COMING_SOON';
  recommendedMode: 'PUBLISHING_MODE' | 'PREPARATION_MODE';
  headline: string;
  explanation: string;
  publishingAllowed: boolean;
  preparationAllowed: boolean;
  printAllowed: boolean;
  digitalAllowed: boolean;
  peerReviewAllowed: boolean;
  userOptions: string[];
}

interface AvailabilityBannerProps {
  data: AvailabilityData;
  onSelectOption?: (option: string) => void;
  onChangeCountry?: () => void;
}

export const AvailabilityBanner: React.FC<AvailabilityBannerProps> = ({
  data,
  onSelectOption,
  onChangeCountry,
}) => {
  const isAvailable = data.status === 'FULLY_AVAILABLE';
  const isLimited = data.status === 'LIMITED';
  const isPrepOnly = data.status === 'PREPARATION_ONLY';

  const badgeStyles = isAvailable
    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    : isLimited
    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
    : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all shadow-xl ${
      isAvailable
        ? 'border-emerald-500/40 bg-emerald-500/5'
        : isLimited
        ? 'border-amber-500/40 bg-amber-500/5'
        : 'border-sky-500/40 bg-sky-500/5'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {isAvailable ? (
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : isLimited ? (
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-500">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles} mb-1`}>
              <Sparkles className="w-3 h-3" />
              {data.status.replace('_', ' ')}
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
              {data.headline}
            </h3>
          </div>
        </div>

        {onChangeCountry && (
          <button
            onClick={onChangeCountry}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 underline"
          >
            <RefreshCw className="w-3 h-3" /> Change Country
          </button>
        )}
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        {data.explanation}
      </p>

      {/* Service Capability Checkbox Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-6 text-xs font-medium">
        <div className="flex items-center gap-2">
          {data.publishingAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />}
          <span>Full Press Publishing</span>
        </div>
        <div className="flex items-center gap-2">
          {data.preparationAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />}
          <span>Preparation Tools</span>
        </div>
        <div className="flex items-center gap-2">
          {data.digitalAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />}
          <span>Digital Distribution</span>
        </div>
        <div className="flex items-center gap-2">
          {data.printAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />}
          <span>Print-on-Demand</span>
        </div>
      </div>

      {/* User Option Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {data.userOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectOption && onSelectOption(opt)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              idx === 0
                ? 'bg-sky-600 hover:bg-sky-500 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <span>{opt}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
};
