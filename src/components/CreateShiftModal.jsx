import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, Sparkles, AlertCircle, IndianRupee, ShieldCheck, HeartHandshake, Loader2 } from 'lucide-react';

const COMMON_PERKS = [
  'Free Iced Caramel Coffee ☕',
  'Warm Chicken/Paneer Puff 🥪',
  'Student Tip Share 💸',
  'Certificate of Cafe Experience 📜',
  'Metro / Commute Allowance 🛺',
  'Dessert / Croissant on Shift 🥐'
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
  const [roleName, setRoleName] = useState('Evening Rush Attendant & Table Server 🐱');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState('16:00');
  const [durationHours, setDurationHours] = useState(3); // Minimum 3 hours required!
  const [hourlyWage, setHourlyWage] = useState(activeCafe?.minHourlyWage || 120); // Minimum 100 required!
  const [selectedPerks, setSelectedPerks] = useState([
    'Free Iced Caramel Coffee ☕',
    'Warm Chicken/Paneer Puff 🥪',
    'Student Tip Share 💸'
  ]);
  const [dressCode, setDressCode] = useState('Comfortable casuals + sneakers (Cute cafe apron provided)');
  const [notes, setNotes] = useState('Friendly, polite student who loves greeting guests and keeping tables tidy during rush hours!');

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
      return setError('Hourly wage must be at least ₹100/hr (Kolkata student minimum wage)');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-amber-950/50 backdrop-blur-sm overflow-y-auto">
      {/* Bottom sheet on mobile, rounded modal on tablet & desktop */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl border-t sm:border-2 border-amber-200/90 max-h-[92vh] overflow-y-auto">
        <div className="sm:hidden w-12 h-1.5 bg-amber-300 rounded-full mx-auto mb-3"></div>

        {/* Close Button */}
        <button
          onClick={() => setCreateShiftModalOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
            ☕✨
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-bubble text-amber-950">
              Create Shift Offer for Students
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Publish rush hour shifts at <span className="font-bold underline decoration-amber-400">{currentCafe?.name}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cafe Selector if owner has multiple */}
          {ownerCafes.length > 1 && (
            <div>
              <label className="text-xs font-bold text-amber-900 block mb-1">Select Cafe</label>
              <select
                value={cafeId}
                onChange={e => setCafeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-amber-50/50 font-bold text-amber-950"
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
            <label className="text-xs font-bold text-amber-900 block mb-1">
              Shift Title / Work Role
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Evening Rush Attendant & Table Server 🐱"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-amber-200 bg-white font-medium text-amber-950 focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[
                'Evening Rush Attendant 🐱',
                'Brunch Food Runner 🐰',
                'Table & Water Server 🐶',
                'Cashier & Order Mate 🦊'
              ].map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setRoleName(preset)}
                  className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Starting Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Select Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Starting Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white font-medium"
              />
            </div>
          </div>

          {/* DURATION (MIN 3 HOURS) & HOURLY WAGE (MIN ₹100/HR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
            {/* Duration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-amber-950">Shift Duration</label>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-200/80 px-1.5 py-0.5 rounded">
                  Min 3 hrs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={durationHours <= 3}
                  onClick={() => setDurationHours(prev => Math.max(3, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-amber-300 font-bold text-amber-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-100 flex items-center justify-center shadow-xs text-base active:scale-95"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-sm text-amber-950 bg-white py-2 rounded-xl border border-amber-200">
                  {durationHours} Hours
                </div>
                <button
                  type="button"
                  onClick={() => setDurationHours(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 flex items-center justify-center shadow-xs text-base active:scale-95"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-amber-800/80 mt-1">
                Starting {startTime} to finish after {durationHours} hrs
              </p>
            </div>

            {/* Hourly Wage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-amber-950">Hourly Wage</label>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Min ₹100/hr
                </span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs font-bold bg-amber-200 text-amber-950 rounded-l-xl border border-r-0 border-amber-300">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={5}
                  required
                  value={hourlyWage}
                  onChange={e => setHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                  className="w-full px-3 py-2 text-xs rounded-r-xl border border-amber-300 bg-white font-bold text-amber-950 focus:outline-none"
                />
              </div>
              <div className="flex gap-1 mt-1">
                {[100, 120, 140, 160].map(w => (
                  <button
                    type="button"
                    key={w}
                    onClick={() => setHourlyWage(w)}
                    className="text-[10px] font-semibold bg-white hover:bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200"
                  >
                    ₹{w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cute Total Earnings Preview Badge */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 block">
                Total Student Pay for this Shift
              </span>
              <div className="text-lg font-bubble font-bold flex items-center gap-1">
                <span>₹{hourlyWage}/hr</span>
                <span className="text-xs opacity-90 font-sans">×</span>
                <span>{durationHours} hrs</span>
                <span className="text-xs opacity-90 font-sans">=</span>
                <span className="text-xl underline decoration-emerald-200">₹{totalPay}</span>
              </div>
            </div>
            <div className="text-3xl select-none animate-bounce-small">
              💰🐾
            </div>
          </div>

          {/* Perks */}
          <div>
            <label className="text-xs font-bold text-amber-900 block mb-1.5">
              Student Perks & Freebies (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PERKS.map(perk => {
                const isSelected = selectedPerks.includes(perk);
                return (
                  <button
                    type="button"
                    key={perk}
                    onClick={() => togglePerk(perk)}
                    className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-200 text-amber-950 border border-amber-400 font-bold shadow-xs'
                        : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
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
            <label className="text-xs font-bold text-amber-900 block mb-1">
              Instructions for Student Attendant
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white"
              placeholder="e.g. Arrive 10 mins early, report to head barista, wear sneakers!"
            />
          </div>

          {/* Publish Shift Button */}
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] text-sm flex items-center justify-center gap-2"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Publish Shift on Firebase 🎉</span>
          </button>
        </form>
      </div>
    </div>
  );
}
