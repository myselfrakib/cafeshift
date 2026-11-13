import React from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Search, PlusCircle, LogOut } from 'lucide-react';

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
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/90 z-40 px-3 py-2 shadow-sm">
      <div className="flex items-center justify-around">
        {/* 1. Browse Shifts */}
        <button
          onClick={() => setActiveTab('browse')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'browse'
              ? 'text-stone-950 font-bold'
              : 'text-stone-400 hover:text-stone-700 font-medium'
          }`}
        >
          <div className="relative">
            <span className="text-lg">🐾</span>
            {openShiftsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-stone-900 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                {openShiftsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Shifts</span>
        </button>

        {/* 2. Owner Cafe OR Student Bookings */}
        {isOwner ? (
          <button
            onClick={() => setActiveTab('my-cafe')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'my-cafe'
                ? 'text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-lg">{activeCafe?.mascot || '☕'}</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 max-w-[65px] truncate">
              {activeCafe?.name?.split(' ')[0] || "My Cafe"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'my-applications'
                ? 'text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-700 font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-lg">🎒</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">My Shifts</span>
          </button>
        )}

        {/* 3. Post Offer button for owner */}
        {isOwner && (
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-stone-900 font-bold"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Post</span>
          </button>
        )}

        {/* 4. Sign Out */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-400 hover:text-stone-700 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Logout</span>
        </button>
      </div>
    </nav>
  );
}
