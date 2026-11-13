import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, CalendarCheck, User, PlusCircle, LogOut, Coffee } from 'lucide-react';

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

  // 1. STUDENT BOTTOM NAVBAR: 3 Clear Tabs (Homepage | My Shifts | Profile)
  if (isAttendant) {
    return (
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40 px-3 py-2 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          
          {/* 1. HOMEPAGE: Lists of shifts available for applying */}
          <button
            onClick={() => setActiveTab('browse')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-[3px] transition-all group ${
              activeTab === 'browse'
                ? 'bg-[#0A011C] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#0A011C] hover:bg-stone-100'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 transition-transform group-hover:scale-105 ${activeTab === 'browse' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {openShiftsCount > 0 && (
                <span className={`absolute -top-1.5 -right-2.5 text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] min-w-[16px] text-center font-headline shadow-xs ${
                  activeTab === 'browse' ? 'bg-[#FF0046] text-white' : 'bg-[#FF0046] text-white'
                }`}>
                  {openShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider font-headline">
              Homepage
            </span>
          </button>

          {/* 2. MY SHIFTS: Middle Button (Applied / Booked Shifts) */}
          <button
            onClick={() => setActiveTab('my-applications')}
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

          {/* 3. PROFILE: Student Profile Page */}
          <button
            onClick={() => setActiveTab('profile')}
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

  // 2. OWNER BOTTOM NAVBAR (Outlets | Post Shift | Logout)
  if (isOwner) {
    return (
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {/* Owner Cafe Outlets */}
          <button
            onClick={() => setActiveTab('my-cafe')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-[3px] transition-colors ${
              activeTab === 'my-cafe'
                ? 'text-[#FF0046] font-bold'
                : 'text-stone-500 hover:text-[#0A011C] font-medium'
            }`}
          >
            <div className="relative">
              <Coffee className="w-5 h-5" />
              {bookedShiftsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#00DADC] text-black text-[9px] font-bold px-1 rounded-[2px] min-w-[14px] text-center font-headline shadow-xs">
                  {bookedShiftsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 max-w-[75px] truncate uppercase tracking-wider font-headline">
              {activeCafe?.name?.split(' ')[0] || "My Cafe"}
            </span>
          </button>

          {/* Post Shift Modal Button */}
          <button
            onClick={() => setCreateShiftModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-[#FF0046] font-bold"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 uppercase tracking-wider font-headline">Post Shift</span>
          </button>

          {/* Owner Logout */}
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

  return null;
}
