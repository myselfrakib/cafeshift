import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, CalendarCheck, Coffee, PlusCircle, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    isOwner,
    isAttendant,
    activeTab,
    setActiveTab,
    activeCafe,
    shifts,
    ownerCafes,
    setCreateShiftModalOpen,
    setSelectedCafeId,
    firebaseConnected,
    handleLogout
  } = useApp();

  const openShiftsCount = shifts ? shifts.filter(s => s.status === 'open').length : 0;
  const bookedShiftsCount = isOwner
    ? (shifts ? shifts.filter(s => s.cafeId === activeCafe?.id && s.status === 'booked').length : 0)
    : (shifts ? shifts.filter(s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)).length : 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab(isOwner ? 'my-cafe' : 'browse')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform font-headline">
              CCC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-[#0A011C] uppercase">
                  Calcutta Cafe Club
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100 p-1 rounded-[3px] border border-stone-200 text-xs font-bold uppercase tracking-wider">
            {/* STUDENT TABS: HOMEPAGE, MY SHIFTS, PROFILE */}
            {isAttendant && (
              <>
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5 ${
                    activeTab === 'browse'
                      ? 'bg-[#0A011C] text-white shadow-xs'
                      : 'text-stone-600 hover:text-[#0A011C]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Homepage</span>
                  {openShiftsCount > 0 && (
                    <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] ${
                      activeTab === 'browse' ? 'bg-[#FF0046] text-white' : 'bg-[#FF0046] text-white'
                    }`}>
                      {openShiftsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('my-applications')}
                  className={`px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5 ${
                    activeTab === 'my-applications'
                      ? 'bg-[#00DADC] text-black shadow-xs font-bold'
                      : 'text-stone-600 hover:text-[#0A011C]'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>My Shifts</span>
                  {bookedShiftsCount > 0 && (
                    <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] ${
                      activeTab === 'my-applications' ? 'bg-[#0A011C] text-white' : 'bg-[#00DADC] text-black'
                    }`}>
                      {bookedShiftsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5 ${
                    activeTab === 'profile'
                      ? 'bg-[#FF0046] text-white shadow-xs font-bold'
                      : 'text-stone-600 hover:text-[#0A011C]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </>
            )}

            {/* OWNER'S CAFE TAB */}
            {isOwner && (
              <button
                onClick={() => {
                  if (activeCafe) setSelectedCafeId(activeCafe.id);
                  setActiveTab('my-cafe');
                }}
                className="px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5 bg-[#FF0046] text-white font-bold shadow-2xs"
              >
                <span>☕</span>
                <span>{activeCafe ? activeCafe.name : "My Cafe Outlets"}</span>
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Post Shift button for owners */}
            {isOwner && (
              <button
                onClick={() => setCreateShiftModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-[3px] transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Shift</span>
              </button>
            )}

            {/* Quick Sign Out for desktop */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-[3px] border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-600 hover:text-[#FF0046] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
