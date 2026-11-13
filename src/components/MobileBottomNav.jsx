import React from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Search, PlusCircle, User, Sparkles, GraduationCap } from 'lucide-react';

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
    setAuthModalOpen,
    setAuthInitialMode,
    firebaseConnected
  } = useApp();

  const openShiftsCount = shifts.filter(s => s.status === 'open').length;
  const bookedShiftsCount = isOwner
    ? shifts.filter(s => s.cafeId === activeCafe?.id && s.status === 'booked').length
    : shifts.filter(s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)).length;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-amber-200/90 z-40 px-2 py-1.5 shadow-[0_-4px_20px_rgba(74,53,37,0.08)]">
      <div className="flex items-center justify-around">
        {/* 1. Browse Shifts */}
        <button
          onClick={() => setActiveTab('browse')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'browse'
              ? 'text-amber-950 font-bold'
              : 'text-amber-800/70 hover:text-amber-900 font-medium'
          }`}
        >
          <div className="relative">
            <span className="text-xl">🐾</span>
            {openShiftsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                {openShiftsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Shifts</span>
          {activeTab === 'browse' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-0.5"></span>
          )}
        </button>

        {/* 2. Owner Cafe OR Student Bookings */}
        {isOwner ? (
          <button
            onClick={() => setActiveTab('my-cafe')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'my-cafe'
                ? 'text-amber-950 font-bold'
                : 'text-amber-800/70 hover:text-amber-900 font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-xl">{activeCafe?.mascot || '☕'}</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center animate-pulse">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 max-w-[65px] truncate">
              {activeCafe?.name?.split(' ')[0] || "My Cafe"}
            </span>
            {activeTab === 'my-cafe' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-0.5"></span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'my-applications'
                ? 'text-emerald-950 font-bold'
                : 'text-amber-800/70 hover:text-amber-900 font-medium'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🎒</span>
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">My Shifts</span>
            {activeTab === 'my-applications' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5"></span>
            )}
          </button>
        )}

        {/* 3. Elevated Center Action Button: Post Offer for owner, or Instant Apply helper */}
        {isOwner ? (
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-700 text-white shadow-lg flex items-center justify-center border-3 border-white hover:scale-105 active:scale-95 transition-transform"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('browse')}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-center border-3 border-white hover:scale-105 active:scale-95 transition-transform"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        )}

        {/* 4. Firebase Account / Auth */}
        <button
          onClick={() => {
            setAuthInitialMode('login');
            setAuthModalOpen(true);
          }}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-amber-800/70 hover:text-amber-900 font-medium"
        >
          <div className="relative">
            <span className="text-xl">{currentUser?.mascot || '👤'}</span>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
              firebaseConnected ? 'bg-emerald-500' : 'bg-amber-400'
            }`}></span>
          </div>
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
}
