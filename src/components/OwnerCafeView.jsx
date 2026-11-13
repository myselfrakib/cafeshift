import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApplicantCard from './ApplicantCard';
import { PlusCircle, Coffee, MapPin, Calendar, Clock, ChevronRight, UserCheck } from 'lucide-react';

export default function OwnerCafeView() {
  const {
    currentUser,
    activeCafe,
    ownerCafes,
    shifts,
    setSelectedCafeId,
    setCreateShiftModalOpen,
    cancelShiftApplication,
    showToast
  } = useApp();

  const [cafeTab, setCafeTab] = useState('booked'); // 'booked' | 'open' | 'all'

  const cafe = activeCafe;

  if (!cafe) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-2xl border border-stone-200 mt-6">
        <h3 className="text-lg font-bold font-bubble text-stone-900">No Cafe Registered</h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">You have not registered any cafe yet.</p>
      </div>
    );
  }

  // Filter shifts belonging to this cafe
  const cafeShifts = shifts.filter(s => s.cafeId === cafe.id);
  const bookedShifts = cafeShifts.filter(s => s.status === 'booked');
  const openShifts = cafeShifts.filter(s => s.status === 'open');

  const handleCompleteShift = (shiftId) => {
    showToast('Shift marked completed & paid.', 'success', '✓');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Cafe Selector if Owner has multiple cafes */}
      {ownerCafes.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-stone-500 shrink-0">Your Cafes:</span>
          {ownerCafes.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCafeId(c.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                c.id === cafe.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{c.mascot}</span>
              <span className="ml-1.5">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cafe Header Banner (Modern Minimalist App Card) */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-100 flex items-center justify-center text-3xl shrink-0 shadow-sm">
            {cafe.mascot || '☕'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {cafe.area}, Kolkata
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-stone-950 mt-1">
              {cafe.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-lg">
              {cafe.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{cafe.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Shift Offer</span>
          </button>
          <span className="text-center text-[11px] text-stone-400 font-medium">
            Min 3 hrs · Min ₹100/hr
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
            Booked Candidates
          </span>
          <div className="text-2xl font-bubble font-bold text-stone-950 mt-1">
            {bookedShifts.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Ready to contact</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
            Live Offers
          </span>
          <div className="text-2xl font-bubble font-bold text-stone-950 mt-1">
            {openShifts.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Listed for students</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
            Base Wage
          </span>
          <div className="text-2xl font-bubble font-bold text-emerald-700 mt-1">
            ₹{cafe.minHourlyWage}/hr
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">≥ ₹100 guarantee</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
            Owner Contact
          </span>
          <div className="text-sm font-bold text-stone-950 mt-1 font-mono">
            +91 {currentUser?.phone}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">{currentUser?.name}</p>
        </div>
      </div>

      {/* Shift Management Tabs */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bubble font-bold text-stone-950">
              Shift Offers & Candidate Contacts
            </h3>
            <p className="text-xs text-stone-500">
              When a student applies, the shift locks instantly. Contact candidates directly via phone or WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCafeTab('booked')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                cafeTab === 'booked' ? 'bg-white text-stone-950 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Booked Candidates ({bookedShifts.length})
            </button>
            <button
              onClick={() => setCafeTab('open')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                cafeTab === 'open' ? 'bg-white text-stone-950 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Open Shifts ({openShifts.length})
            </button>
          </div>
        </div>

        {/* BOOKED SHIFTS LIST */}
        {cafeTab === 'booked' && (
          <div className="space-y-4">
            {bookedShifts.length === 0 ? (
              <div className="text-center py-12 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <div className="text-2xl mb-1">📋</div>
                <h4 className="text-sm font-bold text-stone-950">No Booked Candidates Yet</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
                  When a student taps "Apply" on your shift offer, their profile and direct contact buttons will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bookedShifts.map(shift => (
                  <ApplicantCard
                    key={shift.id}
                    shift={shift}
                    onComplete={handleCompleteShift}
                    onCancel={cancelShiftApplication}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* OPEN SHIFTS LIST */}
        {cafeTab === 'open' && (
          <div className="space-y-4">
            {openShifts.length === 0 ? (
              <div className="text-center py-12 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <h4 className="text-sm font-bold text-stone-950">No Open Shifts Currently Listed</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
                  Create a shift offer to find students for your upcoming rush hours.
                </p>
                <button
                  onClick={() => setCreateShiftModalOpen(true)}
                  className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
                >
                  Create Shift Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active on Feed
                        </span>
                        <span className="font-bold text-stone-950">
                          ₹{shift.hourlyWage}/hr · ₹{shift.totalEarnings} total
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-950 font-bubble">{shift.roleName}</h4>
                      <div className="text-stone-500 mt-2 space-y-1">
                        <div>Date: {shift.date}</div>
                        <div>Timing: {shift.startTime} – {shift.endTime} ({shift.durationHours} hrs)</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
