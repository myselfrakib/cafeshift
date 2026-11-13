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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        
        {/* Mobile Handle */}
        <div className="sm:hidden w-10 h-1 bg-stone-300 rounded-full mx-auto mb-3"></div>

        {/* Close Button */}
        <button
          onClick={() => setCreateShiftModalOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold font-bubble text-stone-950">
            Publish Shift Offer
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Post an open shift at <strong className="text-stone-900">{currentCafe?.name}</strong>. Shifts are locked immediately once a student applies.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cafe selector if multiple */}
          {ownerCafes.length > 1 && (
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">Select Cafe</label>
              <select
                value={cafeId}
                onChange={e => setCafeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold"
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
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Shift Title / Work Role
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Evening Rush Attendant & Table Server"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          {/* Date and Starting Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-medium"
              />
            </div>
          </div>

          {/* DURATION (MIN 3 HOURS) & HOURLY WAGE (MIN ₹100/HR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            {/* Duration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-900">Shift Duration</label>
                <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-1.5 py-0.2 rounded">
                  Min 3 hrs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={durationHours <= 3}
                  onClick={() => setDurationHours(prev => Math.max(3, prev - 1))}
                  className="w-9 h-9 rounded-lg bg-white border border-stone-200 font-bold text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-xs text-stone-900 bg-white py-2 rounded-lg border border-stone-200">
                  {durationHours} Hours
                </div>
                <button
                  type="button"
                  onClick={() => setDurationHours(prev => prev + 1)}
                  className="w-9 h-9 rounded-lg bg-white border border-stone-200 font-bold text-stone-800 hover:bg-stone-100 flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hourly Wage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-900">Hourly Wage</label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Min ₹100/hr
                </span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-lg border border-r-0 border-stone-200">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={5}
                  required
                  value={hourlyWage}
                  onChange={e => setHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                  className="w-full px-3 py-2 text-xs rounded-r-lg border border-stone-200 bg-white font-bold text-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Student Payout Banner */}
          <div className="bg-stone-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Total Student Pay for Shift
              </span>
              <div className="text-base font-bubble font-bold text-amber-200">
                ₹{hourlyWage}/hr × {durationHours} hrs = ₹{totalPay}
              </div>
            </div>
            <div className="text-xl">💰</div>
          </div>

          {/* Perks */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
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
                    className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
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
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Instructions for Attendant
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
              placeholder="e.g. Arrive 10 mins early, wear comfortable sneakers!"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Publish Shift on Chai & Paws</span>
          </button>
        </form>
      </div>
    </div>
  );
}
