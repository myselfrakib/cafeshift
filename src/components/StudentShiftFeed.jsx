import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { Search, MapPin, Calendar, Clock, IndianRupee, Sparkles, Filter, CheckCircle2, HeartHandshake, Coffee, ArrowRight, Train, Flame } from 'lucide-react';

const KOLKATA_METRO_HUBS = [
  { name: 'All Kolkata', area: 'All', icon: '📍' },
  { name: 'Park Street (Flurys Hub)', area: 'Park Street', icon: '🚇' },
  { name: 'Salt Lake IT (Sec 5)', area: 'Salt Lake Sector 5', icon: '💻' },
  { name: 'Southern Ave (Lakes)', area: 'Southern Avenue', icon: '🌳' },
  { name: 'Hindustan Park', area: 'Hindustan Park', icon: '🎨' },
  { name: 'Ballygunge & Gariahat', area: 'Ballygunge', icon: '🛍️' },
];

export default function StudentShiftFeed() {
  const { shifts, applyForShift, isAttendant, currentUser, setAuthModalOpen, setAuthInitialMode, firebaseConnected } = useApp();

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
      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
            <input
              type="text"
              placeholder="Search cafe name, role, Park Street, Salt Lake..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-amber-200 bg-amber-50/40 text-amber-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Kolkata Hub Pills (Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs no-scrollbar">
            {KOLKATA_METRO_HUBS.map(hub => {
              const count = hub.area === 'All'
                ? availableShifts.length
                : availableShifts.filter(s => s.cafeArea === hub.area).length;
              return (
                <button
                  key={hub.name}
                  onClick={() => setSelectedArea(hub.area)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedArea === hub.area
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-amber-100/70 hover:bg-amber-200 text-amber-900'
                  }`}
                >
                  <span>{hub.icon}</span>
                  <span>{hub.name}</span>
                  <span className={`text-[10px] px-1 rounded-full ${
                    selectedArea === hub.area ? 'bg-white/30 text-white' : 'bg-amber-200/80 text-amber-900'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wage Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-100 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5">
            <span className="font-bold text-amber-900 shrink-0">Hourly Pay:</span>
            {[0, 120, 140, 150].map(wage => (
              <button
                key={wage}
                onClick={() => setMinWageFilter(wage)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 ${
                  minWageFilter === wage
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {wage === 0 ? 'All (Min ₹100)' : `₹${wage}+/hr`}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-amber-800/80 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time Live: <strong className="text-amber-950">{filteredShifts.length}</strong> available shifts</span>
          </div>
        </div>
      </div>

      {/* SHIFTS FEED GRID (Responsive: 1 col mobile, 2 col tablet, 3 col desktop) */}
      {filteredShifts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-amber-200 shadow-sm">
          <div className="text-5xl mb-3 animate-wiggle inline-block">🐾☕</div>
          <h3 className="text-xl font-bubble font-bold text-amber-950">
            No Available Shifts Right Now
          </h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto mt-1 mb-4">
            Shifts applied by other students are removed instantly. Check back shortly as cafe owners add rush hour offers!
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedArea('All'); setMinWageFilter(0); }}
            className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredShifts.map(shift => (
            <div
              key={shift.id}
              className="group bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200/80 hover:border-amber-400 cute-card-shadow transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Header: Cafe Photo / Mascot & Locality */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {shift.cafePhotoUrl ? (
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-200 shadow-inner shrink-0">
                        <img src={shift.cafePhotoUrl} alt={shift.cafeName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                        {shift.cafeMascot || '☕'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bubble font-bold text-sm sm:text-base text-amber-950 leading-tight">
                        {shift.cafeName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>{shift.cafeArea}, Kolkata</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Open</span>
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="font-bubble text-base font-bold text-amber-950 mb-3 group-hover:text-amber-800 transition-colors">
                  {shift.roleName}
                </h3>

                {/* Date & Time pill */}
                <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/70 mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-amber-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>{shift.date}</span>
                    </span>
                    <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                      {shift.durationHours} hrs shift
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{shift.startTime} to {shift.endTime}</span>
                  </div>
                </div>

                {/* Perks Chips */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {shift.perks?.slice(0, 3).map((perk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-amber-50 text-amber-900 font-medium px-2 py-0.5 rounded-lg border border-amber-200/80"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Guaranteed Earnings & Apply Button */}
              <div className="pt-3 border-t border-amber-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">
                    Student Guaranteed Pay
                  </span>
                  <div className="font-bubble text-lg font-bold text-emerald-700 flex items-baseline gap-1">
                    <span>₹{shift.totalEarnings}</span>
                    <span className="text-[11px] font-sans font-normal text-amber-700">
                      (₹{shift.hourlyWage}/hr)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyClick(shift)}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <span>🐾</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION / APPLICATION MODAL (Responsive Bottom-Sheet on Mobile) */}
      {confirmShift && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-amber-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-t sm:border-2 border-amber-300 space-y-4 animate-pop">
            <div className="sm:hidden w-12 h-1.5 bg-amber-300 rounded-full mx-auto mb-2"></div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-3xl bg-amber-100 mx-auto flex items-center justify-center text-3xl shadow-inner border border-amber-200 mb-2 animate-bounce-small">
                {confirmShift.cafeMascot || '☕'}
              </div>
              <h3 className="text-xl font-bold font-bubble text-amber-950">
                Confirm Shift Application
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                You are applying to work at <strong className="text-amber-950">{confirmShift.cafeName}</strong>
              </p>
            </div>

            {/* Shift Summary Box */}
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-amber-950">
                <span>Role:</span>
                <span className="font-bubble">{confirmShift.roleName}</span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span>Date & Time:</span>
                <span className="font-semibold">{confirmShift.date} · {confirmShift.startTime} ({confirmShift.durationHours} hrs)</span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span>Location:</span>
                <span className="font-semibold">{confirmShift.cafeArea}, Kolkata</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Total Payout:</span>
                <span className="font-bubble">₹{confirmShift.totalEarnings} (₹{confirmShift.hourlyWage}/hr)</span>
              </div>
            </div>

            {/* Firebase notice */}
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Once confirmed, <strong>this shift is instantly removed from the public feed in Firebase</strong>.
                The owner of {confirmShift.cafeName} will be notified to contact you (+91 {currentUser?.phone}) directly!
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmShift(null)}
                className="flex-1 py-3 rounded-xl border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApplication}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
              >
                <span>Yes, Book Shift 🐾</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
