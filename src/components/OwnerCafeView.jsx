import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApplicantCard from './ApplicantCard';
import AddCafeModal from './AddCafeModal';
import { PlusCircle, MapPin, Plus, Edit3, Store, Trash2 } from 'lucide-react';
import { formatDateDDMMYYYY, formatTime12Hour } from '../utils/dateTime';

export default function OwnerCafeView() {
  const {
    currentUser,
    activeCafe,
    ownerCafes,
    shifts,
    setSelectedCafeId,
    setCreateShiftModalOpen,
    cancelShiftApplication,
    deleteShift,
    showToast
  } = useApp();

  const [cafeTab, setCafeTab] = useState('booked'); // 'booked' | 'open'
  const [addCafeModalOpen, setAddCafeModalOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState(null);

  const cafe = activeCafe;

  if (!cafe) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-[3px] border border-stone-200 shadow-sm mt-6 space-y-4">
        <div className="w-12 h-12 rounded-[3px] bg-stone-100 flex items-center justify-center text-2xl mx-auto border border-stone-200">
          ☕
        </div>
        <h3 className="text-lg font-bold font-headline text-[#0A011C] uppercase">No Cafe Registered Yet</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Register your first cafe or restaurant branch to start posting shift offers for college students.
        </p>
        <button
          onClick={() => {
            setEditingCafe(null);
            setAddCafeModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Your Cafe</span>
        </button>
        <AddCafeModal
          isOpen={addCafeModalOpen}
          onClose={() => setAddCafeModalOpen(false)}
          editCafe={null}
        />
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
      
      {/* Cafe Multi-Branch Manager Bar */}
      <div className="bg-white rounded-[3px] p-3.5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs flex-1 no-scrollbar">
          <span className="font-bold uppercase tracking-wider text-stone-500 shrink-0 font-headline flex items-center gap-1.5 mr-1 text-[11px]">
            <Store className="w-3.5 h-3.5 text-[#FF0046]" />
            <span>Your Cafes ({ownerCafes.length}):</span>
          </span>
          {ownerCafes.map(c => {
            const cShifts = shifts.filter(s => s.cafeId === c.id);
            const bookedCount = cShifts.filter(s => s.status === 'booked').length;
            const isActive = c.id === cafe.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCafeId(c.id)}
                className={`px-3 py-1.5 rounded-[3px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-[#0A011C] text-white border-[#0A011C] shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:text-black hover:bg-stone-100 border-stone-200'
                }`}
              >
                <div className="w-4 h-4 rounded-[2px] bg-white/20 flex items-center justify-center overflow-hidden text-[9px]">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    '☕'
                  )}
                </div>
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] ${
                  isActive ? 'bg-[#FF0046] text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {c.area}
                </span>
                {bookedCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#00DADC]" title={`${bookedCount} booked candidate(s)`}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* + Add Another Cafe Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setEditingCafe(null);
              setAddCafeModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-stone-200 bg-stone-50 hover:bg-stone-100 text-[#0A011C] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF0046]" />
            <span>Add Cafe</span>
          </button>
        </div>
      </div>

      {/* Cafe Header Banner (Clean White Surface with 3px corners & IFP accents) */}
      <div className="bg-white rounded-[3px] border border-stone-200 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-[3px] bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {cafe.photoUrl ? (
              <img src={cafe.photoUrl} alt={cafe.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-headline font-bold text-xl text-[#FF0046]">
                {cafe.name ? cafe.name.slice(0, 2).toUpperCase() : '☕'}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                {cafe.area}, Kolkata
              </span>
              <button
                onClick={() => {
                  setEditingCafe(cafe);
                  setAddCafeModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-bold uppercase tracking-wider border border-stone-200 transition-colors"
                title="Edit Cafe Details"
              >
                <Edit3 className="w-3 h-3 text-stone-500" />
                <span>Edit Info</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A011C] uppercase tracking-tight mt-1">
              {cafe.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-lg leading-relaxed">
              {cafe.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
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
          <span className="text-center text-[11px] text-stone-400 font-medium font-headline uppercase">
            Min 3 hrs · Min ₹100/hr
          </span>
        </div>
      </div>

      {/* Metrics Row (IFP 3px corners, Light White Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider font-headline">
            Booked Candidates
          </span>
          <div className="text-2xl font-headline font-bold text-[#0A011C] mt-1">
            {bookedShifts.length}
          </div>
          <p className="text-[11px] text-[#008b8d] font-semibold mt-0.5">Ready to contact</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider font-headline">
            Live Offers
          </span>
          <div className="text-2xl font-headline font-bold text-[#0A011C] mt-1">
            {openShifts.length}
          </div>
          <p className="text-[11px] text-[#FE9900] font-semibold mt-0.5">Listed for students</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider font-headline">
            Base Wage
          </span>
          <div className="text-2xl font-headline font-bold text-[#FF0046] mt-1">
            ₹{cafe.minHourlyWage}/hr
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">≥ ₹100 guarantee</p>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider font-headline">
            Owner Contact
          </span>
          <div className="text-sm font-bold text-[#0A011C] mt-1 font-mono">
            +91 {currentUser?.phone}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">{currentUser?.name}</p>
        </div>
      </div>

      {/* Shift Management Tabs */}
      <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-lg font-headline font-bold text-[#0A011C] uppercase tracking-tight">
              Shift Offers & Candidate Contacts
            </h3>
            <p className="text-xs text-stone-500">
              Managing shifts at <strong className="text-stone-800">{cafe.name}</strong> ({cafe.area}). When a student applies, the shift locks instantly.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-[3px] border border-stone-200 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setCafeTab('booked')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                cafeTab === 'booked' ? 'bg-[#FF0046] text-white shadow-xs' : 'text-stone-600 hover:text-[#0A011C]'
              }`}
            >
              Booked Candidates ({bookedShifts.length})
            </button>
            <button
              onClick={() => setCafeTab('open')}
              className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                cafeTab === 'open' ? 'bg-[#00DADC] text-black shadow-xs' : 'text-stone-600 hover:text-[#0A011C]'
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
              <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200">
                <div className="text-2xl mb-1 text-[#FF0046]">📋</div>
                <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Booked Candidates Yet for {cafe.name}</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
                  When a student taps "Apply" on a shift at this cafe, their profile and contact buttons will appear here immediately.
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
                    onDelete={deleteShift}
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
              <div className="text-center py-12 px-4 bg-stone-50 rounded-[3px] border border-dashed border-stone-200">
                <h4 className="text-sm font-bold text-[#0A011C] font-headline uppercase">No Open Shifts for {cafe.name}</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-3">
                  Publish a shift offer to find students for your upcoming rush hours.
                </p>
                <button
                  onClick={() => setCreateShiftModalOpen(true)}
                  className="px-4 py-2 bg-[#FF0046] hover:bg-[#E6003F] text-white rounded-[3px] text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  Create Shift Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="p-4 rounded-[3px] border border-stone-200 bg-stone-50 flex flex-col justify-between text-xs hover:border-stone-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00DADC]/15 text-[#008b8d] px-2 py-0.5 rounded-[3px] border border-[#00DADC]/30">
                          Active on Feed
                        </span>
                        <span className="font-bold text-[#008b8d] font-headline text-sm">
                          ₹{shift.hourlyWage}/hr · ₹{shift.totalEarnings} total
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0A011C] font-headline uppercase">{shift.roleName}</h4>
                      <div className="text-stone-500 mt-2 space-y-1">
                        <div>Date: <strong className="text-stone-700">{formatDateDDMMYYYY(shift.date)}</strong></div>
                        <div>Timing: <strong className="text-stone-700">{formatTime12Hour(shift.startTime)} – {formatTime12Hour(shift.endTime)}</strong> ({shift.durationHours} hrs)</div>
                      </div>
                    </div>

                    {/* Delete Open Shift Action */}
                    <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-stone-400 font-medium">Unbooked · Available on feed</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete the shift offer "${shift.roleName}"? It will be permanently removed from the feed.`)) {
                            deleteShift(shift.id);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-[3px] border border-stone-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-stone-600 hover:text-[#FF0046] font-bold text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Shift</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Cafe Modal */}
      <AddCafeModal
        isOpen={addCafeModalOpen}
        onClose={() => {
          setAddCafeModalOpen(false);
          setEditingCafe(null);
        }}
        editCafe={editingCafe}
      />

    </div>
  );
}
