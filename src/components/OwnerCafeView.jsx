import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApplicantCard from './ApplicantCard';
import { PlusCircle, MapPin } from 'lucide-react';

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

  const [cafeTab, setCafeTab] = useState('booked'); // 'booked' | 'open'

  const cafe = activeCafe;

  if (!cafe) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-[#12052E] rounded-[3px] border border-[#2A1354] mt-6">
        <h3 className="text-lg font-bold font-headline text-white uppercase">No Cafe Registered</h3>
        <p className="text-xs text-[#A399BA] mt-1 mb-4">You have not registered any cafe yet.</p>
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
          <span className="font-bold uppercase tracking-wider text-[#A399BA] shrink-0 font-headline">Your Cafes:</span>
          {ownerCafes.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCafeId(c.id)}
              className={`px-3 py-1.5 rounded-[3px] font-bold uppercase tracking-wider transition-colors ${
                c.id === cafe.id
                  ? 'bg-[#FF0046] text-white'
                  : 'bg-[#12052E] text-[#A399BA] hover:text-white border border-[#2A1354]'
              }`}
            >
              <span>{c.mascot}</span>
              <span className="ml-1.5">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cafe Header Banner (IFP Dark Surface with 3px corners) */}
      <div className="bg-[#12052E] rounded-[3px] border border-[#2A1354] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-[3px] bg-[#1E0D48] text-[#FF0046] border border-[#3D1C7A] flex items-center justify-center text-3xl shrink-0">
            {cafe.mascot || '☕'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                {cafe.area}, Kolkata
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white uppercase tracking-tight mt-1">
              {cafe.name}
            </h1>
            <p className="text-xs text-[#A399BA] mt-1 max-w-lg">
              {cafe.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#A399BA]">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
              <span>{cafe.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase tracking-wider px-5 py-3 rounded-[3px] transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Shift Offer</span>
          </button>
          <span className="text-center text-[11px] text-[#A399BA] font-medium font-headline uppercase">
            Min 3 hrs · Min ₹100/hr
          </span>
        </div>
      </div>

      {/* Metrics Row (IFP 3px corners) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#12052E] p-4 rounded-[3px] border border-[#2A1354]">
          <span className="text-[11px] font-bold text-[#A399BA] block uppercase tracking-wider font-headline">
            Booked Candidates
          </span>
          <div className="text-2xl font-headline font-bold text-white mt-1">
            {bookedShifts.length}
          </div>
          <p className="text-[11px] text-[#00DADC] mt-0.5">Ready to contact</p>
        </div>

        <div className="bg-[#12052E] p-4 rounded-[3px] border border-[#2A1354]">
          <span className="text-[11px] font-bold text-[#A399BA] block uppercase tracking-wider font-headline">
            Live Offers
          </span>
          <div className="text-2xl font-headline font-bold text-white mt-1">
            {openShifts.length}
          </div>
          <p className="text-[11px] text-[#FE9900] mt-0.5">Listed for students</p>
        </div>

        <div className="bg-[#12052E] p-4 rounded-[3px] border border-[#2A1354]">
          <span className="text-[11px] font-bold text-[#A399BA] block uppercase tracking-wider font-headline">
            Base Wage
          </span>
          <div className="text-2xl font-headline font-bold text-[#00DADC] mt-1">
            ₹{cafe.minHourlyWage}/hr
          </div>
          <p className="text-[11px] text-[#A399BA] mt-0.5">≥ ₹100 guarantee</p>
        </div>

        <div className="bg-[#12052E] p-4 rounded-[3px] border border-[#2A1354]">
          <span className="text-[11px] font-bold text-[#A399BA] block uppercase tracking-wider font-headline">
            Owner Contact
          </span>
          <div className="text-sm font-bold text-white mt-1 font-mono">
            +91 {currentUser?.phone}
          </div>
          <p className="text-[11px] text-[#A399BA] mt-0.5">{currentUser?.name}</p>
        </div>
      </div>

      {/* Shift Management Tabs */}
      <div className="bg-[#12052E] rounded-[3px] p-5 sm:p-6 border border-[#2A1354] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A1354] pb-4">
          <div>
            <h3 className="text-lg font-headline font-bold text-white uppercase tracking-tight">
              Shift Offers & Candidate Contacts
            </h3>
            <p className="text-xs text-[#A399BA]">
              When a student applies, the shift locks instantly. Contact candidates directly via phone or WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0A011C] p-1 rounded-[3px] border border-[#2A1354] text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setCafeTab('booked')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                cafeTab === 'booked' ? 'bg-[#FF0046] text-white' : 'text-[#A399BA] hover:text-white'
              }`}
            >
              Booked Candidates ({bookedShifts.length})
            </button>
            <button
              onClick={() => setCafeTab('open')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                cafeTab === 'open' ? 'bg-[#00DADC] text-black' : 'text-[#A399BA] hover:text-white'
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
              <div className="text-center py-12 px-4 bg-[#160838] rounded-[3px] border border-dashed border-[#2A1354]">
                <div className="text-2xl mb-1 text-[#FF0046]">📋</div>
                <h4 className="text-sm font-bold text-white font-headline uppercase">No Booked Candidates Yet</h4>
                <p className="text-xs text-[#A399BA] max-w-sm mx-auto mt-1 mb-3">
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
              <div className="text-center py-12 px-4 bg-[#160838] rounded-[3px] border border-dashed border-[#2A1354]">
                <h4 className="text-sm font-bold text-white font-headline uppercase">No Open Shifts Currently Listed</h4>
                <p className="text-xs text-[#A399BA] max-w-sm mx-auto mt-1 mb-3">
                  Create a shift offer to find students for your upcoming rush hours.
                </p>
                <button
                  onClick={() => setCreateShiftModalOpen(true)}
                  className="px-4 py-2 bg-[#FF0046] hover:bg-[#E6003F] text-white rounded-[3px] text-xs font-bold uppercase tracking-wider"
                >
                  Create Shift Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="p-4 rounded-[3px] border border-[#2A1354] bg-[#160838] flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/15 text-[#00DADC] px-2 py-0.5 rounded-[3px] border border-[#00DADC]/30">
                          Active on Feed
                        </span>
                        <span className="font-bold text-[#00DADC] font-headline">
                          ₹{shift.hourlyWage}/hr · ₹{shift.totalEarnings} total
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white font-headline uppercase">{shift.roleName}</h4>
                      <div className="text-[#A399BA] mt-2 space-y-1">
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
