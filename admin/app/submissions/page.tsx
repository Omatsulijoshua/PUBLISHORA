'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AdminSubmission } from '../../types';
import { AdminApiService } from '../../services/adminApi';
import { FileText, Search, AlertCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);

  useEffect(() => {
    AdminApiService.getSubmissions().then(setSubmissions);
  }, []);

  const columns = [
    {
      header: 'Manuscript Title & Author',
      cell: (sub: AdminSubmission) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{sub.title}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            Author: {sub.authorName} • Submitted: {formatDate(sub.submittedAt)}
          </div>
        </div>
      ),
    },
    {
      header: 'Target Journal',
      cell: (sub: AdminSubmission) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {sub.journalTitle}
        </span>
      ),
    },
    {
      header: 'Stage',
      cell: (sub: AdminSubmission) => <StatusBadge status={sub.stage} />,
    },
    {
      header: 'Integrity Scores',
      cell: (sub: AdminSubmission) => (
        <div className="font-mono text-[11px] space-y-0.5">
          <div className="text-slate-400">
            Plagiarism: <span className="text-emerald-500 font-bold">{sub.plagiarismSimilarityPercent}%</span>
          </div>
          <div className="text-slate-400">
            AI Generated: <span className="text-blue-500 font-bold">{sub.aiGeneratedScorePercent}%</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-500" /> Global Editorial & Peer Review Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Monitor real-time editorial screening, reviewer assignment bottlenecks, and integrity flags.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={submissions} />
    </div>
  );
}
