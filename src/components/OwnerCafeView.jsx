import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApplicantCard from './ApplicantCard';
import { PlusCircle, Coffee, MapPin, Calendar, Clock, Sparkles, UserCheck, CheckCircle2, ChevronRight, AlertCircle, IndianRupee, Store } from 'lucide-react';

export default function OwnerCafeView() {
  const {
    currentUser,
    activeCafe,
    ownerCafes,
    shifts,
    setSelectedCafeId,
    setCreateShiftModalOpen,
    cancelShiftApplication,
    showToast,
    addOwnerCafe
  } = useApp();

  const [cafeTab, setCafeTab] = useState('booked'); // 'booked' | 'open' | 'all'
  const [showAddCafeModal, setShowAddCafeModal] = useState(false);
  const [newCafeData, setNewCafeData] = useState({
    name: "Rakib's Rooftop Brew",
    area: 'Park Street',
    address: 'Park Street (Rooftop), Kolkata',
    mascot: '🐱',
    minHourlyWage: 120,
    description: 'A cozy rooftop cafe overlooking Kolkata skyline.'
  });

  const cafe = activeCafe;

  if (!cafe) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-white rounded-3xl shadow-sm border border-amber-200 mt-6">
        <div className="text-5xl mb-3">☕🐾</div>
        <h3 className="text-xl font-bold font-bubble text-amber-950">No Cafe Found</h3>
        <p className="text-xs text-amber-700 mt-1 mb-4">Please register your cafe to start posting shifts.</p>
      </div>
    );
  }

  // Filter shifts belonging to this cafe
  const cafeShifts = shifts.filter(s => s.cafeId === cafe.id);
  const bookedShifts = cafeShifts.filter(s => s.status === 'booked');
  const openShifts = cafeShifts.filter(s => s.status === 'open');

  const handleCompleteShift = (shiftId) => {
    showToast('Shift marked completed! Thank you for supporting student pocket money in Kolkata! ⭐', 'success', '🎉');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Cafe Selector if Owner has multiple cafes */}
      {ownerCafes.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-amber-900 shrink-0">Your Cafes:</span>
          {ownerCafes.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCafeId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                c.id === cafe.id
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
              }`}
            >
              <span>{c.mascot}</span>
              <span>{c.name}</span>
            </button>
          ))}
          <button
            onClick={() => setShowAddCafeModal(true)}
            className="text-xs font-bold text-amber-700 hover:text-amber-950 px-2 py-1 flex items-center gap-1 border border-dashed border-amber-300 rounded-xl"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Cafe</span>
          </button>
        </div>
      )}

      {/* CAFE HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-xl p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner shrink-0 animate-bounce-small">
              {cafe.mascot || '🐱'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-1">
                <span>📍 {cafe.area}, Kolkata</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bubble font-bold">
                {cafe.name}
              </h1>
              <p className="text-xs text-amber-100 mt-1 max-w-md font-medium">
                {cafe.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-amber-100/90 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-200" />
                  <span>{cafe.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA: Create Shift Offer */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setCreateShiftModalOpen(true)}
              className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <span>Create Shift Offer</span>
            </button>
            <div className="text-center text-[11px] text-amber-200 font-semibold">
              Min ₹100/hr · Min 3 hrs
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none"></div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Booked Shifts</span>
            <span className="text-lg">🎉</span>
          </div>
          <div className="text-2xl font-bubble font-bold text-amber-950">
            {bookedShifts.length}
          </div>
          <p className="text-[11px] text-amber-800/80 font-medium mt-0.5">Ready to contact</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Live Offers</span>
            <span className="text-lg">⚡</span>
          </div>
          <div className="text-2xl font-bubble font-bold text-amber-950">
            {openShifts.length}
          </div>
          <p className="text-[11px] text-amber-800/80 font-medium mt-0.5">Listed for students</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Hourly Wage</span>
            <span className="text-lg">💸</span>
          </div>
          <div className="text-2xl font-bubble font-bold text-emerald-700">
            ₹{cafe.minHourlyWage}+
          </div>
          <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Compliant (≥₹100/hr)</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Owner Contact</span>
            <span className="text-lg">📞</span>
          </div>
          <div className="text-sm font-bold text-amber-950 mt-1">
            +91 {currentUser?.phone}
          </div>
          <p className="text-[11px] text-amber-800/80 font-medium mt-0.5">{currentUser?.name}</p>
        </div>
      </div>

      {/* SHIFTS SECTION WITH SUBTABS */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <h3 className="text-lg font-bubble font-bold text-amber-950 flex items-center gap-2">
              <span>📋 Shift Offers & Student Applicants</span>
            </h3>
            <p className="text-xs text-amber-800">
              When a student applies, the listing is booked & removed from students' feed so you can contact them directly.
            </p>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-2xl text-xs font-bold text-amber-900">
            <button
              onClick={() => setCafeTab('booked')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                cafeTab === 'booked' ? 'bg-white text-amber-950 shadow-sm font-bold' : 'hover:bg-amber-200/60'
              }`}
            >
              <span>🎉</span>
              <span>Booked ({bookedShifts.length})</span>
            </button>
            <button
              onClick={() => setCafeTab('open')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                cafeTab === 'open' ? 'bg-white text-amber-950 shadow-sm font-bold' : 'hover:bg-amber-200/60'
              }`}
            >
              <span>⚡</span>
              <span>Available ({openShifts.length})</span>
            </button>
            <button
              onClick={() => setCafeTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                cafeTab === 'all' ? 'bg-white text-amber-950 shadow-sm font-bold' : 'hover:bg-amber-200/60'
              }`}
            >
              <span>All ({cafeShifts.length})</span>
            </button>
          </div>
        </div>

        {/* BOOKED SHIFTS / APPLICANT CARDS */}
        {cafeTab === 'booked' && (
          <div className="space-y-4">
            {bookedShifts.length === 0 ? (
              <div className="text-center py-12 px-4 bg-amber-50/50 rounded-3xl border border-dashed border-amber-200">
                <div className="text-4xl mb-2">🐾☕</div>
                <h4 className="text-base font-bold font-bubble text-amber-950">
                  No Booked Shifts Yet
                </h4>
                <p className="text-xs text-amber-800 max-w-md mx-auto mt-1 mb-4">
                  When a student views your published shift offers and clicks "Apply", their profile will appear here with instant Call and WhatsApp buttons!
                </p>
                {openShifts.length === 0 && (
                  <button
                    onClick={() => setCreateShiftModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Your First Shift</span>
                  </button>
                )}
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

        {/* OPEN SHIFTS (LIVE ON STUDENT'S FEED) */}
        {cafeTab === 'open' && (
          <div className="space-y-4">
            {openShifts.length === 0 ? (
              <div className="text-center py-12 px-4 bg-amber-50/50 rounded-3xl border border-dashed border-amber-200">
                <div className="text-4xl mb-2">✨☕</div>
                <h4 className="text-base font-bold font-bubble text-amber-950">
                  No Active Open Offers
                </h4>
                <p className="text-xs text-amber-800 max-w-md mx-auto mt-1 mb-4">
                  Create a shift offer (minimum 3 hours, minimum ₹100/hr) to attract students for rush hours.
                </p>
                <button
                  onClick={() => setCreateShiftModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Shift Offer Now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="bg-amber-50/70 border border-amber-200 rounded-3xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                          Live on Kolkata Feed
                        </span>
                        <span className="text-xs font-bold text-emerald-700 font-bubble">
                          ₹{shift.hourlyWage}/hr · ₹{shift.totalEarnings} total
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-amber-950 font-bubble">
                        {shift.roleName}
                      </h4>
                      <div className="text-xs text-amber-800 mt-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          <span>Date: {shift.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Time: {shift.startTime} - {shift.endTime} ({shift.durationHours} hrs)</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {shift.perks?.map((p, idx) => (
                          <span key={idx} className="text-[10px] bg-white text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs">
                      <span className="text-amber-700 font-medium">Awaiting student...</span>
                      <span className="text-[11px] text-amber-600 font-semibold">Min 3 hrs enforced</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL SHIFTS TAB */}
        {cafeTab === 'all' && (
          <div className="space-y-3">
            {cafeShifts.map(shift => (
              <div
                key={shift.id}
                className="p-4 rounded-2xl border border-amber-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-950 text-sm font-bubble">{shift.roleName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      shift.status === 'booked' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {shift.status === 'booked' ? `Booked by ${shift.applicant?.name}` : 'Open on Feed'}
                    </span>
                  </div>
                  <div className="text-amber-800 mt-1">
                    {shift.date} · {shift.startTime} - {shift.endTime} ({shift.durationHours} hrs)
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-amber-950">₹{shift.totalEarnings}</div>
                    <div className="text-[10px] text-amber-700">₹{shift.hourlyWage}/hr</div>
                  </div>
                  {shift.status === 'booked' && (
                    <button
                      onClick={() => setCafeTab('booked')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs"
                    >
                      View Student Contact
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD ANOTHER CAFE MODAL */}
      {showAddCafeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-amber-300 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-bubble text-amber-950">
              Add Another Cafe in Kolkata ☕
            </h3>
            <div>
              <label className="text-xs font-bold text-amber-900 block mb-1">Cafe Name</label>
              <input
                type="text"
                value={newCafeData.name}
                onChange={e => setNewCafeData({ ...newCafeData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-amber-900 block mb-1">Kolkata Area</label>
              <input
                type="text"
                value={newCafeData.area}
                onChange={e => setNewCafeData({ ...newCafeData, area: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-amber-900 block mb-1">Full Street Address</label>
              <input
                type="text"
                value={newCafeData.address}
                onChange={e => setNewCafeData({ ...newCafeData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCafeModal(false)}
                className="flex-1 py-2 text-xs rounded-xl border border-amber-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addOwnerCafe(newCafeData);
                  setShowAddCafeModal(false);
                }}
                className="flex-1 py-2 text-xs rounded-xl bg-amber-700 text-white font-bold"
              >
                Save Cafe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

