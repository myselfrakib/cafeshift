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
      <div className="max-w-xl mx-auto p-8 text-center glass-panel rounded-3xl mt-6">
        <h3 className="text-lg font-bold font-bubble text-white">No Cafe Registered</h3>
        <p className="text-xs text-white/50 mt-1 mb-4">You have not registered any cafe yet.</p>
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
          <span className="font-semibold text-white/40 shrink-0">Your Cafes:</span>
          {ownerCafes.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCafeId(c.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                c.id === cafe.id
                  ? 'glass-pill-active font-bold'
                  : 'glass-pill text-white/70 hover:text-white'
              }`}
            >
              <span>{c.mascot}</span>
              <span className="ml-1.5">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cafe Header Card (Dark Glassmorphic Panel matching reference image) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-3xl shrink-0 shadow-[0_8px_20px_rgba(255,107,0,0.35)]">
            {cafe.mascot || '☕'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {cafe.area}, Kolkata
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-white mt-1">
              {cafe.name}
            </h1>
            <p className="text-xs text-white/60 mt-1 max-w-lg">
              {cafe.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{cafe.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 z-10">
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="btn-orange-glow font-bold px-5 py-3 rounded-2xl shadow-lg transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Shift Offer</span>
          </button>
          <span className="text-center text-[11px] text-white/40 font-medium">
            Min 3 hrs · Min ₹100/hr
          </span>
        </div>

        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-orange-500/15 blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row in Dark Glass */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] font-bold text-white/40 block uppercase tracking-wider">
            Booked Candidates
          </span>
          <div className="text-2xl font-bubble font-bold text-white mt-1">
            {bookedShifts.length}
          </div>
          <p className="text-[11px] text-orange-400 mt-0.5">Ready to contact</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] font-bold text-white/40 block uppercase tracking-wider">
            Live Offers
          </span>
          <div className="text-2xl font-bubble font-bold text-white mt-1">
            {openShifts.length}
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">Listed on Kolkata feed</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] font-bold text-white/40 block uppercase tracking-wider">
            Base Wage
          </span>
          <div className="text-2xl font-bubble font-bold text-orange-400 mt-1">
            ₹{cafe.minHourlyWage}/hr
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">≥ ₹100 guarantee</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] font-bold text-white/40 block uppercase tracking-wider">
            Owner Phone
          </span>
          <div className="text-sm font-bold text-white mt-1 font-mono">
            +91 {currentUser?.phone}
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">{currentUser?.name}</p>
        </div>
      </div>

      {/* Shift Management Tabs in Dark Glass */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-lg font-bubble font-bold text-white">
              Shift Offers & Candidate Contacts
            </h3>
            <p className="text-xs text-white/50">
              When a student applies, the shift locks instantly. Contact candidates directly via phone or WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white/[0.06] rounded-2xl border border-white/[0.08] text-xs font-semibold">
            <button
              onClick={() => setCafeTab('booked')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                cafeTab === 'booked' ? 'glass-pill-active font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              Booked Candidates ({bookedShifts.length})
            </button>
            <button
              onClick={() => setCafeTab('open')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                cafeTab === 'open' ? 'glass-pill-active font-bold' : 'text-white/60 hover:text-white'
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
              <div className="text-center py-12 px-4 glass-card rounded-2xl border-dashed">
                <div className="text-3xl mb-2">📋</div>
                <h4 className="text-sm font-bold text-white">No Booked Candidates Yet</h4>
                <p className="text-xs text-white/50 max-w-sm mx-auto mt-1 mb-3">
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
              <div className="text-center py-12 px-4 glass-card rounded-2xl border-dashed">
                <h4 className="text-sm font-bold text-white">No Open Shifts Currently Listed</h4>
                <p className="text-xs text-white/50 max-w-sm mx-auto mt-1 mb-3">
                  Create a shift offer to find students for your upcoming rush hours.
                </p>
                <button
                  onClick={() => setCreateShiftModalOpen(true)}
                  className="btn-orange-glow text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Create Shift Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="p-5 rounded-2xl glass-card flex flex-col justify-between text-xs space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                          Active on Feed
                        </span>
                        <span className="font-bold text-orange-400 font-bubble text-sm">
                          ₹{shift.hourlyWage}/hr · ₹{shift.totalEarnings} total
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white font-bubble">{shift.roleName}</h4>
                      <div className="text-white/60 mt-2 space-y-1">
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
