import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, LogOut } from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    isOwner,
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#121118]/90 backdrop-blur-2xl border-t border-white/[0.08] z-40 px-3 py-2">
      <div className="flex items-center justify-around">
        {/* 1. Browse Shifts */}
        <button
          onClick={() => setActiveTab('browse')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'browse'
              ? 'text-orange-400 font-bold'
              : 'text-white/40 hover:text-white font-medium'
          }`}
        >
          <div className="relative">
            <span className="text-xl">🐾</span>
            {openShiftsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center shadow-xs">
                {openShiftsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Shifts</span>
          {activeTab === 'browse' && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-0.5 shadow-[0_0_6px_#f97316]"></span>
          )}
        </button>

        {/* 2. Owner Cafe OR Student Bookings */}
        {isOwner ? (
          <button
            onClick={() => setActiveTab('my-cafe')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'my-cafe'
                ? 'text-orange-400 font-bold'
                : 'text-white/40 hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-xl">{activeCafe?.mascot || '☕'}</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 max-w-[65px] truncate">
              {activeCafe?.name?.split(' ')[0] || "My Cafe"}
            </span>
            {activeTab === 'my-cafe' && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-0.5 shadow-[0_0_6px_#f97316]"></span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'my-applications'
                ? 'text-orange-400 font-bold'
                : 'text-white/40 hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🎒</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">My Shifts</span>
            {activeTab === 'my-applications' && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-0.5 shadow-[0_0_6px_#f97316]"></span>
            )}
          </button>
        )}

        {/* 3. Post Offer button for owner */}
        {isOwner && (
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-orange-400 font-bold"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-[0_2px_10px_rgba(255,107,0,0.4)]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Post</span>
          </button>
        )}

        {/* 4. Sign Out */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-white/40 hover:text-white font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Logout</span>
        </button>
      </div>
    </nav>
  );
}
