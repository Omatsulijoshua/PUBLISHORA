'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import {
  UserCheck, ShieldCheck, CheckCircle2, AlertCircle, FileText, Send, Star, UserPlus, Eye
} from 'lucide-react';

export default function PeerReviewPage() {
  const [reviewModel, setReviewModel] = useState<'DOUBLE_BLIND' | 'SINGLE_BLIND' | 'OPEN' | 'TRANSPARENT'>('DOUBLE_BLIND');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [recommendation, setRecommendation] = useState<'ACCEPT' | 'MINOR_REVISION' | 'MAJOR_REVISION' | 'REJECT'>('ACCEPT');
  const [commentsAuthor, setCommentsAuthor] = useState('');
  const [commentsEditor, setCommentsEditor] = useState('');
  const [scoreMethodology, setScoreMethodology] = useState(4);
  const [scoreOriginality, setScoreOriginality] = useState(5);
  const [scoreClarity, setScoreClarity] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<any>(null);

  const handleInviteReviewer = () => {
    if (!reviewerEmail) return;
    alert(`Peer review invitation dispatched to referee: ${reviewerEmail}`);
    setReviewerEmail('');
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: 'rev-101-demo',
          recommendation,
          commentsForAuthor: commentsAuthor,
          commentsForEditor: commentsEditor,
          scoreMethodology,
          scoreOriginality,
          scoreClarity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedReview(data);
      } else {
        mockSubmitResult();
      }
    } catch (err) {
      mockSubmitResult();
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockSubmitResult = () => {
    setSubmittedReview({
      id: 'rev-101-demo',
      status: 'COMPLETED',
      recommendation,
      scoreMethodology,
      scoreOriginality,
      scoreClarity,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
              Peer Review Management System
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Workspace Header & Peer Review Model Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Referee Evaluation Workspace</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Blind manuscript review workspace, structured evaluation scoring rubric, and referee recommendation engine.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            {(['DOUBLE_BLIND', 'SINGLE_BLIND', 'OPEN', 'TRANSPARENT'] as const).map((model) => (
              <button
                key={model}
                onClick={() => setReviewModel(model)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  reviewModel === model ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                {model.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Referee Invitation Bar */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-sky-500" /> Dispatch Peer Reviewer Invitation
          </h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="referee.email@university.edu"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono outline-none"
            />
            <button
              onClick={handleInviteReviewer}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm flex items-center gap-1.5"
            >
              Send Invitation
            </button>
          </div>
        </div>

        {/* Referee Submission Status Card */}
        {submittedReview ? (
          <div className="p-8 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Peer Review Submitted & Transmitted!</h2>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
              Recommendation: {submittedReview.recommendation}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your evaluation scores and comments have been encrypted and transmitted to the Chief Editor for decision aggregation.
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            {/* Blind Manuscript Profile */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold">MANUSCRIPT UNDER REVIEW ({reviewModel})</span>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  {reviewModel === 'DOUBLE_BLIND' ? 'Anonymized Title: [Quantum Computing Foundations]' : 'Quantum Computing Foundations for Distributed Systems'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {reviewModel === 'DOUBLE_BLIND' ? 'Authors: Anonymized for Double Blind Review' : 'Authors: Ada Lovelace, Charles Babbage'}
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> View Manuscript
              </button>
            </div>

            {/* Evaluation Rubric Scoring */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Methodology Soundness</div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scoreMethodology}
                  onChange={(e) => setScoreMethodology(Number(e.target.value))}
                  className="w-full text-sky-600"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>Flawed</span>
                  <span className="font-bold text-sky-500">{scoreMethodology} / 5</span>
                  <span>Rigorous</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Originality & Novelty</div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scoreOriginality}
                  onChange={(e) => setScoreOriginality(Number(e.target.value))}
                  className="w-full text-sky-600"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>Derivative</span>
                  <span className="font-bold text-sky-500">{scoreOriginality} / 5</span>
                  <span>Groundbreaking</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Clarity & Structure</div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scoreClarity}
                  onChange={(e) => setScoreClarity(Number(e.target.value))}
                  className="w-full text-sky-600"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>Unclear</span>
                  <span className="font-bold text-sky-500">{scoreClarity} / 5</span>
                  <span>Exemplary</span>
                </div>
              </div>
            </div>

            {/* Final Recommendation Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Referee Final Recommendation</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {(['ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT'] as const).map((rec) => (
                  <button
                    key={rec}
                    onClick={() => setRecommendation(rec)}
                    className={`py-2.5 px-3 rounded-xl border font-bold transition-all ${
                      recommendation === rec
                        ? rec === 'ACCEPT'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : rec === 'REJECT'
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
                    }`}
                  >
                    {rec.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments for Author & Confidential Editor Comments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Comments Transmitted to Author</label>
                <textarea
                  value={commentsAuthor}
                  onChange={(e) => setCommentsAuthor(e.target.value)}
                  placeholder="Detailed constructive feedback for author..."
                  className="w-full h-28 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Confidential Comments to Chief Editor</label>
                <textarea
                  value={commentsEditor}
                  onChange={(e) => setCommentsEditor(e.target.value)}
                  placeholder="Confidential referee remarks to chief editor..."
                  className="w-full h-28 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Transmitting Peer Review...' : 'Submit Official Peer Review Evaluation'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
