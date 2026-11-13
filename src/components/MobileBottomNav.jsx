import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, LogOut } from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    isOwner,
    isAttendant,
    activeCafe,
    shifts,
    currentUser,
    setCreateShiftModalOpen,
    handleLogout
  } = useApp();

  const openShiftsCount = shifts.filter(s => s.status === 'open').length;
  const bookedShiftsCount = isOwner
    ? shifts.filter(s => s.cafeId === activeCafe?.id && s.status === 'booked').length
    : shifts.filter(s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)).length;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {/* 1. Browse Shifts */}
        <button
          onClick={() => setActiveTab('browse')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-[3px] transition-colors ${
            activeTab === 'browse'
              ? 'text-[#0A011C] font-bold'
              : 'text-stone-500 hover:text-[#0A011C] font-medium'
          }`}
        >
          <div className="relative">
            <span className="text-lg">🐾</span>
            {openShiftsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#FF0046] text-white text-[9px] font-bold px-1 rounded-[2px] min-w-[14px] text-center font-headline shadow-xs">
                {openShiftsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 uppercase tracking-wider font-headline">Shifts</span>
        </button>

        {/* 2. Owner Cafe OR Student Bookings */}
        {isOwner ? (
          <button
            onClick={() => setActiveTab('my-cafe')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-[3px] transition-colors ${
              activeTab === 'my-cafe'
                ? 'text-[#FF0046] font-bold'
                : 'text-stone-500 hover:text-[#0A011C] font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-lg">{activeCafe?.mascot || '☕'}</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#00DADC] text-black text-[9px] font-bold px-1 rounded-[2px] min-w-[14px] text-center font-headline shadow-xs">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 max-w-[65px] truncate uppercase tracking-wider font-headline">
              {activeCafe?.name?.split(' ')[0] || "My Cafe"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-[3px] transition-colors ${
              activeTab === 'my-applications'
                ? 'text-[#FF0046] font-bold'
                : 'text-stone-500 hover:text-[#0A011C] font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-lg">🎒</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#00DADC] text-black text-[9px] font-bold px-1 rounded-[2px] min-w-[14px] text-center font-headline shadow-xs">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 uppercase tracking-wider font-headline">My Shifts</span>
          </button>
        )}

        {/* 3. Post Offer button for owner */}
        {isOwner && (
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-[#FF0046] font-bold"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 uppercase tracking-wider font-headline">Post</span>
          </button>
        )}

        {/* 4. Sign Out */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-[3px] text-stone-500 hover:text-[#FF0046] font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 uppercase tracking-wider font-headline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
