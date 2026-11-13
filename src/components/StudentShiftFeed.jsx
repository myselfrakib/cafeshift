import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { Search, MapPin, Calendar, Clock, Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const KOLKATA_AREAS_FILTERS = [
  'All',
  'Park Street',
  'Salt Lake Sector 5',
  'Southern Avenue',
  'Hindustan Park',
  'Ballygunge'
];

export default function StudentShiftFeed() {
  const { shifts, applyForShift, isAttendant, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [minWageFilter, setMinWageFilter] = useState(0);
  const [confirmShift, setConfirmShift] = useState(null);

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
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search cafe, role, or area..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          {/* Area Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {KOLKATA_AREAS_FILTERS.map(area => {
              const count = area === 'All'
                ? availableShifts.length
                : availableShifts.filter(s => s.cafeArea === area).length;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                    selectedArea === area
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{area}</span>
                  <span className={`text-[10px] px-1 rounded-md ${
                    selectedArea === area ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hourly Pay Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-500">Hourly Pay:</span>
            {[0, 120, 140, 150].map(wage => (
              <button
                key={wage}
                onClick={() => setMinWageFilter(wage)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  minWageFilter === wage
                    ? 'bg-stone-900 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {wage === 0 ? 'All' : `₹${wage}+/hr`}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-stone-500">
            Showing <strong className="text-stone-900">{filteredShifts.length}</strong> available shifts
          </div>
        </div>
      </div>

      {/* Shifts Grid */}
      {filteredShifts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-stone-200">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center text-xl mx-auto mb-3">
            ☕
          </div>
          <h3 className="text-base font-bold text-stone-950 font-bubble">
            No Shifts Available in this Selection
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Shifts disappear once applied by other students. Try clearing your filters or check back shortly.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedArea('All'); setMinWageFilter(0); }}
            className="text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredShifts.map(shift => (
            <div
              key={shift.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-stone-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xl shrink-0">
                      {shift.cafeMascot || '☕'}
                    </div>
                    <div>
                      <h4 className="font-bubble font-bold text-sm text-stone-950 leading-tight">
                        {shift.cafeName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{shift.cafeArea}, Kolkata</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    Open Shift
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="font-bubble text-base font-bold text-stone-950 mb-3">
                  {shift.roleName}
                </h3>

                {/* Date & Time */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60 mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-stone-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>{shift.date}</span>
                    </span>
                    <span className="text-[11px] font-bold bg-white text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                      {shift.durationHours} hrs
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{shift.startTime} – {shift.endTime}</span>
                  </div>
                </div>

                {/* Perks */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {shift.perks?.slice(0, 3).map((perk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/60"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Pay & Apply Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 block uppercase tracking-wider">
                    Student Pay
                  </span>
                  <div className="font-bubble text-base font-bold text-stone-950 flex items-baseline gap-1">
                    <span>₹{shift.totalEarnings}</span>
                    <span className="text-[11px] font-sans font-normal text-stone-500">
                      (₹{shift.hourlyWage}/hr)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyClick(shift)}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-stone-200 space-y-4 animate-pop">
            <div>
              <h3 className="text-lg font-bold font-bubble text-stone-950">
                Confirm Shift Application
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Apply to work at <strong className="text-stone-900">{confirmShift.cafeName}</strong>
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-stone-900">
                <span>Role:</span>
                <span>{confirmShift.roleName}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Date & Time:</span>
                <span>{confirmShift.date} · {confirmShift.startTime} ({confirmShift.durationHours} hrs)</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Location:</span>
                <span>{confirmShift.cafeArea}, Kolkata</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-950 text-sm">
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
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApplication}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
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
