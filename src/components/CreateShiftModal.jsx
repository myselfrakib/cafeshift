import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatDateDDMMYYYY, calculateEndTime12Hour } from '../utils/dateTime';

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
  const [roleName, setRoleName] = useState('');

  // Sync active cafe and default wage when modal opens or activeCafe changes
  useEffect(() => {
    if (activeCafe?.id) {
      setCafeId(activeCafe.id);
      if (activeCafe.minHourlyWage) {
        setHourlyWage(Math.max(100, activeCafe.minHourlyWage));
      }
    } else if (ownerCafes.length > 0) {
      setCafeId(ownerCafes[0].id);
      if (ownerCafes[0].minHourlyWage) {
        setHourlyWage(Math.max(100, ownerCafes[0].minHourlyWage));
      }
    }
  }, [createShiftModalOpen, activeCafe, ownerCafes]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [startHour, setStartHour] = useState('04');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('PM');
  const [durationHours, setDurationHours] = useState(3); // Minimum 3 hours required!
  const [hourlyWage, setHourlyWage] = useState(activeCafe?.minHourlyWage || 100); // Minimum 100 required!
  const [selectedPerks, setSelectedPerks] = useState([
    'Free Specialty Coffee ☕',
    'Warm Meal / Snack 🥪'
  ]);
  const [dressCode, setDressCode] = useState('Comfortable casuals + sneakers (Cafe apron provided)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = React.useRef(false);

  // Reset submission state whenever modal opens or closes
  useEffect(() => {
    if (!createShiftModalOpen) {
      setIsSubmitting(false);
      submittingRef.current = false;
      setError('');
    }
  }, [createShiftModalOpen]);

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
    e.preventDefault();
    // Guard against duplicate concurrent presses
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

    // All required fields entered: lock & start processing animation immediately!
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
      // Reset form fields
      setRoleName('');
      setNotes('');
    } catch (err) {
      setError(err?.message || 'Failed to publish shift. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-t-[3px] sm:rounded-[3px] max-w-xl w-full p-5 sm:p-7 border border-stone-200 max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Mobile Handle */}
        <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mb-3"></div>

        {/* Close Button */}
        <button
          onClick={() => setCreateShiftModalOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-[3px] bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-[#0A011C] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold font-headline text-[#0A011C] uppercase tracking-tight">
            Publish Shift Offer
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Post an open shift at <strong className="text-stone-800">{currentCafe?.name}</strong>. Shifts are locked immediately once a student applies.
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
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1 font-headline">Select Cafe</label>
              <select
                value={cafeId}
                onChange={e => setCafeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
              >
                {ownerCafes.map(c => (
                  <option key={c.id} value={c.id}>
                    ☕ {c.name} ({c.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1 font-headline">
              Shift Title / Work Role
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Evening Rush Attendant & Table Server"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
            />
          </div>

          {/* Date (DD/MM/YYYY) and Starting Time (12-hour format) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1 font-headline">
                  <Calendar className="w-3.5 h-3.5 text-[#008b8d]" />
                  <span>Date</span>
                </label>
                <span className="text-[10px] font-bold text-[#FF0046] font-mono bg-[#FF0046]/10 px-1.5 py-0.5 rounded-[2px]">
                  {formattedDateDDMMYYYY}
                </span>
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
              />
              <p className="text-[10px] text-stone-400 mt-0.5">Format follows DD/MM/YYYY</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1 font-headline">
                  <Clock className="w-3.5 h-3.5 text-[#008b8d]" />
                  <span>Start Time (12-Hr)</span>
                </label>
                <span className="text-[10px] font-bold text-[#008b8d] font-mono bg-[#00DADC]/15 px-1.5 py-0.5 rounded-[2px]">
                  {formattedStartTime}
                </span>
              </div>

              {/* 12-Hour Time Selectors */}
              <div className="grid grid-cols-3 gap-1">
                {/* Hour */}
                <select
                  value={startHour}
                  onChange={e => setStartHour(e.target.value)}
                  className="px-2 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                >
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                    <option key={h} value={h}>{h} Hr</option>
                  ))}
                </select>

                {/* Minute */}
                <select
                  value={startMinute}
                  onChange={e => setStartMinute(e.target.value)}
                  className="px-2 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                >
                  {['00','15','30','45'].map(m => (
                    <option key={m} value={m}>{m} Min</option>
                  ))}
                </select>

                {/* AM/PM */}
                <select
                  value={startPeriod}
                  onChange={e => setStartPeriod(e.target.value)}
                  className="px-2 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-bold focus:bg-white focus:outline-none focus:border-[#FF0046]"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Ends at {formattedEndTime}</p>
            </div>
          </div>

          {/* DURATION (MIN 3 HOURS) & HOURLY WAGE (MIN ₹100/HR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-[3px] border border-stone-200">
            {/* Duration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0A011C] font-headline">Shift Duration</label>
                <span className="text-[10px] font-bold text-[#008b8d] bg-[#00DADC]/15 px-1.5 py-0.5 rounded-[2px] border border-[#00DADC]/30">
                  Min 3 hrs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={durationHours <= 3}
                  onClick={() => setDurationHours(prev => Math.max(3, prev - 1))}
                  className="w-9 h-9 rounded-[3px] bg-white border border-stone-200 font-bold text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-xs text-[#0A011C] bg-white py-2 rounded-[3px] border border-stone-200 font-headline">
                  {durationHours} Hours
                </div>
                <button
                  type="button"
                  onClick={() => setDurationHours(prev => prev + 1)}
                  className="w-9 h-9 rounded-[3px] bg-white border border-stone-200 font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hourly Wage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0A011C] font-headline">Hourly Wage</label>
                <span className="text-[10px] font-bold text-[#FE9900] bg-amber-50 px-1.5 py-0.5 rounded-[2px] border border-amber-200">
                  Min ₹100/hr
                </span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs font-bold bg-stone-100 text-stone-600 rounded-l-[3px] border border-r-0 border-stone-200">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={5}
                  required
                  value={hourlyWage}
                  onChange={e => setHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                  className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-white font-bold text-[#0A011C] focus:outline-none focus:border-[#FF0046]"
                />
              </div>
            </div>
          </div>

          {/* Student Payout Banner */}
          <div className="bg-[#FF0046]/10 text-[#0A011C] p-3.5 rounded-[3px] border border-[#FF0046]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block font-headline">
                Total Student Pay for Shift
              </span>
              <div className="text-lg font-headline font-bold text-[#FF0046]">
                ₹{hourlyWage}/hr × {durationHours} hrs = ₹{totalPay}
              </div>
            </div>
            <div className="text-xl">💰</div>
          </div>

          {/* Perks */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5 font-headline">
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
                        ? 'bg-[#FF0046] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:text-black border border-stone-200'
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
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1 font-headline">
              Instructions for Attendant
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
              placeholder="e.g. Arrive 10 mins early, wear comfortable sneakers!"
            />
          </div>

          {/* Submit Button with Instant Processing Animation */}
          <button
            type="submit"
            disabled={isSubmitting || isSyncing}
            className={`relative w-full py-3.5 rounded-[3px] font-bold text-xs uppercase tracking-wider font-headline transition-all overflow-hidden flex items-center justify-center gap-2 shadow-sm ${
              isSubmitting || isSyncing
                ? 'bg-[#0A011C] text-white cursor-wait opacity-95 ring-2 ring-[#00DADC]/40'
                : 'bg-[#FF0046] hover:bg-[#E6003F] text-white active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isSubmitting || isSyncing ? (
              <>
                {/* Glowing Shimmer Sweep Over Button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />

                {/* Processing Spinner and Status Text */}
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
        </form>
      </div>
    </div>
  );
}
