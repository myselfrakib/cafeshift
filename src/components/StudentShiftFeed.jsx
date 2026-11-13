import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { Search, MapPin, Calendar, Clock, Sparkles, SlidersHorizontal, ArrowRight, Coffee, Utensils, Zap, Croissant, ShieldCheck } from 'lucide-react';

const SHIFT_CATEGORIES = [
  { id: 'all', name: 'All Roles', icon: '🐾' },
  { id: 'barista', name: 'Barista', icon: '☕' },
  { id: 'server', name: 'Table Server', icon: '🥪' },
  { id: 'rush', name: 'Rush Hour', icon: '⚡' },
  { id: 'bakery', name: 'Bakery/Brunch', icon: '🥐' },
  { id: 'cashier', name: 'Cashier', icon: '🦊' },
];

export default function StudentShiftFeed() {
  const { shifts, applyForShift, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'barista' && shift.roleName.toLowerCase().includes('barista')) ||
      (selectedCategory === 'server' && (shift.roleName.toLowerCase().includes('server') || shift.roleName.toLowerCase().includes('attendant'))) ||
      (selectedCategory === 'rush' && (shift.roleName.toLowerCase().includes('rush') || shift.roleName.toLowerCase().includes('acoustic'))) ||
      (selectedCategory === 'bakery' && (shift.roleName.toLowerCase().includes('brunch') || shift.roleName.toLowerCase().includes('bakery'))) ||
      (selectedCategory === 'cashier' && (shift.roleName.toLowerCase().includes('cashier') || shift.roleName.toLowerCase().includes('counter')));

    return matchesSearch && matchesArea && matchesWage && matchesCategory;
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
    <div className="space-y-6">
      
      {/* 1. Header Greeting Matching the Image Design ("Good Food Good Mood!" -> "Good Shifts Good Mood!") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 mb-1">
            <span>Hi, {currentUser?.name?.split(' ')[0]}</span>
            <span>👋</span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-bubble font-bold text-white tracking-tight">
            Good Shifts Good <span className="text-orange-400">Income!</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-white/70 bg-white/[0.05] border border-white/[0.08] px-3.5 py-1.5 rounded-2xl backdrop-blur-md">
          <span>Verified Minimum:</span>
          <strong className="text-orange-400">₹100/hr</strong>
          <span>·</span>
          <span>Shift:</span>
          <strong className="text-white">3+ hrs</strong>
        </div>
      </div>

      {/* 2. Search Bar Matching the Reference Image (Rounded pill with right sliders icon) */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search your favorite cafe or shift role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-12 py-3 text-xs sm:text-sm rounded-full glass-input placeholder-white/30 text-white focus:outline-none transition-all backdrop-blur-xl"
        />
        <button
          type="button"
          onClick={() => {
            // Toggle quick reset or cycle
            setSelectedArea('All');
            setMinWageFilter(0);
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Category Horizontal Row Matching the Reference Image (Burger, Pizza, Chicken, Fries...) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
        {SHIFT_CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] py-2.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'glass-pill-active scale-102 font-bold shadow-[0_8px_20px_rgba(255,107,0,0.35)]'
                  : 'glass-pill hover:bg-white/[0.1] text-white/60 hover:text-white'
              }`}
            >
              <span className="text-xl sm:text-2xl mb-1">{cat.icon}</span>
              <span className="text-[11px] whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Promotional Glass Card Matching the Reference Image ("Limited Time Offer" card) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
            <span>🔥</span>
            <span>Rush Hour Staffing Call</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bubble font-bold text-white">
            Park Street & Salt Lake Shifts
          </h3>
          <p className="text-xs text-white/60 max-w-md">
            Earn up to ₹150/hr this weekend! Shifts lock immediately once applied.
          </p>
        </div>

        <button
          onClick={() => { setSelectedArea('Park Street'); }}
          className="btn-orange-glow text-xs font-bold px-5 py-2.5 rounded-full shrink-0 shadow-lg"
        >
          Explore Park Street
        </button>

        {/* Ambient background glow inside card */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-orange-500/20 blur-2xl pointer-events-none"></div>
      </div>

      {/* 5. Locality Pills & Wage Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-white/40 font-medium shrink-0">Area:</span>
          {['All', 'Park Street', 'Southern Avenue', 'Salt Lake Sector 5', 'Hindustan Park'].map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedArea === area
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold'
                  : 'glass-pill text-white/60'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-white/40 font-medium">Min Pay:</span>
          {[0, 120, 140, 150].map(wage => (
            <button
              key={wage}
              onClick={() => setMinWageFilter(wage)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                minWageFilter === wage
                  ? 'bg-orange-500 text-white font-bold shadow-[0_2px_10px_rgba(255,107,0,0.4)]'
                  : 'glass-pill'
              }`}
            >
              {wage === 0 ? 'All' : `₹${wage}+`}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Shift Cards Grid Matching the Food Cards in the Image */}
      {filteredShifts.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mx-auto mb-3">
            ☕
          </div>
          <h3 className="text-lg font-bold font-bubble text-white">
            No Shifts Available in this Filter
          </h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto mt-1 mb-4">
            Shifts disappear once applied by other students. Try clearing your filters or check back shortly.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedArea('All'); setSelectedCategory('all'); setMinWageFilter(0); }}
            className="btn-orange-glow text-xs font-bold px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShifts.map(shift => (
            <div
              key={shift.id}
              className="glass-card rounded-3xl p-5 flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                {/* Header: Mascot badge & Open pill */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      {shift.cafeMascot || '☕'}
                    </div>
                    <div>
                      <h4 className="font-bubble font-bold text-sm text-white leading-tight">
                        {shift.cafeName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-white/50 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span>{shift.cafeArea}, Kolkata</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                    Open Shift
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="font-bubble text-base font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  {shift.roleName}
                </h3>

                {/* Date & Time pill */}
                <div className="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.06] mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-white font-medium">
                    <span className="flex items-center gap-1.5 text-white/80">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span>{shift.date}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-white/[0.08] text-orange-300 px-2 py-0.5 rounded-lg border border-white/[0.08]">
                      {shift.durationHours} hrs
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    <span>{shift.startTime} – {shift.endTime}</span>
                  </div>
                </div>

                {/* Perks Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {shift.perks?.slice(0, 3).map((perk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white/[0.05] text-white/70 px-2 py-0.5 rounded-lg border border-white/[0.06]"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Pay & Apply Action Button matching the image */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-white/40 block uppercase tracking-wider">
                    Total Pay
                  </span>
                  <div className="font-bubble text-lg font-bold text-orange-400 flex items-baseline gap-1">
                    <span>₹{shift.totalEarnings}</span>
                    <span className="text-[11px] font-sans font-normal text-white/50">
                      (₹{shift.hourlyWage}/hr)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyClick(shift)}
                  className="btn-orange-glow text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal in Dark Glass */}
      {confirmShift && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/[0.12] space-y-4 animate-pop">
            <div>
              <h3 className="text-xl font-bold font-bubble text-white">
                Confirm Shift Application
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Apply to work at <strong className="text-orange-400">{confirmShift.cafeName}</strong>
              </p>
            </div>

            <div className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.08] text-xs space-y-2">
              <div className="flex justify-between font-semibold text-white">
                <span>Role:</span>
                <span className="text-orange-300 font-bubble">{confirmShift.roleName}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Date & Time:</span>
                <span>{confirmShift.date} · {confirmShift.startTime} ({confirmShift.durationHours} hrs)</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Location:</span>
                <span>{confirmShift.cafeArea}, Kolkata</span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between font-bold text-white text-sm">
                <span>Total Payout:</span>
                <span className="text-orange-400 font-bubble">₹{confirmShift.totalEarnings} (₹{confirmShift.hourlyWage}/hr)</span>
              </div>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed">
              Upon confirmation, this listing will be <strong>marked booked and removed from public listings</strong>. The cafe owner will contact your registered phone (+91 {currentUser?.phone}) via Call or WhatsApp.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmShift(null)}
                className="flex-1 py-3 rounded-2xl glass-pill text-xs font-semibold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmApplication}
                className="flex-1 py-3 rounded-2xl btn-orange-glow text-xs font-bold shadow-md"
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
