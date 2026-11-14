import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, PlusCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    isOwner,
    setActiveTab,
    activeCafe,
    setCreateShiftModalOpen,
    setSelectedCafeId,
    handleLogout,
    isEditingCafe
  } = useApp();

  if (isEditingCafe) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab(isOwner ? 'my-cafe' : 'browse')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform font-headline">
              CCC
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-headline text-base sm:text-xl font-bold tracking-tight text-[#0A011C] uppercase truncate">
                  Calcutta Cafe Club
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black hidden sm:inline">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          {/* Owner Center Navigation Tab */}
          {isOwner && (
            <nav className="flex items-center gap-1 sm:gap-1.5 bg-stone-100 p-0.5 sm:p-1 rounded-[3px] border border-stone-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider font-headline">
              <button
                onClick={() => {
                  if (activeCafe) setSelectedCafeId(activeCafe.id);
                  setActiveTab('my-cafe');
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-[3px] transition-all flex items-center gap-1.5 bg-[#FF0046] text-white font-bold shadow-2xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home ({activeCafe ? activeCafe.name : "My Cafe"})</span>
              </button>
            </nav>
          )}

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
