import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, X, Calendar, Clock, AlertCircle, Loader2, Check, Coffee, Store, Sparkles } from 'lucide-react';
import { formatDateDDMMYYYY, calculateEndTime12Hour, formatTime12Hour } from '../utils/dateTime';

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
    ownerCafes,
    activeCafe,
    createShiftModalOpen,
    setCreateShiftModalOpen,
    createShift,
    isSyncing
  } = useApp();

  const [cafeId, setCafeId] = useState(activeCafe?.id || '');
  const [roleName, setRoleName] = useState('');
  
  // Default date = today's date in YYYY-MM-DD for native input
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [startHour, setStartHour] = useState('04');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('PM');
  const [durationHours, setDurationHours] = useState(3); // Minimum 3 hours required!
  const [hourlyWage, setHourlyWage] = useState(activeCafe?.minHourlyWage || 100); // Minimum 100 required!
  const [selectedPerks, setSelectedPerks] = useState([]); // Default: no perks pre-selected
  const [dressCode, setDressCode] = useState('Comfortable casuals + sneakers (Cafe apron provided)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Sync cafeId and wage with active cafe
  useEffect(() => {
    if (activeCafe) {
      setCafeId(activeCafe.id);
      setHourlyWage(Math.max(100, activeCafe.minHourlyWage || 100));
    }
  }, [activeCafe]);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (createShiftModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setCreateShiftModalOpen(false);
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
  }, [createShiftModalOpen, setCreateShiftModalOpen]);

  if (!createShiftModalOpen) return null;

  const currentCafe = ownerCafes.find(c => c.id === cafeId) || activeCafe;
  const totalPay = durationHours * hourlyWage;

  const formattedStartTime = `${startHour}:${startMinute} ${startPeriod}`;
  const formattedEndTime = calculateEndTime12Hour(formattedStartTime, durationHours);
  const formattedDateDDMMYYYY = formatDateDDMMYYYY(date);

  const togglePerk = (perk) => {
    if (selectedPerks.includes(perk)) {
      setSelectedPerks(selectedPerks.filter(p => p !== perk));
    } else {
      setSelectedPerks([...selectedPerks, perk]);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (submittingRef.current || isSubmitting) return;
    setError('');

    if (!roleName.trim()) {
      return setError('Please enter a shift title / work role');
    }
    if (durationHours < 3) {
      return setError('Shift duration must be at least 3 hours (as per student fair work standards)');
    }
    if (hourlyWage < 100) {
      return setError('Hourly wage must be at least ₹100/hr (Kolkata student fair wage)');
    }
    if (!date) {
      return setError('Please select a valid date');
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await createShift({
        cafeId: currentCafe.id,
        roleName,
        date: formattedDateDDMMYYYY,
        startTime: formattedStartTime,
        durationHours: Number(durationHours),
        hourlyWage: Number(hourlyWage),
        perks: selectedPerks,
        dressCode,
        notes
      });
      setRoleName('');
      setSelectedPerks([]);
      setNotes('');
    } catch (err) {
      setError(err?.message || 'Failed to publish shift. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#F8F9FA] flex flex-col w-screen h-screen overflow-y-auto animate-fade-in">
      
      {/* 1. Full-Screen Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setCreateShiftModalOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[3px] border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-[#0A011C] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
              title="Return to Cafe Dashboard (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-stone-500" />
              <span className="hidden xs:inline">Back</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-xs shrink-0 font-headline shadow-2xs">
                ☕
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-[2px] bg-rose-50 text-[#FF0046] border border-rose-200 font-headline shrink-0">
                    Live Shift Offer
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight truncate">
                  Publish Shift at {currentCafe?.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCreateShiftModalOpen(false)}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#0A011C] rounded-[3px] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isSyncing}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting || isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publish Shift</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Full-Screen Body Form */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6">
        
        {/* Banner Info */}
        <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-headline text-[#0A011C] uppercase tracking-tight">
              Post an Open Cafe Shift Offer
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Shifts lock the instant a student applies. Real-time Firebase sync broadcasts this offer to student feeds across Kolkata immediately.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-[3px] bg-stone-100 text-stone-700 border border-stone-200">
              Min ₹100/hr · 3h Shift
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-[3px] bg-rose-50 border border-rose-300 text-[#FF0046] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Cafe Target & Shift Title */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  1. Outlet & Work Role
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Select the cafe branch and the title shown on student shift cards.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Outlet selector if multiple */}
              {ownerCafes.length > 1 && (
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                    Select Cafe Outlet <span className="text-[#FF0046]">*</span>
                  </label>
                  <select
                    value={cafeId}
                    onChange={e => setCafeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  >
                    {ownerCafes.map(c => (
                      <option key={c.id} value={c.id}>
                        ☕ {c.name} ({c.area})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Shift Title / Role Name */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                  Shift Title / Work Role <span className="text-[#FF0046]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Rush Attendant & Table Server"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Date, Time & Duration */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  2. Shift Date, Timing & Duration
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  12-hour AM/PM format with automatic end time calculation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Shift Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1 font-headline">
                    <Calendar className="w-3.5 h-3.5 text-[#008b8d]" />
                    <span>Shift Date <span className="text-[#FF0046]">*</span></span>
                  </label>
                  <span className="text-[10px] font-bold text-[#FF0046] font-mono bg-rose-50 px-2 py-0.5 rounded-[2px] border border-rose-200">
                    {formattedDateDDMMYYYY}
                  </span>
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046]"
                />
                <p className="text-[10px] text-stone-400 mt-1">Calendar format follows DD/MM/YYYY</p>
              </div>

              {/* Start Time Selectors */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1 font-headline">
                    <Clock className="w-3.5 h-3.5 text-[#008b8d]" />
                    <span>Start Time (12-Hr AM/PM)</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#006062] font-mono bg-cyan-50 px-2 py-0.5 rounded-[2px] border border-cyan-200">
                    {formattedStartTime}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <select
                    value={startHour}
                    onChange={e => setStartHour(e.target.value)}
                    className="px-2.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                      <option key={h} value={h}>{h} Hr</option>
                    ))}
                  </select>

                  <select
                    value={startMinute}
                    onChange={e => setStartMinute(e.target.value)}
                    className="px-2.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  >
                    {['00','15','30','45'].map(m => (
                      <option key={m} value={m}>{m} Min</option>
                    ))}
                  </select>

                  <select
                    value={startPeriod}
                    onChange={e => setStartPeriod(e.target.value)}
                    className="px-2.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <p className="text-[10px] text-stone-500 mt-1 font-medium">
                  Ends automatically at <strong className="text-[#0A011C]">{formattedEndTime}</strong>
                </p>
              </div>
            </div>

            {/* Duration Selector & Wage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-[3px] border border-stone-200 mt-2">
              {/* Duration Counter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0A011C] font-headline">
                    Shift Duration
                  </label>
                  <span className="text-[10px] font-bold text-[#006062] bg-cyan-50 px-2 py-0.5 rounded-[2px] border border-cyan-200">
                    Min 3 hrs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={durationHours <= 3}
                    onClick={() => setDurationHours(prev => Math.max(3, prev - 1))}
                    className="w-10 h-10 rounded-[3px] bg-white border border-stone-200 font-bold text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 flex items-center justify-center text-sm shadow-xs transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-bold text-xs text-[#0A011C] bg-white py-2.5 rounded-[3px] border border-stone-200 font-headline shadow-2xs">
                    {durationHours} Hours
                  </div>
                  <button
                    type="button"
                    onClick={() => setDurationHours(prev => prev + 1)}
                    className="w-10 h-10 rounded-[3px] bg-white border border-stone-200 font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm shadow-xs transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hourly Wage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0A011C] font-headline">
                    Hourly Wage Rate
                  </label>
                  <span className="text-[10px] font-bold text-[#FE9900] bg-amber-50 px-2 py-0.5 rounded-[2px] border border-amber-200">
                    Min ₹100/hr
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200 font-headline">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={100}
                    step={5}
                    required
                    value={hourlyWage}
                    onChange={e => setHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-r-[3px] border border-stone-200 bg-white font-bold text-[#0A011C] focus:outline-none focus:border-[#FF0046]"
                  />
                  <span className="px-3 text-[11px] text-stone-400 font-bold uppercase font-headline whitespace-nowrap">
                    /hr
                  </span>
                </div>
              </div>
            </div>

            {/* Total Student Payout Banner */}
            <div className="bg-rose-50/70 p-4 rounded-[3px] border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block font-headline">
                  Total Student Payout for Shift
                </span>
                <div className="text-xl font-headline font-bold text-[#FF0046] mt-0.5">
                  ₹{hourlyWage}/hr × {durationHours} hrs = ₹{totalPay}
                </div>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>

          {/* Section 3: Included Perks & Freebies */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  3. Included Perks & Freebies (Optional)
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Tap to add perks. By default, no perks are pre-selected.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {COMMON_PERKS.map(perk => {
                const isSelected = selectedPerks.includes(perk);
                return (
                  <button
                    type="button"
                    key={perk}
                    onClick={() => togglePerk(perk)}
                    className={`text-xs px-3.5 py-2 rounded-[3px] font-bold uppercase tracking-wider transition-colors border ${
                      isSelected
                        ? 'bg-[#FF0046] text-white border-[#FF0046] shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:text-black hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {perk}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Attendant Notes & Dress Code */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  4. Attendant Instructions & Dress Code
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Important details for the booked attendant on arrival.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                  Dress Code
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={e => setDressCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                  placeholder="e.g. Comfortable casuals + sneakers (Cafe apron provided)"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                  Instructions for Attendant (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                  placeholder="e.g. Arrive 10 mins early, ask for Manager Rahul on entry, warm staff meal provided at 7 PM."
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setCreateShiftModalOpen(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-[3px] border border-stone-200 hover:border-stone-300 font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 transition-colors text-xs text-center"
            >
              Cancel & Exit
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isSyncing}
              className={`relative w-full sm:w-auto px-8 py-3.5 rounded-[3px] font-bold text-xs uppercase tracking-wider font-headline transition-all overflow-hidden flex items-center justify-center gap-2 shadow-sm ${
                isSubmitting || isSyncing
                  ? 'bg-[#0A011C] text-white cursor-wait opacity-95 ring-2 ring-[#00DADC]/40'
                  : 'bg-[#FF0046] hover:bg-[#E6003F] text-white active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isSubmitting || isSyncing ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-[#00DADC]" />
                    <span className="tracking-widest text-[#00DADC]">Publishing Shift Offer...</span>
                  </div>
                </>
              ) : (
                <>
                  <span>Publish Shift on Calcutta Cafe Club</span>
                  <span className="text-[11px] font-mono opacity-80">(₹{totalPay} Total)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
