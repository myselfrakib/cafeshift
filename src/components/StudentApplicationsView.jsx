import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin } from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function StudentApplicationsView() {
  const { shifts, currentUser, cancelShiftApplication, setActiveTab } = useApp();

  const studentShifts = shifts.filter(
    s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)
  );

  const totalEarningsBooked = studentShifts.reduce((acc, s) => acc + (s.totalEarnings || 0), 0);
  const totalHoursBooked = studentShifts.reduce((acc, s) => acc + (s.durationHours || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Student Profile Overview Card (Clean White Surface with 3px corners) */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-[3px] bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {currentUser?.photoUrl ? (
              <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-headline font-bold text-lg text-[#FF0046]">
                {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-[#0A011C] uppercase tracking-tight">
              {currentUser?.name}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentUser?.college || 'Kolkata Student'} · {currentUser?.address}
            </p>
            <p className="text-xs text-[#008b8d] font-mono mt-0.5">
              Registered Phone: +91 {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="bg-stone-50 rounded-[3px] p-4 border border-stone-200 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-headline">
            Upcoming Earnings
          </span>
          <div className="text-2xl font-headline font-bold text-[#FF0046]">
            ₹{totalEarningsBooked}
          </div>
          <p className="text-[11px] text-stone-500">
            {studentShifts.length} Shifts · {totalHoursBooked} Hours
          </p>
        </div>
      </div>

      {/* Booked Shifts Section */}
      <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-headline font-bold text-[#0A011C] uppercase tracking-tight">
              Your Booked Shifts
            </h3>
            <p className="text-xs text-stone-500">
              These shifts are locked exclusively for you. The cafe owner will contact you directly.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold uppercase tracking-wider text-black bg-stone-100 hover:bg-[#FF0046] hover:text-white px-3.5 py-1.5 rounded-[3px] border border-stone-200 transition-colors"
          >
            + Browse Shifts
          </button>
        </div>

        {studentShifts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200">
            <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Booked Shifts</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
              Explore open shifts across Kolkata cafes and tap "Apply Now" to book your spot.
            </p>
            <button
              onClick={() => setActiveTab('browse')}
              className="bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase tracking-wider text-xs px-4 py-2 rounded-[3px] shadow-xs"
            >
              Browse Shifts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentShifts.map(shift => (
              <div
                key={shift.id}
                className="bg-stone-50 rounded-[3px] p-4 border border-stone-200 flex flex-col justify-between text-xs space-y-3 hover:border-stone-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-headline font-bold text-base text-[#0A011C] uppercase">
                        {shift.cafeName}
                      </h4>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#FF0046]" />
                        <span>{shift.cafeArea}, Kolkata</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/20 text-[#008b8d] border border-[#00DADC]/40 px-2 py-0.5 rounded-[3px]">
                      Booked
                    </span>
                  </div>

                  <div className="font-bold text-[#0A011C] font-headline uppercase text-sm mb-2">
                    {shift.roleName}
                  </div>

                  <div className="bg-white p-3 rounded-[3px] border border-stone-200 space-y-1 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Date:</span>
                      <span className="font-bold text-[#0A011C] font-headline">{formatDateDDMMYYYY(shift.date)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Time:</span>
                      <span className="text-stone-800">{formatTime12Hour(shift.startTime)} – {formatTime12Hour(shift.endTime)} ({shift.durationHours} hrs)</span>
                    </div>
                    <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-100">
                      <span>Payout:</span>
                      <span className="font-bold text-[#FF0046] font-headline">₹{shift.totalEarnings} (₹{shift.hourlyWage}/hr)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Owner notified</span>
                  <button
                    onClick={() => cancelShiftApplication(shift.id)}
                    className="text-xs text-[#FF0046] hover:underline font-bold uppercase tracking-wider"
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
