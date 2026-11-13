import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { Search, MapPin, Calendar, Clock, ArrowRight, X, Check } from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

const KOLKATA_AREAS_FILTERS = [
  'All',
  'Park Street',
  'Salt Lake Sector 5',
  'Southern Avenue',
  'Hindustan Park',
  'Ballygunge'
];

export default function StudentShiftFeed() {
  const { shifts, applyForShift, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [minWageFilter, setMinWageFilter] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmShift, setConfirmShift] = useState(null);

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

  // KEY REQUIREMENT: Only OPEN shifts are visible to users. Once applied, status becomes 'booked' and it is immediately removed from this feed!
  const availableShifts = shifts.filter(s => s.status === 'open');

  const filteredShifts = availableShifts.filter(shift => {
    const matchesSearch =
      shift.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.cafeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.cafeArea.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea === 'All' || shift.cafeArea === selectedArea;
    const matchesWage = minWageFilter === 0 || shift.hourlyWage >= minWageFilter;

    return matchesSearch && matchesArea && matchesWage;
  });

  const handleApplyClick = (shift) => {
    setConfirmShift(shift);
  };

  const confirmApplication = () => {
    if (confirmShift) {
      applyForShift(confirmShift.id);
      setConfirmShift(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar Container */}
      <div className="bg-white rounded-[3px] p-3.5 sm:p-4 border border-stone-200 shadow-xs space-y-3">
        
        {/* 1. Category Pills: Locality Filters on Top */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {KOLKATA_AREAS_FILTERS.map(area => {
            const count = area === 'All'
              ? availableShifts.length
              : availableShifts.filter(s => s.cafeArea === area).length;
            return (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-[3px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                  selectedArea === area
                    ? 'bg-[#FF0046] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:text-black border border-stone-200'
                }`}
              >
                <span>{area}</span>
                <span className={`text-[10px] px-1 rounded-[2px] ${
                  selectedArea === area ? 'bg-black/20 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Search Bar Below with integrated 3-line Filter Button */}
        <div className="relative" ref={filterRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search cafe, shift role, or area..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-28 sm:pr-32 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
            />
            {/* 3-line Filter Button inside Search Bar */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className={`px-2.5 py-1.5 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border shadow-2xs ${
                  minWageFilter > 0 || filterOpen
                    ? 'bg-[#FF0046] text-white border-[#FF0046]'
                    : 'bg-white text-stone-700 hover:text-black hover:bg-stone-100 border-stone-200'
                }`}
                title="Filter by Hourly Pay"
              >
                {/* 3-Line Filter Icon */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="16" y2="12" />
                  <line x1="3" y1="18" x2="11" y2="18" />
                </svg>
                <span className="font-headline text-[11px]">
                  {minWageFilter > 0 ? `₹${minWageFilter}+` : 'Filter'}
                </span>
              </button>
            </div>
          </div>

          {/* Filter Popover Dropdown (Contains Hourly Pay Filter) */}
          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-[3px] shadow-2xl border border-stone-200 p-4 z-30 animate-pop">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#FF0046]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="16" y2="12" />
                    <line x1="3" y1="18" x2="11" y2="18" />
                  </svg>
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                    Hourly Pay Filter
                  </span>
                </div>
                {minWageFilter > 0 && (
                  <button
                    onClick={() => setMinWageFilter(0)}
                    className="text-[10px] text-[#FF0046] font-bold uppercase tracking-wider hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Wage Options */}
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

              {/* Footer action */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-500">
                  {filteredShifts.length} shifts match
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

        {/* 3. Sub-bar: Active Filter Chips & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-stone-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium">
              Showing <strong className="text-[#0A011C]">{filteredShifts.length}</strong> available shifts
            </span>
            {selectedArea !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-stone-200">
                <span>{selectedArea}</span>
                <button onClick={() => setSelectedArea('All')} className="hover:text-[#FF0046]">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {minWageFilter > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#FF0046]/10 text-[#FF0046] px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-[#FF0046]/20">
                <span>₹{minWageFilter}+/hr</span>
                <button onClick={() => setMinWageFilter(0)} className="hover:text-black">
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

          {(minWageFilter > 0 || selectedArea !== 'All' || searchTerm) && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedArea('All'); setMinWageFilter(0); }}
              className="text-[10px] text-stone-400 hover:text-[#FF0046] font-bold uppercase tracking-wider"
            >
              Clear all
            </button>
          )}
        </div>

      </div>

      {/* Shifts Grid */}
      {filteredShifts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-[3px] border border-dashed border-stone-200">
          <div className="w-12 h-12 rounded-[3px] bg-stone-100 text-[#FF0046] flex items-center justify-center text-xl mx-auto mb-3 border border-stone-200">
            ☕
          </div>
          <h3 className="text-base font-bold text-[#0A011C] font-headline uppercase tracking-wider">
            No Shifts Available in this Selection
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Shifts disappear once applied by other students. Try clearing your filters or check back shortly.
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
                      {shift.cafePhotoUrl ? (
                        <img src={shift.cafePhotoUrl} alt={shift.cafeName} className="w-full h-full object-cover" />
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
                <div className="flex flex-wrap gap-1 mb-4">
                  {shift.perks?.slice(0, 3).map((perk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-[2px] border border-stone-200 font-medium"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
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
                  onClick={() => handleApplyClick(shift)}
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

      {/* Confirmation Modal */}
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

            <div className="bg-stone-50 p-3.5 rounded-[3px] border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-[#0A011C] uppercase font-headline">
                <span>Role:</span>
                <span>{confirmShift.roleName}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Date & Time:</span>
                <span>{formatDateDDMMYYYY(confirmShift.date)} · {formatTime12Hour(confirmShift.startTime)} – {formatTime12Hour(confirmShift.endTime)} ({confirmShift.durationHours} hrs)</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Location:</span>
                <span>{confirmShift.cafeArea}, Kolkata</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-[#0A011C] text-sm font-headline">
                <span>Total Payment:</span>
                <span>₹{confirmShift.totalEarnings} (₹{confirmShift.hourlyWage}/hr)</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Upon confirmation, this listing will be <strong>marked booked and removed from public listings</strong>. The cafe owner will contact your registered phone (+91 {currentUser?.phone}) via Call or WhatsApp.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmShift(null)}
                className="flex-1 py-2.5 rounded-[3px] border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApplication}
                className="flex-1 py-2.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Confirm & Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
