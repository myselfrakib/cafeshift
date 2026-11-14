import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, X, Briefcase, Calendar, Clock, DollarSign, AlertCircle, Loader2, Check, Store, Sparkles, Plus, Award } from 'lucide-react';

const COMMON_REQUIREMENTS = [
  'Prior Barista / Espresso machine experience ☕',
  'Spoken English & Bengali fluency 🗣️',
  'Age 18+ college student / graduate 🎓',
  'Warm hospitality & pleasant customer etiquette 😊',
  'Basic POS billing / Cash handling knowledge 💳',
  'Punctual, hygienic & team player 🤝',
  'Able to work weekend peak hours ⚡'
];

const COMMON_JOB_PERKS = [
  'Free Daily Specialty Coffee & Staff Meals 🥪',
  'Equal Share in Monthly Cafe Tips 💸',
  'Performance Bonus & Monthly Incentives 🏆',
  'Official Cafe Experience Certificate 📜',
  'Paid Barista & Latte Art Training 🎓',
  'Flexible Exam Leaves for College Students 📚'
];

const POSITION_SUGGESTIONS = [
  'Head Barista',
  'Junior Barista',
  'Floor Supervisor',
  'Cafe Cashier / Billing',
  'Bakery & Pastry Chef',
  'Cafe Service Attendant',
  'Kitchen / Prep Assistant'
];

