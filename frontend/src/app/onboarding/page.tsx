'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/brand/ThemeToggle';
import { AvailabilityBanner, AvailabilityData } from '@/components/onboarding/AvailabilityBanner';
import {
  Globe, User, BookOpen, Target, Award, HelpCircle, Cpu, Check, ArrowRight, ArrowLeft, Search, Sparkles
} from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada.lovelace@publishora.org',
    password: 'Password2026!',
    countryCode: 'NG',
    countryName: 'Nigeria',
    userTypes: ['Author', 'Researcher'],
    publicationFormats: ['Book', 'Journal Article'],
    publishingGoals: ['Academic promotion', 'Share knowledge'],
    experienceLevel: 'BEGINNER',
    guidancePreference: 'GUIDE_ME',
    aiWritingLevel: 'BALANCED',
    aiFeatures: ['Grammar and spelling', 'Academic proofreading', 'Citation assistance'],
  });

  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityData | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const countriesList = [
    { name: 'Nigeria', code: 'NG', flag: '🇳🇬', region: 'Africa' },
    { name: 'United States', code: 'US', flag: '🇺🇸', region: 'North America' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', region: 'Europe' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', region: 'North America' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪', region: 'Africa' },
    { name: 'Ghana', code: 'GH', flag: '🇬🇭', region: 'Africa' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪', region: 'Europe' },
    { name: 'India', code: 'IN', flag: '🇮🇳', region: 'Asia' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺', region: 'Oceania' },
    { name: 'Restricted Region Alpha', code: 'RA', flag: '🏳️', region: 'Global' },
  ];

  const userTypeOptions = [
    'Author', 'Researcher', 'Academic', 'Student', 'Writer', 'Journalist',
    'Poet', 'Blogger/Content Creator', 'Consultant', 'Business', 'Organization',
    'University', 'Publisher', 'Magazine Owner', 'Journal Owner', 'Other'
  ];

  const formatOptions = [
    'Fiction Book', 'Non-fiction Book', 'Textbook', 'Biography', 'Journal Article',
    'Research Paper', 'Conference Paper', 'Thesis / Dissertation', 'Magazine Issue',
    'Newsletter', 'White Paper', 'Company Report', 'Manual / Guide', 'Poetry Collection'
  ];

  const goalOptions = [
    'Personal publication', 'Academic promotion', 'Build reputation', 'Share knowledge',
    'Sell my work', 'Build an audience', 'Professional branding', 'Organizational publication',
    'Research recognition', 'Generate income', 'Degree / Career requirement'
  ];

  // Evaluate Availability when country change happens
  useEffect(() => {
    evaluateAvailability(formData.countryCode);
  }, [formData.countryCode]);

  const evaluateAvailability = async (code: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/availability/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode: code }),
      });
      if (res.ok) {
        const data = await res.json();
        setAvailabilityResult(data);
      } else {
        // Fallback mockup
        mockAvailabilityResult(code);
      }
    } catch (err) {
      mockAvailabilityResult(code);
    } finally {
      setIsEvaluating(false);
    }
  };

  const mockAvailabilityResult = (code: string) => {
    if (code === 'NG' || code === 'US' || code === 'GB' || code === 'CA' || code === 'DE' || code === 'AU') {
      setAvailabilityResult({
        countryCode: code,
        countryName: formData.countryName,
        status: 'FULLY_AVAILABLE',
        recommendedMode: 'PUBLISHING_MODE',
        headline: '🎉 Publishing is available',
        explanation: `Great news. Our publishing press services are currently available for your selected country (${formData.countryName}).`,
        publishingAllowed: true,
        preparationAllowed: true,
        printAllowed: true,
        digitalAllowed: true,
        peerReviewAllowed: true,
        userOptions: ['Publish with our press', 'Prepare and publish elsewhere', "I'm not sure"],
      });
    } else if (code === 'KE' || code === 'GH' || code === 'IN') {
      setAvailabilityResult({
        countryCode: code,
        countryName: formData.countryName,
        status: 'LIMITED',
        recommendedMode: 'PUBLISHING_MODE',
        headline: 'Publishing is partially available',
        explanation: `Digital publishing is operational in ${formData.countryName}, while print-on-demand is currently restricted.`,
        publishingAllowed: true,
        preparationAllowed: true,
        printAllowed: false,
        digitalAllowed: true,
        peerReviewAllowed: true,
        userOptions: ['Publish digital edition with our press', 'Prepare in Preparation Mode', 'Find print partner'],
      });
    } else {
      setAvailabilityResult({
        countryCode: code,
        countryName: formData.countryName,
        status: 'PREPARATION_ONLY',
        recommendedMode: 'PREPARATION_MODE',
        headline: 'Preparation Mode',
        explanation: `Our publishing services are not currently available for this publication in ${formData.countryName}. You can still prepare your work using our tools and publish through another publisher.`,
        publishingAllowed: false,
        preparationAllowed: true,
        printAllowed: false,
        digitalAllowed: true,
        peerReviewAllowed: false,
        userOptions: ['Continue in Preparation Mode', 'Find a Publisher', 'Change Publishing Country'],
      });
    }
  };

  const toggleSelection = (list: string[], item: string) => {
    if (list.includes(item)) {
      return list.filter((i) => i !== item);
    }
    return [...list, item];
  };

  const filteredCountries = countriesList.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const stepTitles = [
    'Account Details', 'Country Selection', 'User Category', 'Publication Types',
    'Publishing Goals', 'Experience Level', 'Guidance Mode', 'AI & Availability'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo variant="full" size="md" />
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Step {step} of 8 — {stepTitles[step - 1]}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Progress Bar Header */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5">
        <div
          className="bg-sky-600 dark:bg-sky-400 h-1.5 transition-all duration-300"
          style={{ width: `${(step / 8) * 100}%` }}
        />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        {/* STEP 1: ACCOUNT DETAILS */}
        {step === 1 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <User className="w-3.5 h-3.5" /> Step 1 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Create Your Account</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome to PUBLISHORA. Let&apos;s set up your profile to customize your preparation and publishing workspace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: COUNTRY SELECTION */}
        {step === 2 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <Globe className="w-3.5 h-3.5" /> Step 2 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Where are you publishing from?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your country helps us determine which publishing and distribution services are currently available to you.
            </p>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search country or code..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setFormData({ ...formData, countryCode: c.code, countryName: c.name })}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    formData.countryCode === c.code
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <div className="text-sm">{c.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{c.code} · {c.region}</div>
                    </div>
                  </div>
                  {formData.countryCode === c.code && <Check className="w-4 h-4 text-sky-500" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: USER TYPE */}
        {step === 3 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <User className="w-3.5 h-3.5" /> Step 3 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Which best describes you?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select all identity roles that apply to your publishing activities.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {userTypeOptions.map((type) => {
                const isSelected = formData.userTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, userTypes: toggleSelection(formData.userTypes, type) })}
                    className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                    }`}
                  >
                    <span>{type}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: WHAT ARE YOU PUBLISHING? */}
        {step === 4 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <BookOpen className="w-3.5 h-3.5" /> Step 4 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">What are you publishing?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select the publication types you plan to create, prepare, or submit.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formatOptions.map((fmt) => {
                const isSelected = formData.publicationFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    onClick={() => setFormData({ ...formData, publicationFormats: toggleSelection(formData.publicationFormats, fmt) })}
                    className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                    }`}
                  >
                    <span>{fmt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: WHY ARE YOU PUBLISHING? */}
        {step === 5 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <Target className="w-3.5 h-3.5" /> Step 5 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Why are you publishing?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your primary goals influence your personalized dashboard and publication recommendations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalOptions.map((goal) => {
                const isSelected = formData.publishingGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => setFormData({ ...formData, publishingGoals: toggleSelection(formData.publishingGoals, goal) })}
                    className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: EXPERIENCE LEVEL */}
        {step === 6 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <Award className="w-3.5 h-3.5" /> Step 6 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">What is your publishing experience level?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { level: 'BEGINNER', label: 'BEGINNER', desc: "I've never published before." },
                { level: 'INTERMEDIATE', label: 'INTERMEDIATE', desc: 'I have some publishing experience.' },
                { level: 'EXPERIENCED', label: 'EXPERIENCED', desc: 'I understand publishing workflows.' },
                { level: 'PROFESSIONAL', label: 'PROFESSIONAL', desc: 'I regularly publish/manage publications.' },
              ].map((item) => (
                <button
                  key={item.level}
                  onClick={() => setFormData({ ...formData, experienceLevel: item.level })}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    formData.experienceLevel === item.level
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold mb-1">{item.label}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-normal">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: HOW MUCH GUIDANCE? */}
        {step === 7 && (
          <div className="space-y-6 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge">
              <HelpCircle className="w-3.5 h-3.5" /> Step 7 of 8
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">How much guidance do you want?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { mode: 'GUIDE_ME', label: 'GUIDE ME', desc: 'Walk me through every step.' },
                { mode: 'ASSIST_ME', label: 'ASSIST ME', desc: 'Give me recommendations while I remain in control.' },
                { mode: 'FULL_CONTROL', label: 'FULL CONTROL', desc: "I know what I'm doing." },
              ].map((item) => (
                <button
                  key={item.mode}
                  onClick={() => setFormData({ ...formData, guidancePreference: item.mode })}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    formData.guidancePreference === item.mode
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold mb-1">{item.label}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-normal">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: AI PREFERENCES & AVAILABILITY RESULTS */}
        {step === 8 && (
          <div className="space-y-8 glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold academic-badge mb-2">
                <Cpu className="w-3.5 h-3.5" /> Step 8 of 8 — Setup Complete
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">AI Assistance & Availability Status</h2>
            </div>

            {/* AI Writing Intensity Level */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">AI Writing Intensity Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['MINIMAL', 'BALANCED', 'ADVANCED'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFormData({ ...formData, aiWritingLevel: lvl })}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                      formData.aiWritingLevel === lvl
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Publishing Availability Engine Output */}
            {availabilityResult && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Publishing Engine Availability for {formData.countryName} ({formData.countryCode})
                </h3>
                <AvailabilityBanner data={availabilityResult} onChangeCountry={() => setStep(2)} />
              </div>
            )}
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 8 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md flex items-center gap-2 transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => alert(`Onboarding Completed! Assigned Mode: ${availabilityResult?.recommendedMode}`)}
              className="px-8 py-3 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Complete Setup & Enter Platform
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
