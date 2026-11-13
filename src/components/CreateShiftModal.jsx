import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const COMMON_PERKS = [
  'Free Specialty Coffee ☕',
  'Warm Meal / Snack 🥪',
  'Student Tip Share 💸',
  'Certificate of Cafe Experience 📜',
  'Commute Allowance 🛺',
  'Fresh Pastry / Croissant 🥐'
];

export default function CreateShiftModal() {
  const {
    createShiftModalOpen,
    setCreateShiftModalOpen,
    activeCafe,
    ownerCafes,
    createShift,
    isSyncing
  } = useApp();

  const [cafeId, setCafeId] = useState(activeCafe?.id || ownerCafes[0]?.id || '');
  const [roleName, setRoleName] = useState('Evening Rush Attendant & Table Server');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState('16:00');
  const [durationHours, setDurationHours] = useState(3); // Minimum 3 hours required!
  const [hourlyWage, setHourlyWage] = useState(activeCafe?.minHourlyWage || 120); // Minimum 100 required!
  const [selectedPerks, setSelectedPerks] = useState([
    'Free Specialty Coffee ☕',
    'Warm Meal / Snack 🥪',
    'Student Tip Share 💸'
  ]);
  const [dressCode, setDressCode] = useState('Comfortable casuals + sneakers (Cafe apron provided)');
  const [notes, setNotes] = useState('Friendly, polite student who loves greeting guests and keeping tables tidy during rush hours.');

  const [error, setError] = useState('');

  if (!createShiftModalOpen) return null;

  const currentCafe = ownerCafes.find(c => c.id === cafeId) || activeCafe;
  const totalPay = durationHours * hourlyWage;

  const togglePerk = (perk) => {
    if (selectedPerks.includes(perk)) {
      setSelectedPerks(selectedPerks.filter(p => p !== perk));
    } else {
      setSelectedPerks([...selectedPerks, perk]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (durationHours < 3) {
      return setError('Shift duration must be at least 3 hours (as per student fair work standards)');
    }
    if (hourlyWage < 100) {
      return setError('Hourly wage must be at least ₹100/hr (Kolkata student fair wage)');
    }
    if (!date) {
      return setError('Please select a valid date');
    }

    await createShift({
      cafeId: currentCafe.id,
      roleName,
      date,
      startTime,
      durationHours: Number(durationHours),
      hourlyWage: Number(hourlyWage),
      perks: selectedPerks,
      dressCode,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      {/* Dark Glass Panel matching the reference image's detail screen */}
      <div className="relative glass-panel rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-white/[0.12] shadow-2xl">
        
        {/* Mobile Pull Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4"></div>

        {/* Close Button */}
        <button
          onClick={() => setCreateShiftModalOpen(false)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30 mb-2">
            <span>✨</span>
            <span>New Shift Offer</span>
          </div>
          <h2 className="text-2xl font-bold font-bubble text-white">
            Publish Shift at <span className="text-orange-400">{currentCafe?.name}</span>
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Enforce minimum ₹100/hr and minimum 3 hours. Shifts lock immediately once applied.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cafe selector if multiple */}
          {ownerCafes.length > 1 && (
            <div>
              <label className="text-xs font-bold text-white/80 block mb-1">Select Cafe</label>
              <select
                value={cafeId}
                onChange={e => setCafeId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl glass-input bg-[#1C1A22] text-white font-semibold"
              >
                {ownerCafes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.mascot} {c.name} ({c.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Name */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1">
              Shift Title / Work Role
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Evening Rush Attendant & Table Server"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl glass-input placeholder-white/30 text-white focus:outline-none"
            />
          </div>

          {/* Date and Starting Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl glass-input text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl glass-input text-white focus:outline-none"
              />
            </div>
          </div>

          {/* DURATION (MIN 3 HOURS) & HOURLY WAGE (MIN ₹100/HR) WITH STEPPERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-3xl bg-white/[0.04] border border-white/[0.08]">
            {/* Duration Stepper like [- 1 +] in image */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white">Shift Duration</label>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  Min 3 hrs
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.05] p-1 rounded-2xl border border-white/[0.08]">
                <button
                  type="button"
                  disabled={durationHours <= 3}
                  onClick={() => setDurationHours(prev => Math.max(3, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-xs text-white">
                  {durationHours} Hours
                </div>
                <button
                  type="button"
                  onClick={() => setDurationHours(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] font-bold text-white flex items-center justify-center text-sm transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hourly Wage */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white">Hourly Wage</label>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Min ₹100/hr
                </span>
              </div>
              <div className="flex items-center bg-white/[0.05] rounded-2xl border border-white/[0.08] overflow-hidden">
                <span className="px-3.5 py-2.5 text-xs font-bold bg-white/[0.06] text-orange-400">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={5}
                  required
                  value={hourlyWage}
                  onChange={e => setHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                  className="w-full px-3 py-2.5 text-xs text-white font-bold bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Student Payout Banner Matching the Reference Image Bottom Bar */}
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-orange-500/30">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
                Total Student Pay
              </span>
              <div className="text-lg font-bubble font-bold text-orange-400">
                ₹{hourlyWage}/hr × {durationHours} hrs = ₹{totalPay}
              </div>
            </div>
            <div className="text-2xl">💰</div>
          </div>

          {/* Perks */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1.5">
              Included Perks & Freebies
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PERKS.map(perk => {
                const isSelected = selectedPerks.includes(perk);
                return (
                  <button
                    type="button"
                    key={perk}
                    onClick={() => togglePerk(perk)}
                    className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                      isSelected
                        ? 'glass-pill-active font-semibold'
                        : 'glass-pill text-white/60 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {perk}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1">
              Instructions for Attendant
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl glass-input placeholder-white/30 text-white focus:outline-none"
              placeholder="e.g. Arrive 10 mins early, wear comfortable sneakers!"
            />
          </div>

          {/* Submit Button Styled exactly like "Add to Cart $6.49" button in the image */}
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-4 btn-orange-glow font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Publish Shift Offer (Total ₹{totalPay})</span>
          </button>
        </form>
      </div>
    </div>
  );
}
