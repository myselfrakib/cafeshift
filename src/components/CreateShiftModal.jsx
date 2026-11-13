import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-[#12052E] rounded-t-[3px] sm:rounded-[3px] max-w-xl w-full p-5 sm:p-7 border border-[#2A1354] max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Mobile Handle */}
        <div className="sm:hidden w-10 h-1 bg-[#2A1354] rounded-full mx-auto mb-3"></div>

        {/* Close Button */}
        <button
          onClick={() => setCreateShiftModalOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-[3px] bg-[#160838] hover:bg-[#1E0D48] flex items-center justify-center text-[#A399BA] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold font-headline text-white uppercase tracking-tight">
            Publish Shift Offer
          </h2>
          <p className="text-xs text-[#A399BA] mt-0.5">
            Post an open shift at <strong className="text-white">{currentCafe?.name}</strong>. Shifts are locked immediately once a student applies.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[3px] bg-[#FF0046]/10 border border-[#FF0046] text-[#FF0046] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cafe selector if multiple */}
          {ownerCafes.length > 1 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#A399BA] block mb-1 font-headline">Select Cafe</label>
              <select
                value={cafeId}
                onChange={e => setCafeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-[#2A1354] bg-[#160838] text-white font-bold"
              >
                {ownerCafes.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#12052E] text-white">
                    {c.mascot} {c.name} ({c.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#A399BA] block mb-1 font-headline">
              Shift Title / Work Role
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Evening Rush Attendant & Table Server"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-[#2A1354] bg-[#160838] text-white placeholder-[#786C94] focus:outline-none focus:border-[#FF0046]"
            />
          </div>

          {/* Date and Starting Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#A399BA] flex items-center gap-1 mb-1 font-headline">
                <Calendar className="w-3.5 h-3.5 text-[#00DADC]" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-[#2A1354] bg-[#160838] text-white focus:outline-none focus:border-[#FF0046]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#A399BA] flex items-center gap-1 mb-1 font-headline">
                <Clock className="w-3.5 h-3.5 text-[#00DADC]" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-[#2A1354] bg-[#160838] text-white focus:outline-none focus:border-[#FF0046]"
              />
            </div>
          </div>

          {/* DURATION (MIN 3 HOURS) & HOURLY WAGE (MIN ₹100/HR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#160838] rounded-[3px] border border-[#2A1354]">
            {/* Duration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-white font-headline">Shift Duration</label>
                <span className="text-[10px] font-bold text-[#00DADC] bg-[#1E0D48] px-1.5 py-0.2 rounded-[2px] border border-[#3D1C7A]">
                  Min 3 hrs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={durationHours <= 3}
                  onClick={() => setDurationHours(prev => Math.max(3, prev - 1))}
                  className="w-9 h-9 rounded-[3px] bg-[#1E0D48] border border-[#2A1354] font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2A1354] flex items-center justify-center text-sm"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-xs text-white bg-[#0A011C] py-2 rounded-[3px] border border-[#2A1354] font-headline">
                  {durationHours} Hours
                </div>
                <button
                  type="button"
                  onClick={() => setDurationHours(prev => prev + 1)}
                  className="w-9 h-9 rounded-[3px] bg-[#1E0D48] border border-[#2A1354] font-bold text-white hover:bg-[#2A1354] flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hourly Wage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-white font-headline">Hourly Wage</label>
                <span className="text-[10px] font-bold text-[#FE9900] bg-[#1E0D48] px-1.5 py-0.2 rounded-[2px] border border-[#3D1C7A]">
                  Min ₹100/hr
                </span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs font-bold bg-[#1E0D48] text-[#00DADC] rounded-l-[3px] border border-r-0 border-[#2A1354]">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={5}
                  required
                  value={hourlyWage}
                  onChange={e => setHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                  className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-[#2A1354] bg-[#0A011C] font-bold text-white focus:outline-none focus:border-[#FF0046]"
                />
              </div>
            </div>
          </div>

          {/* Student Payout Banner */}
          <div className="bg-[#1E0D48] text-white p-3.5 rounded-[3px] border border-[#3D1C7A] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A399BA] block font-headline">
                Total Student Pay for Shift
              </span>
              <div className="text-lg font-headline font-bold text-[#00DADC]">
                ₹{hourlyWage}/hr × {durationHours} hrs = ₹{totalPay}
              </div>
            </div>
            <div className="text-xl">💰</div>
          </div>

          {/* Perks */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#A399BA] block mb-1.5 font-headline">
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
                    className={`text-xs px-2.5 py-1 rounded-[3px] font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-[#FF0046] text-white'
                        : 'bg-[#160838] text-[#A399BA] hover:text-white border border-[#2A1354]'
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
            <label className="text-xs font-bold uppercase tracking-wider text-[#A399BA] block mb-1 font-headline">
              Instructions for Attendant
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-[#2A1354] bg-[#160838] text-white placeholder-[#786C94] focus:outline-none focus:border-[#FF0046]"
              placeholder="e.g. Arrive 10 mins early, wear comfortable sneakers!"
            />
          </div>

          {/* Submit (IFP Pink Button) */}
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-3 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Publish Shift on Chai & Paws</span>
          </button>
        </form>
      </div>
    </div>
  );
}
