import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-3xl shrink-0">
            {currentUser?.mascot || '🐼'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bubble font-bold text-stone-950">
              {currentUser?.name}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentUser?.college || 'Kolkata Student'} · {currentUser?.address}
            </p>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Registered Phone: +91 {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Upcoming Earnings
          </span>
          <div className="text-xl font-bubble font-bold text-stone-950">
            ₹{totalEarningsBooked}
          </div>
          <p className="text-[11px] text-stone-500">
            {studentShifts.length} Shifts · {totalHoursBooked} Hours
          </p>
        </div>
      </div>

      {/* Booked Shifts Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bubble font-bold text-stone-950">
              Your Booked Shifts
            </h3>
            <p className="text-xs text-stone-500">
              These shifts are locked exclusively for you. The cafe owner will contact you directly.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            + Browse Shifts
          </button>
        </div>

        {studentShifts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <h4 className="text-sm font-bold text-stone-950">No Booked Shifts</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
              Explore open shifts across Kolkata cafes and tap "Apply Now" to book your spot.
            </p>
            <button
              onClick={() => setActiveTab('browse')}
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Browse Shifts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentShifts.map(shift => (
              <div
                key={shift.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bubble font-bold text-sm text-stone-950">
                        {shift.cafeName}
                      </h4>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{shift.cafeArea}, Kolkata</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Booked
                    </span>
                  </div>

                  <div className="font-semibold text-stone-900 font-bubble text-sm mb-2">
                    {shift.roleName}
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 space-y-1 text-[11px]">
                    <div className="flex justify-between text-stone-700">
                      <span>Date:</span>
                      <span className="font-semibold text-stone-950">{shift.date}</span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span>Time:</span>
                      <span>{shift.startTime} – {shift.endTime} ({shift.durationHours} hrs)</span>
                    </div>
                    <div className="flex justify-between text-stone-700 pt-1 border-t border-stone-200">
                      <span>Payout:</span>
                      <span className="font-bold text-stone-950">₹{shift.totalEarnings} (₹{shift.hourlyWage}/hr)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">Owner notified</span>
                  <button
                    onClick={() => cancelShiftApplication(shift.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium"
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
