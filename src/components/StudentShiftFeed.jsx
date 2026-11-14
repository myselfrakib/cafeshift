import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Check,
  Briefcase,
  Store,
  DollarSign,
  GraduationCap,
  Sparkles,
  Phone,
  Send,
  Loader2
} from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function StudentShiftFeed() {
  const { shifts, jobs, applyForShift, applyForJob, currentUser, cafes } = useApp();

  const [feedMode, setFeedMode] = useState('shifts'); // 'shifts' | 'jobs'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [minWageFilter, setMinWageFilter] = useState(0);
  const [selectedJobType, setSelectedJobType] = useState('All'); // 'All' | 'Full-Time' | 'Part-Time' | 'Weekend Shifts' | 'Internship'
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Modals state
  const [confirmShift, setConfirmShift] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [applicationNote, setApplicationNote] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  const filterRef = useRef(null);

  // Close filter popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  // Timestamp helpers
  const getShiftTime = (s) => {
    if (!s) return 0;
    if (s.createdAt) {
      const t = new Date(s.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (s.id && typeof s.id === 'string' && s.id.startsWith('shift-')) {
      const t = parseInt(s.id.replace('shift-', ''));
      if (!isNaN(t)) return t;
    }
    return 0;
  };

  const getJobTime = (j) => {
    if (!j) return 0;
    if (j.createdAt) {
      const t = new Date(j.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (j.id && typeof j.id === 'string' && j.id.startsWith('job-')) {
      const t = parseInt(j.id.replace('job-', ''));
      if (!isNaN(t)) return t;
    }
    return 0;
  };

  // 1. Available Open Shifts
  const availableShifts = (shifts || []).filter(s => s.status === 'open');
  const sortedAvailableShifts = [...availableShifts].sort((a, b) => getShiftTime(b) - getShiftTime(a));

  const filteredShifts = sortedAvailableShifts.filter(shift => {
    const matchesSearch =
      shift.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.cafeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.cafeArea.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea === 'All' || shift.cafeArea === selectedArea;
    const matchesWage = minWageFilter === 0 || shift.hourlyWage >= minWageFilter;

    return matchesSearch && matchesArea && matchesWage;
  });

  // 2. Open Job Opportunities
  const availableJobs = (jobs || []).filter(j => j.status !== 'closed');
  const sortedAvailableJobs = [...availableJobs].sort((a, b) => getJobTime(b) - getJobTime(a));

  const filteredJobs = sortedAvailableJobs.filter(job => {
    const matchesSearch =
      job.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.cafeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.cafeArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requirements && job.requirements.some(r => r.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesArea = selectedArea === 'All' || job.cafeArea === selectedArea;
    const matchesType = selectedJobType === 'All' || job.employmentType === selectedJobType;

    return matchesSearch && matchesArea && matchesType;
  });

  const handleApplyShiftClick = (shift) => {
    setConfirmShift(shift);
  };

  const confirmShiftApplication = () => {
    if (confirmShift) {
      applyForShift(confirmShift.id);
      setConfirmShift(null);
    }
  };

  const handleApplyJobClick = (job) => {
    setApplyingJob(job);
    setApplicationNote('');
  };

  const confirmJobApplication = async () => {
    if (!applyingJob) return;
    setIsSubmittingJob(true);
    try {
      await applyForJob(applyingJob.id, applicationNote);
      setApplyingJob(null);
      setApplicationNote('');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TOP OPPORTUNITY TYPE SWITCHER (Hourly Shifts vs Job Opportunities) */}
      <div className="bg-white rounded-[3px] p-2 border border-stone-200 shadow-xs flex items-center justify-between gap-2">
        <div className="grid grid-cols-2 gap-2 flex-1 max-w-md">
          <button
            type="button"
            onClick={() => setFeedMode('shifts')}
            className={`py-2 px-3 rounded-[3px] font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              feedMode === 'shifts'
                ? 'bg-[#0A011C] text-white shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <span>⚡ Hourly Shifts</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
              feedMode === 'shifts' ? 'bg-[#FF0046] text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {availableShifts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFeedMode('jobs')}
            className={`py-2 px-3 rounded-[3px] font-headline text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              feedMode === 'jobs'
                ? 'bg-[#0A011C] text-white shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
          >
            <Briefcase className={`w-3.5 h-3.5 ${feedMode === 'jobs' ? 'text-[#00DADC]' : 'text-stone-400'}`} />
            <span>💼 Job Openings</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
              feedMode === 'jobs' ? 'bg-[#00DADC] text-black font-bold' : 'bg-stone-200 text-stone-700'
            }`}>
              {availableJobs.length}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium">Live Kolkata Opportunities</span>
        </div>
      </div>

      {/* 2. Search & Filter Bar Container */}
      <div className="bg-white rounded-[3px] p-3 sm:p-3.5 border border-stone-200 shadow-xs space-y-2.5">
        
        {/* Search Bar with integrated 3-line Filter Button */}
        <div className="relative" ref={filterRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder={feedMode === 'shifts' ? "Search cafe, shift role, or area..." : "Search job position, barista, cafe, or requirement..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-28 sm:pr-32 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-medium"
            />
            
            {/* 3-line Filter Button inside Search Bar */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className={`px-2.5 py-1.5 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border shadow-2xs ${
                  minWageFilter > 0 || selectedArea !== 'All' || selectedJobType !== 'All' || filterOpen
                    ? 'bg-[#FF0046] text-white border-[#FF0046]'
                    : 'bg-white text-stone-700 hover:text-black hover:bg-stone-100 border-stone-200'
                }`}
                title="Filter opportunities"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="16" y2="12" />
                  <line x1="3" y1="18" x2="11" y2="18" />
                </svg>
                <span className="font-headline text-[11px]">
                  {selectedArea !== 'All'
                    ? selectedArea.split(' ')[0]
                    : minWageFilter > 0
                    ? `₹${minWageFilter}+`
                    : selectedJobType !== 'All'
                    ? selectedJobType.split(' ')[0]
                    : 'Filter'}
                </span>
              </button>
            </div>
          </div>

          {/* Filter Popover Dropdown */}
          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-[3px] shadow-2xl border border-stone-200 p-4 z-30 animate-pop">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                    {feedMode === 'shifts' ? 'Shift Filters' : 'Job Filters'}
                  </span>
                </div>
                {(minWageFilter > 0 || selectedArea !== 'All' || selectedJobType !== 'All') && (
                  <button
                    onClick={() => {
                      setMinWageFilter(0);
                      setSelectedArea('All');
                      setSelectedJobType('All');
                    }}
                    className="text-[10px] text-[#FF0046] font-bold uppercase tracking-wider hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Wage Options (for shifts) */}
              {feedMode === 'shifts' ? (
                <div className="py-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
                    Minimum Hourly Wage (₹100/hr Guarantee)
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'All Rates', val: 0 },
                      { label: '₹100+/hr', val: 100 },
                      { label: '₹120+/hr', val: 120 },
                      { label: '₹140+/hr', val: 140 },
                      { label: '₹150+/hr', val: 150 },
                      { label: '₹160+/hr', val: 160 }
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => setMinWageFilter(item.val)}
                        className={`px-2.5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between border ${
                          minWageFilter === item.val
                            ? 'bg-[#0A011C] text-white border-[#0A011C]'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <span>{item.label}</span>
                        {minWageFilter === item.val && <Check className="w-3.5 h-3.5 text-[#00DADC]" />}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Employment Type Options (for jobs) */
                <div className="py-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
                    Employment Type
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['All', 'Full-Time', 'Part-Time', 'Weekend Shifts', 'Internship'].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedJobType(t)}
                        className={`px-2.5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between border ${
                          selectedJobType === t
                            ? 'bg-[#0A011C] text-white border-[#0A011C]'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <span>{t}</span>
                        {selectedJobType === t && <Check className="w-3.5 h-3.5 text-[#00DADC]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Locality Filter inside Popover */}
              <div className="py-2.5 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
                    Kolkata Locality
                  </span>
                  {selectedArea !== 'All' && (
                    <button
                      onClick={() => setSelectedArea('All')}
                      className="text-[10px] text-[#FF0046] font-bold uppercase tracking-wider hover:underline"
                    >
                      Clear Area
                    </button>
                  )}
                </div>
                <select
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 font-medium text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
                >
                  <option value="All">All Kolkata Areas</option>
                  {CALCUTTA_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Footer action */}
              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-500">
                  {feedMode === 'shifts' ? `${filteredShifts.length} shifts` : `${filteredJobs.length} jobs`} match
                </span>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="px-3.5 py-1.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bar: Active Filter Chips & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs text-stone-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium">
              Showing <strong className="text-[#0A011C]">{feedMode === 'shifts' ? filteredShifts.length : filteredJobs.length}</strong> {feedMode === 'shifts' ? 'available shifts' : 'job openings'}
            </span>
            {selectedArea !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-stone-200">
                <span>{selectedArea}</span>
                <button onClick={() => setSelectedArea('All')} className="hover:text-[#FF0046]">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {feedMode === 'shifts' && minWageFilter > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#FF0046]/10 text-[#FF0046] px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-[#FF0046]/20">
                <span>₹{minWageFilter}+/hr</span>
                <button onClick={() => setMinWageFilter(0)} className="hover:text-black">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {feedMode === 'jobs' && selectedJobType !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-[#0A011C] text-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold">
                <span>{selectedJobType}</span>
                <button onClick={() => setSelectedJobType('All')} className="hover:text-[#FF0046]">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-stone-200">
                <span>"{searchTerm}"</span>
                <button onClick={() => setSearchTerm('')} className="hover:text-[#FF0046]">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>

          {(minWageFilter > 0 || selectedArea !== 'All' || searchTerm || selectedJobType !== 'All') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedArea('All'); setMinWageFilter(0); setSelectedJobType('All'); }}
              className="text-[10px] text-stone-400 hover:text-[#FF0046] font-bold uppercase tracking-wider"
            >
              Clear all
            </button>
          )}
        </div>

      </div>

      {/* FEED MODE 1: HOURLY SHIFTS GRID */}
      {feedMode === 'shifts' && (
        <>
          {filteredShifts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-[3px] border border-dashed border-stone-200">
              <div className="w-12 h-12 rounded-[3px] bg-stone-100 text-[#FF0046] flex items-center justify-center text-xl mx-auto mb-3 border border-stone-200">
                ☕
              </div>
              <h3 className="text-base font-bold text-[#0A011C] font-headline uppercase tracking-wider">
                No Shifts Available in this Selection
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                Shifts disappear once booked by other students. Try resetting filters or check the Job Openings tab!
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedArea('All'); setMinWageFilter(0); }}
                className="text-xs font-bold uppercase tracking-wider text-white bg-[#0A011C] hover:bg-[#FF0046] px-4 py-2 rounded-[3px] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredShifts.map(shift => (
                <div
                  key={shift.id}
                  className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-stone-300 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-[3px] bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                          {shift.cafePhotoUrl || cafes?.find(c => c.id === shift.cafeId)?.photoUrl ? (
                            <img
                              src={shift.cafePhotoUrl || cafes?.find(c => c.id === shift.cafeId)?.photoUrl}
                              alt={shift.cafeName}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <span className="font-headline font-bold text-xs text-[#FF0046]">
                              {shift.cafeName ? shift.cafeName.slice(0, 2).toUpperCase() : '☕'}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-base text-[#0A011C] uppercase leading-tight tracking-tight">
                            {shift.cafeName}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#FF0046] shrink-0" />
                            <span>{shift.cafeArea}, Kolkata</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-[3px] shrink-0">
                        Open Shift
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="font-headline text-lg font-bold text-[#0A011C] mb-3 uppercase tracking-tight">
                      {shift.roleName}
                    </h3>

                    {/* Date & Time */}
                    <div className="bg-stone-50 rounded-[3px] p-3 border border-stone-200 mb-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#0A011C] font-bold font-headline uppercase">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          <span>{formatDateDDMMYYYY(shift.date)}</span>
                        </span>
                        <span className="text-[10px] font-bold bg-white text-stone-800 px-2 py-0.5 rounded-[2px] border border-stone-200">
                          {shift.durationHours} hrs
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{formatTime12Hour(shift.startTime)} – {formatTime12Hour(shift.endTime)}</span>
                      </div>
                    </div>

                    {/* Perks */}
                    {shift.perks && shift.perks.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {shift.perks.slice(0, 3).map((perk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-[2px] border border-stone-200 font-medium"
                          >
                            {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Pay & Apply Action */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider font-headline">
                        Student Pay
                      </span>
                      <div className="font-headline text-lg font-bold text-[#0A011C] flex items-baseline gap-1">
                        <span>₹{shift.totalEarnings}</span>
                        <span className="text-xs font-normal text-stone-500">
                          (₹{shift.hourlyWage}/hr)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyShiftClick(shift)}
                      className="bg-[#0A011C] hover:bg-[#FF0046] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FEED MODE 2: JOB OPPORTUNITIES GRID */}
      {feedMode === 'jobs' && (
        <>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-[3px] border border-dashed border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-[3px] bg-stone-100 text-[#00DADC] flex items-center justify-center text-xl mx-auto border border-stone-200">
                💼
              </div>
              <h3 className="text-base font-bold text-[#0A011C] font-headline uppercase tracking-wider">
                No Job Openings in this Selection
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Cafe owners post regular positions (Baristas, Supervisors, Cashiers) here. Try clearing filters.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedArea('All'); setSelectedJobType('All'); }}
                className="text-xs font-bold uppercase tracking-wider text-white bg-[#0A011C] hover:bg-[#FF0046] px-4 py-2 rounded-[3px] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredJobs.map(job => {
                const hasApplied = (job.applicants || []).some(
                  a => a.userId === currentUser?.id || a.email === currentUser?.email
                );

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-stone-300 shadow-xs transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Cafe Branding Header */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-11 rounded-[3px] bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                            {job.cafePhotoUrl || cafes?.find(c => c.id === job.cafeId)?.photoUrl ? (
                              <img
                                src={job.cafePhotoUrl || cafes?.find(c => c.id === job.cafeId)?.photoUrl}
                                alt={job.cafeName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="font-headline font-bold text-sm text-[#FF0046]">
                                {job.cafeName ? job.cafeName.slice(0, 2).toUpperCase() : '☕'}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-headline font-bold text-base text-[#0A011C] uppercase leading-tight tracking-tight">
                              {job.cafeName}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#FF0046] shrink-0" />
                              <span>{job.cafeArea}, Kolkata</span>
                            </div>
                          </div>
                        </div>

                        {/* Employment Type Tag */}
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A011C] text-white px-2 py-0.5 rounded-[2px] shrink-0">
                          {job.employmentType}
                        </span>
                      </div>

                      {/* Position Title */}
                      <h3 className="font-headline text-lg sm:text-xl font-bold text-[#0A011C] uppercase tracking-tight mb-2">
                        {job.positionTitle}
                      </h3>

                      {/* Schedule & Starting details */}
                      <div className="bg-stone-50 rounded-[3px] p-3 border border-stone-200 mb-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[#0A011C] font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            <span>{job.workSchedule}</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-[#00DADC]/20 text-[#006062]">
                            ⚡ Starts: {job.startingDate}
                          </span>
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          Timings: <strong className="text-stone-700">{job.workHours}</strong>
                        </div>
                      </div>

                      {/* Requirements Tags */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Requirements:</span>
                          <div className="flex flex-wrap gap-1">
                            {job.requirements.map(req => (
                              <span
                                key={req}
                                className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-[2px] border border-stone-200 font-medium"
                              >
                                ✓ {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Perks Tags */}
                      {job.perks && job.perks.length > 0 && (
                        <div className="mb-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Perks & Benefits:</span>
                          <div className="flex flex-wrap gap-1">
                            {job.perks.map(perk => (
                              <span
                                key={perk}
                                className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-[2px] font-medium"
                              >
                                ★ {perk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {job.description && (
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Salary & 1-Click Apply */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider font-headline">
                          Offered Salary
                        </span>
                        <div className="font-headline text-lg sm:text-xl font-bold text-[#FF0046] flex items-baseline gap-1">
                          <span>₹{Number(job.salaryAmount).toLocaleString('en-IN')}</span>
                          <span className="text-xs font-normal text-stone-500 uppercase font-sans">
                            / {job.salaryPeriod}
                          </span>
                        </div>
                      </div>

                      {hasApplied ? (
                        <div className="px-3.5 py-2 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-headline font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Applied · Under Review</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyJobClick(job)}
                          className="bg-[#0A011C] hover:bg-[#FF0046] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-[#00DADC]" />
                          <span>Apply for Job</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for HOURLY SHIFT */}
      {confirmShift && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-t-[3px] sm:rounded-[3px] max-w-md w-full p-5 sm:p-6 border border-stone-200 space-y-4 animate-pop shadow-2xl">
            <div>
              <h3 className="text-xl font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Confirm Shift Application
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Apply to work at <strong className="text-[#0A011C]">{confirmShift.cafeName}</strong>
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-[3px] border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-sm text-[#0A011C]">
                <span>{confirmShift.roleName}</span>
                <span className="text-[#FF0046]">₹{confirmShift.totalEarnings}</span>
              </div>
              <div className="text-stone-500 flex justify-between">
                <span>Date & Timing:</span>
                <span className="font-medium text-stone-700">{formatDateDDMMYYYY(confirmShift.date)} ({formatTime12Hour(confirmShift.startTime)})</span>
              </div>
              <div className="text-stone-500 flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-stone-700">{confirmShift.durationHours} hours</span>
              </div>
              <div className="text-stone-500 flex justify-between">
                <span>Location:</span>
                <span className="font-medium text-stone-700">{confirmShift.cafeArea}, Kolkata</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-[3px] border border-amber-200 text-xs text-amber-900 leading-relaxed">
              ⚠️ <strong>Instant Lock:</strong> Once you tap confirm, this shift locks exclusively for you and is removed from other students. The cafe owner will call you on <strong>+91 {currentUser?.phone}</strong>.
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmShift(null)}
                className="flex-1 py-2.5 rounded-[3px] border border-stone-200 text-stone-600 font-bold uppercase text-xs hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmShiftApplication}
                className="flex-1 py-2.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase text-xs tracking-wider shadow-sm"
              >
                Confirm & Lock Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal for JOB OPPORTUNITY */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-t-[3px] sm:rounded-[3px] max-w-lg w-full p-5 sm:p-6 border border-stone-200 space-y-4 animate-pop shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#0A011C] text-white">
                  {applyingJob.employmentType}
                </span>
                <h3 className="text-xl font-bold font-headline text-[#0A011C] uppercase tracking-tight mt-1">
                  Apply for {applyingJob.positionTitle}
                </h3>
                <p className="text-xs text-stone-500">
                  {applyingJob.cafeName} · {applyingJob.cafeArea}, Kolkata
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="p-1 rounded-[2px] hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation & Schedule Box */}
            <div className="bg-stone-50 p-3.5 rounded-[3px] border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-sm text-[#0A011C]">
                <span>Offered Salary</span>
                <span className="text-[#FF0046]">₹{Number(applyingJob.salaryAmount).toLocaleString('en-IN')} / {applyingJob.salaryPeriod}</span>
              </div>
              <div className="text-stone-500 flex justify-between">
                <span>Joining:</span>
                <span className="font-semibold text-stone-800">{applyingJob.startingDate}</span>
              </div>
              <div className="text-stone-500 flex justify-between">
                <span>Work Schedule:</span>
                <span className="font-semibold text-stone-800">{applyingJob.workSchedule}</span>
              </div>
            </div>

            {/* Candidate Profile Preview */}
            <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
                Your Shared Applicant Profile
              </span>
              <div className="grid grid-cols-2 gap-2 text-stone-700 font-medium">
                <div>Name: <strong className="text-stone-900">{currentUser?.name}</strong></div>
                <div>Phone: <strong className="text-stone-900">+91 {currentUser?.phone}</strong></div>
                <div>College: <strong className="text-stone-900">{currentUser?.college || 'Kolkata Student'}</strong></div>
                <div>Age: <strong className="text-stone-900">{currentUser?.age || 19}</strong></div>
              </div>
            </div>

            {/* Optional message to owner */}
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold uppercase tracking-wider text-[#0A011C]">
                Message to Cafe Manager <span className="text-stone-400 text-[10px] lowercase">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={applicationNote}
                onChange={(e) => setApplicationNote(e.target.value)}
                placeholder="Mention previous experience, availability, or barista passion..."
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 focus:border-[#0A011C] outline-none font-medium resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="flex-1 py-2.5 rounded-[3px] border border-stone-200 text-stone-600 font-bold uppercase text-xs hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmJobApplication}
                disabled={isSubmittingJob}
                className="flex-1 py-2.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase text-xs tracking-wider shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isSubmittingJob ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
