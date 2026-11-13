import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Phone, MessageCircle, AlertCircle, Sparkles, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

export default function StudentApplicationsView() {
  const { shifts, currentUser, cancelShiftApplication, setActiveTab } = useApp();

  // Find shifts booked by current student
  const studentShifts = shifts.filter(
    s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)
  );

  const totalEarningsBooked = studentShifts.reduce((acc, s) => acc + (s.totalEarnings || 0), 0);
  const totalHoursBooked = studentShifts.reduce((acc, s) => acc + (s.durationHours || 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {currentUser?.mascot || '🐼'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>🎒 Student Attendant Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bubble font-bold">
                {currentUser?.name}
              </h1>
              <p className="text-xs text-emerald-100 mt-1 max-w-md font-medium">
                {currentUser?.college || 'Kolkata College Student'} · {currentUser?.address}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">
              Upcoming Pocket Money
            </span>
            <div className="text-2xl font-bubble font-bold text-white">
              ₹{totalEarningsBooked}
            </div>
            <p className="text-[11px] text-emerald-100 font-medium">
              {studentShifts.length} Shifts · {totalHoursBooked} Hours
            </p>
          </div>
        </div>
      </div>

      {/* Booked Shifts List */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div>
            <h3 className="text-lg font-bubble font-bold text-amber-950 flex items-center gap-2">
              <span>☕ Your Booked Cafe Shifts</span>
            </h3>
            <p className="text-xs text-amber-800">
              These shifts are locked exclusively for you. The cafe owner will contact your registered phone (+91 {currentUser?.phone}).
            </p>
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            + Browse More Shifts
          </button>
        </div>

        {studentShifts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-amber-50/50 rounded-3xl border border-dashed border-amber-200">
            <div className="text-4xl mb-2">🎒🐾</div>
            <h4 className="text-base font-bold font-bubble text-amber-950">
              No Booked Shifts Yet
            </h4>
            <p className="text-xs text-amber-800 max-w-md mx-auto mt-1 mb-4">
              Explore available shifts at Kolkata cafes (Park Street, Southern Avenue, Salt Lake) and apply to start earning hourly wages!
            </p>
            <button
              onClick={() => setActiveTab('browse')}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
            >
              Browse Open Shifts 🐾
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentShifts.map(shift => (
              <div
                key={shift.id}
                className="bg-gradient-to-br from-white to-amber-50/60 rounded-3xl p-5 border-2 border-emerald-300 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner">
                        {shift.cafeMascot || '☕'}
                      </div>
                      <div>
                        <h4 className="font-bubble font-bold text-base text-amber-950">
                          {shift.cafeName}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-amber-800 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          <span>{shift.cafeArea}, Kolkata</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Booked</span>
                    </span>
                  </div>

                  <h3 className="font-bubble text-sm font-bold text-amber-950 mt-2 mb-3">
                    {shift.roleName}
                  </h3>

                  <div className="bg-white/90 rounded-2xl p-3 border border-amber-200/80 mb-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-amber-950">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>Date: {shift.date}</span>
                      </span>
                      <span className="text-amber-800">{shift.durationHours} hrs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Time: {shift.startTime} to {shift.endTime}</span>
                    </div>
                  </div>

                  {/* Earnings summary */}
                  <div className="bg-emerald-50 rounded-2xl p-2.5 border border-emerald-200 flex items-center justify-between text-xs mb-3">
                    <span className="text-emerald-900 font-semibold">Net Student Earnings:</span>
                    <span className="font-bubble font-bold text-emerald-800 text-sm">
                      ₹{shift.totalEarnings} (₹{shift.hourlyWage}/hr)
                    </span>
                  </div>

                  {/* Perks */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {shift.perks?.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white text-amber-900 px-2 py-0.5 rounded-md border border-amber-200"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions: Cancel Booking if necessary */}
                <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-amber-700">
                    Owner notified on apply
                  </span>
                  <button
                    onClick={() => cancelShiftApplication(shift.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
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