export default function CreateJobModal() {
  const {
    ownerCafes,
    activeCafe,
    createJobModalOpen,
    setCreateJobModalOpen,
    createJob,
    isSyncing
  } = useApp();

  const [cafeId, setCafeId] = useState(activeCafe?.id || '');
  const [positionTitle, setPositionTitle] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [salaryAmount, setSalaryAmount] = useState(15000);
  const [salaryPeriod, setSalaryPeriod] = useState('month'); // 'month' | 'week'
  const [startingDate, setStartingDate] = useState('Immediate');
  const [customDate, setCustomDate] = useState('');
  const [workSchedule, setWorkSchedule] = useState('6 days / week (1 day off)');
  const [workHours, setWorkHours] = useState('10:00 AM - 07:00 PM (8 hrs shift)');
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [customReq, setCustomReq] = useState('');
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [customPerk, setCustomPerk] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Sync active cafe
  useEffect(() => {
    if (activeCafe) {
      setCafeId(activeCafe.id);
    }
  }, [activeCafe]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (createJobModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setCreateJobModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      setIsSubmitting(false);
      submittingRef.current = false;
      setError('');
    }
  }, [createJobModalOpen, setCreateJobModalOpen]);

  if (!createJobModalOpen) return null;

  const currentCafe = ownerCafes.find(c => c.id === cafeId) || activeCafe;

  const toggleRequirement = (req) => {
    if (selectedRequirements.includes(req)) {
      setSelectedRequirements(selectedRequirements.filter(r => r !== req));
    } else {
      setSelectedRequirements([...selectedRequirements, req]);
    }
  };

  const handleAddCustomReq = (e) => {
    e.preventDefault();
    if (customReq.trim() && !selectedRequirements.includes(customReq.trim())) {
      setSelectedRequirements([...selectedRequirements, customReq.trim()]);
      setCustomReq('');
    }
  };

  const togglePerk = (perk) => {
    if (selectedPerks.includes(perk)) {
      setSelectedPerks(selectedPerks.filter(p => p !== perk));
    } else {
      setSelectedPerks([...selectedPerks, perk]);
    }
  };

  const handleAddCustomPerk = (e) => {
    e.preventDefault();
    if (customPerk.trim() && !selectedPerks.includes(customPerk.trim())) {
      setSelectedPerks([...selectedPerks, customPerk.trim()]);
      setCustomPerk('');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (submittingRef.current || isSubmitting) return;
    setError('');

    if (!positionTitle.trim()) {
      return setError('Please enter a job position / title');
    }
    if (!salaryAmount || Number(salaryAmount) < 1000) {
      return setError('Please enter a valid salary amount (min ₹1,000)');
    }

    const effectiveStartingDate = startingDate === 'Custom Date' && customDate ? customDate : startingDate;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await createJob({
        cafeId: currentCafe?.id,
        positionTitle: positionTitle.trim(),
        employmentType,
        salaryAmount: Number(salaryAmount),
        salaryPeriod,
        startingDate: effectiveStartingDate,
        workSchedule,
        workHours,
        requirements: selectedRequirements,
        perks: selectedPerks,
        description: description.trim()
      });

      // Reset form
      setPositionTitle('');
      setSelectedRequirements([]);
      setSelectedPerks([]);
      setDescription('');
    } catch (err) {
      setError(err?.message || 'Failed to publish job opening. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col w-screen h-screen overflow-y-auto animate-fade-in">
      
      {/* 1. Full-Screen Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setCreateJobModalOpen(false)}
              className="p-2 -ml-2 rounded-[3px] hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-headline text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0A011C] truncate">
                Post Cafe Job Opening
              </h1>
              <p className="text-[11px] sm:text-xs text-stone-700 font-medium truncate">
                {currentCafe ? `${currentCafe.name} · ${currentCafe.area}` : 'Calcutta Cafe Club'}
              </p>
            </div>
          </div>

          {/* Right: Publish Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCreateJobModalOpen(false)}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-[3px] border border-stone-200 text-stone-600 hover:bg-stone-100 font-headline text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isSyncing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-[3px] bg-[#FF0046] hover:bg-[#E0003E] active:bg-[#C00035] text-white font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting || isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Form Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-[3px] bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {/* Cafe Outlet Selection (if owner has multiple cafes) */}
          {ownerCafes.length > 1 && (
            <div className="p-4 rounded-[3px] bg-white border border-stone-200 shadow-2xs">
              <label className="block font-headline text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Hiring For Cafe Outlet
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ownerCafes.map(cafe => (
                  <button
                    key={cafe.id}
                    type="button"
                    onClick={() => setCafeId(cafe.id)}
                    className={`p-3 rounded-[3px] text-left border transition-all flex items-center gap-3 ${
                      cafeId === cafe.id
                        ? 'border-[#0A011C] bg-stone-900 text-white shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Store className={`w-4 h-4 shrink-0 ${cafeId === cafe.id ? 'text-[#00DADC]' : 'text-stone-400'}`} />
                    <div className="min-w-0">
                      <div className="font-bold text-xs uppercase tracking-tight truncate">{cafe.name}</div>
                      <div className={`text-[10px] truncate ${cafeId === cafe.id ? 'text-stone-300' : 'text-stone-700'}`}>{cafe.area}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Job Position Title */}
          <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                Job Position / Role Title <span className="text-[#FF0046]">*</span>
              </label>
              <span className="text-[11px] text-stone-600 font-medium">e.g. Head Barista</span>
            </div>

            <input
              type="text"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              placeholder="e.g. Head Barista, Floor Supervisor, Cafe Cashier..."
              className="w-full px-3.5 py-2.5 rounded-[3px] border border-stone-200 focus:border-[#0A011C] focus:ring-1 focus:ring-[#0A011C] text-sm text-[#0A011C] placeholder:text-stone-400 outline-none transition-all font-medium"
              required
            />

            {/* Quick Position Suggestions */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Quick Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {POSITION_SUGGESTIONS.map(pos => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPositionTitle(pos)}
                    className={`px-2.5 py-1 rounded-[3px] text-xs font-medium border transition-colors ${
                      positionTitle === pos
                        ? 'bg-[#0A011C] text-white border-[#0A011C]'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    + {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Employment Type & Starting Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Employment Type */}
            <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-3">
              <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                Employment Type <span className="text-[#FF0046]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Full-Time', 'Part-Time', 'Weekend Shifts', 'Internship'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEmploymentType(type)}
                    className={`py-2 px-3 rounded-[3px] text-xs font-headline font-bold uppercase tracking-wider border text-center transition-all ${
                      employmentType === type
                        ? 'bg-[#0A011C] text-white border-[#0A011C] shadow-2xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Starting Day / Joining Date */}
            <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-3">
              <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                Starting Day / Joining <span className="text-[#FF0046]">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {['Immediate', 'Next Monday', '1st of Month', 'Custom Date'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStartingDate(option)}
                    className={`py-2 px-3 rounded-[3px] text-xs font-medium border text-center transition-all ${
                      startingDate === option
                        ? 'bg-[#0A011C] text-white border-[#0A011C] font-bold shadow-2xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {option === 'Immediate' ? '⚡ Immediate' : option}
                  </button>
                ))}
              </div>

              {startingDate === 'Custom Date' && (
                <div className="pt-1">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-[3px] border border-stone-200 text-xs font-medium focus:border-[#0A011C] outline-none"
                    placeholder="Select specific starting date"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Salary & Period */}
          <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                  Salary / Compensation <span className="text-[#FF0046]">*</span>
                </label>
                <p className="text-[11px] text-stone-700">Competitive pay attracts Kolkata's best student talent</p>
              </div>
              <div className="font-headline font-bold text-lg text-[#0A011C]">
                ₹{Number(salaryAmount).toLocaleString('en-IN')} <span className="text-xs text-stone-700 uppercase">/ {salaryPeriod}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-[3px] border border-stone-200 focus:border-[#0A011C] focus:ring-1 focus:ring-[#0A011C] text-sm text-[#0A011C] font-semibold outline-none"
                  placeholder="15000"
                  required
                />
              </div>

              {/* Period selection */}
              <div className="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-[3px]">
                <button
                  type="button"
                  onClick={() => setSalaryPeriod('month')}
                  className={`py-1.5 px-2 rounded-[2px] text-xs font-headline font-bold uppercase tracking-wider transition-colors ${
                    salaryPeriod === 'month' ? 'bg-white text-[#0A011C] shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  / Month
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryPeriod('week')}
                  className={`py-1.5 px-2 rounded-[2px] text-xs font-headline font-bold uppercase tracking-wider transition-colors ${
                    salaryPeriod === 'week' ? 'bg-white text-[#0A011C] shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  / Week
                </button>
              </div>
            </div>

            {/* Quick salary presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 mr-1">Presets:</span>
              {[
                { label: '₹12,000/mo', amount: 12000, period: 'month' },
                { label: '₹15,000/mo', amount: 15000, period: 'month' },
                { label: '₹18,000/mo', amount: 18000, period: 'month' },
                { label: '₹22,000/mo', amount: 22000, period: 'month' },
                { label: '₹3,500/wk', amount: 3500, period: 'week' },
                { label: '₹4,500/wk', amount: 4500, period: 'week' }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setSalaryAmount(preset.amount);
                    setSalaryPeriod(preset.period);
                  }}
                  className="px-2.5 py-1 rounded-[2px] bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Work Schedule & Shift Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Work Schedule */}
            <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-2.5">
              <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                Work Schedule <span className="text-[#FF0046]">*</span>
              </label>
              <input
                type="text"
                value={workSchedule}
                onChange={(e) => setWorkSchedule(e.target.value)}
                placeholder="e.g. 6 days / week (1 day off)"
                className="w-full px-3.5 py-2 rounded-[3px] border border-stone-200 focus:border-[#0A011C] text-xs text-[#0A011C] font-medium outline-none"
              />
              <div className="flex flex-wrap gap-1">
                {['6 days / week', '5 days / week', 'Sat & Sun Only', 'Flexible 4 days'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setWorkSchedule(s)}
                    className="text-[10px] px-2 py-0.5 rounded-[2px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Shift Timings */}
            <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-2.5">
              <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                Daily Shift Hours <span className="text-[#FF0046]">*</span>
              </label>
              <input
                type="text"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="e.g. 10:00 AM - 07:00 PM"
                className="w-full px-3.5 py-2 rounded-[3px] border border-stone-200 focus:border-[#0A011C] text-xs text-[#0A011C] font-medium outline-none"
              />
              <div className="flex flex-wrap gap-1">
                {['Morning: 8 AM - 4 PM', 'Evening: 2 PM - 10 PM', 'Full: 10 AM - 7 PM', 'Flexible 6-8 hrs'].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setWorkHours(h)}
                    className="text-[10px] px-2 py-0.5 rounded-[2px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Requirements & Qualifications */}
          <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                  Role Requirements & Qualifications
                </label>
                <p className="text-[11px] text-stone-700">Click to toggle requirements students must meet</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-stone-100 text-stone-700">
                {selectedRequirements.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {COMMON_REQUIREMENTS.map((req) => {
                const isSelected = selectedRequirements.includes(req);
                return (
                  <button
                    key={req}
                    type="button"
                    onClick={() => toggleRequirement(req)}
                    className={`p-2.5 rounded-[3px] text-left text-xs font-medium border transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'border-[#0A011C] bg-stone-900 text-white shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-[2px] mt-0.5 flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-[#00DADC] border-[#00DADC] text-black' : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{req}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Requirement Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customReq}
                onChange={(e) => setCustomReq(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomReq(e)}
                placeholder="Type custom requirement & press Add..."
                className="flex-1 px-3 py-2 rounded-[3px] border border-stone-200 focus:border-[#0A011C] text-xs text-[#0A011C] outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomReq}
                className="px-3.5 py-2 rounded-[3px] bg-stone-800 hover:bg-stone-900 text-white font-headline text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Perks & Benefits */}
          <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
                  Included Perks & Staff Benefits
                </label>
                <p className="text-[11px] text-stone-700">Add benefits that make your cafe an irresistible workplace</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-stone-100 text-stone-700">
                {selectedPerks.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {COMMON_JOB_PERKS.map((perk) => {
                const isSelected = selectedPerks.includes(perk);
                return (
                  <button
                    key={perk}
                    type="button"
                    onClick={() => togglePerk(perk)}
                    className={`p-2.5 rounded-[3px] text-left text-xs font-medium border transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'border-[#0A011C] bg-stone-900 text-white shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-[2px] mt-0.5 flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-[#FF0046] border-[#FF0046] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{perk}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Perk Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customPerk}
                onChange={(e) => setCustomPerk(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomPerk(e)}
                placeholder="Type custom perk (e.g. Free staff discount on beans) & press Add..."
                className="flex-1 px-3 py-2 rounded-[3px] border border-stone-200 focus:border-[#0A011C] text-xs text-[#0A011C] outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomPerk}
                className="px-3.5 py-2 rounded-[3px] bg-stone-800 hover:bg-stone-900 text-white font-headline text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Job Description & Responsibilities */}
          <div className="p-5 rounded-[3px] bg-white border border-stone-200 shadow-2xs space-y-2">
            <label className="block font-headline text-xs font-bold uppercase tracking-wider text-[#0A011C]">
              Job Description & Responsibilities <span className="text-stone-700 text-[10px] lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe day-to-day duties, espresso bar operations, customer service expectations, or training details..."
              className="w-full px-3.5 py-2.5 rounded-[3px] border border-stone-200 focus:border-[#0A011C] focus:ring-1 focus:ring-[#0A011C] text-xs text-[#0A011C] placeholder:text-stone-400 outline-none resize-none font-medium"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 pb-12 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCreateJobModalOpen(false)}
              className="px-5 py-3 rounded-[3px] border border-stone-300 text-stone-700 hover:bg-stone-100 font-headline text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || isSyncing}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-[3px] bg-[#FF0046] hover:bg-[#E0003E] active:bg-[#C00035] text-white font-headline text-sm font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting || isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Job Opening...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job Opening</span>
                </>
              )}
            </button>
          </div>

        </form>
      </main>

    </div>
  );
}
