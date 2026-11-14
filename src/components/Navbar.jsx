import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    isOwner,
    handleLogout,
    isEditingCafe,
    createShiftModalOpen,
    createJobModalOpen
  } = useApp();

  // Hide top bar during full-screen edit cafe, publish shift, or publish job modes
  if (isEditingCafe || createShiftModalOpen || createJobModalOpen) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Logo & Whole Brand Name: Calcutta Cafe Club */}
          <div className="flex items-center gap-2.5 sm:gap-3 select-none">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-tighter shadow-sm font-headline shrink-0">
              CCC
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-headline text-base sm:text-xl font-bold tracking-tight text-[#0A011C] uppercase whitespace-nowrap">
                Calcutta Cafe Club
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                Kolkata
              </span>
            </div>
          </div>

          {/* Right Role Status Pill & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-[2px] bg-stone-100 text-stone-700 border border-stone-200 font-headline inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DADC]"></span>
              <span>{isOwner ? 'Cafe Owner' : 'Student Attendant'}</span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-600 hover:text-[#FF0046] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
              title="Sign Out"
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
