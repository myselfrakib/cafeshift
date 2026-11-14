import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, CalendarCheck, User, PlusCircle, LogOut } from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    isOwner,
    isAttendant,
    activeCafe,
    shifts,
    currentUser,
    createShiftModalOpen,
    setCreateShiftModalOpen,
    handleLogout,
    isEditingCafe
  } = useApp();

  if (isEditingCafe) return null;

  const openShiftsCount = (shifts || []).filter(s => s.status === 'open').length;
  const bookedShiftsCount = isOwner
    ? (shifts || []).filter(s => s.cafeId === activeCafe?.id && s.status === 'booked').length
    : (shifts || []).filter(s => s.status === 'booked' && (s.applicant?.userId === currentUser?.id || s.applicant?.email === currentUser?.email)).length;

  const navigateTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. ATTENDING SIDE BOTTOM NAVBAR: Fixed at bottom with 3 individual page tabs
  // (Home / Available Shifts | My Shifts | Attendant Profile)
  if (isAttendant) {
    return (
      <nav 
        aria-label="Attendant Bottom Navigation"
        className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-50 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          
          {/* 1. HOMEPAGE: Lists of shifts available for applying */}
          <button
            type="button"
            onClick={() => navigateTab('browse')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all group ${
              activeTab === 'browse'
                ? 'bg-[#0A011C] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#0A011C] hover:bg-stone-100'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 transition-transform group-hover:scale-105 ${activeTab === 'browse' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {openShiftsCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] min-w-[16px] text-center font-headline shadow-xs bg-[#FF0046] text-white">
                  {openShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              Home
            </span>
          </button>

          {/* 2. MY SHIFTS: Applied / Booked Shifts */}
          <button
            type="button"
            onClick={() => navigateTab('my-applications')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all group ${
              activeTab === 'my-applications'
                ? 'bg-[#00DADC] text-black shadow-xs font-bold'
                : 'text-stone-600 hover:text-[#0A011C] hover:bg-stone-100'
            }`}
          >
            <div className="relative">
              <CalendarCheck className={`w-5 h-5 transition-transform group-hover:scale-105 ${activeTab === 'my-applications' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {bookedShiftsCount > 0 && (
                <span className={`absolute -top-1.5 -right-2.5 text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] min-w-[16px] text-center font-headline shadow-xs ${
                  activeTab === 'my-applications' ? 'bg-[#0A011C] text-white' : 'bg-[#00DADC] text-black'
                }`}>
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              My Shifts
            </span>
          </button>

          {/* 3. PROFILE: Attendant Profile Page */}
          <button
            type="button"
            onClick={() => navigateTab('profile')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all group ${
              activeTab === 'profile'
                ? 'bg-[#FF0046] text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-[#0A011C] hover:bg-stone-100'
            }`}
          >
            <div className={`w-5 h-5 rounded-[2px] overflow-hidden border flex items-center justify-center transition-all ${
              activeTab === 'profile'
                ? 'border-white ring-1 ring-white'
                : 'border-stone-300 bg-stone-100 group-hover:border-[#0A011C]'
            }`}>
              {currentUser?.photoUrl ? (
                <img src={currentUser.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className={`w-3.5 h-3.5 ${activeTab === 'profile' ? 'text-white' : 'text-stone-600'}`} />
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              Profile
            </span>
          </button>

        </div>
      </nav>
    );
  }

  // 2. OWNER BOTTOM NAVBAR (Home | Post Shift | Logout)
  if (isOwner) {
    const isHomeActive = activeTab === 'my-cafe' && !createShiftModalOpen;
    const isPostActive = Boolean(createShiftModalOpen);

    return (
      <nav 
        aria-label="Owner Bottom Navigation"
        className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-50 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          
          {/* 1. Owner Home View */}
          <button
            type="button"
            onClick={() => {
              setCreateShiftModalOpen(false);
              setActiveTab('my-cafe');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all group ${
              isHomeActive
                ? 'bg-[#0A011C] text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-[#0A011C] hover:bg-stone-100 font-medium'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 transition-transform group-hover:scale-105 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#00DADC] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] min-w-[16px] text-center font-headline shadow-xs">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              Home
            </span>
          </button>

          {/* 2. Post Shift Modal Button */}
          <button
            type="button"
            onClick={() => setCreateShiftModalOpen(true)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all group ${
              isPostActive
                ? 'bg-[#FF0046] text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-[#0A011C] hover:bg-stone-100 font-medium'
            }`}
          >
            <PlusCircle className={`w-5 h-5 transition-transform group-hover:scale-105 ${isPostActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              Post Shift
            </span>
          </button>

          {/* 3. Owner Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all text-stone-500 hover:text-[#FF0046] hover:bg-stone-100 font-medium group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-105 stroke-2" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              Logout
            </span>
          </button>

        </div>
      </nav>
    );
  }

  return null;
}
