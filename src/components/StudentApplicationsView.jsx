import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function StudentApplicationsView() {
  const { shifts, currentUser, cancelShiftApplication, setActiveTab } = useApp();

  const studentShifts = shifts.filter(
    s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)
  );

  const totalEarningsBooked = studentShifts.reduce((acc, s) => acc + (s.totalEarnings || 0), 0);
  const totalHoursBooked = studentShifts.reduce((acc, s) => acc + (s.durationHours || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Student Profile Overview Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-3xl shrink-0 shadow-[0_8px_20px_rgba(255,107,0,0.35)]">
            {currentUser?.mascot || '🐼'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-white">
              {currentUser?.name}
            </h1>
            <p className="text-xs text-white/60 mt-1">
              {currentUser?.college || 'Kolkata Student'} · {currentUser?.address}
            </p>
            <p className="text-xs text-orange-400 font-mono mt-1">
              Registered Phone: +91 {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 text-left sm:text-right shrink-0 z-10 border border-orange-500/30">
          <span className="text-[10px] uppercase font-bold text-white/40 block tracking-wider">
            Upcoming Earnings
          </span>
          <div className="text-2xl font-bubble font-bold text-orange-400">
            ₹{totalEarningsBooked}
          </div>
          <p className="text-[11px] text-white/60">
            {studentShifts.length} Shifts · {totalHoursBooked} Hours
          </p>
        </div>

        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-orange-500/15 blur-3xl pointer-events-none"></div>
      </div>

      {/* Booked Shifts Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-lg font-bubble font-bold text-white">
              Your Booked Shifts
            </h3>
            <p className="text-xs text-white/50">
              These shifts are locked exclusively for you. The cafe owner will contact you directly.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="btn-orange-glow text-xs font-bold px-4 py-2 rounded-xl"
          >
            + Browse Shifts
          </button>
        </div>

        {studentShifts.length === 0 ? (
          <div className="text-center py-12 px-4 glass-card rounded-2xl border-dashed">
            <h4 className="text-sm font-bold text-white">No Booked Shifts</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto mt-1 mb-3">
              Explore open shifts across Kolkata cafes and tap "Apply Now" to book your spot.
            </p>
            <button
              onClick={() => setActiveTab('browse')}
              className="btn-orange-glow text-xs font-bold px-4 py-2 rounded-xl"
            >
              Browse Shifts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentShifts.map(shift => (
              <div
                key={shift.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bubble font-bold text-base text-white">
                        {shift.cafeName}
                      </h4>
                      <div className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>{shift.cafeArea}, Kolkata</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Booked
                    </span>
                  </div>

                  <div className="font-bold text-white font-bubble text-base mb-2">
                    {shift.roleName}
                  </div>

                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.06] space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>Date:</span>
                      <span className="font-semibold text-white">{shift.date}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Time:</span>
                      <span>{shift.startTime} – {shift.endTime} ({shift.durationHours} hrs)</span>
                    </div>
                    <div className="flex justify-between text-white/80 pt-1.5 border-t border-white/[0.08]">
                      <span>Payout:</span>
                      <span className="font-bold text-orange-400 font-bubble text-sm">₹{shift.totalEarnings} (₹{shift.hourlyWage}/hr)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[10px] text-white/40">Owner notified via Firebase</span>
                  <button
                    onClick={() => cancelShiftApplication(shift.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
