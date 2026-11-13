import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, PlusCircle, ChevronDown, LogOut } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    isOwner,
    isAttendant,
    activeTab,
    setActiveTab,
    activeCafe,
    ownerCafes,
    setCreateShiftModalOpen,
    setSelectedCafeId,
    firebaseConnected,
    handleLogout
  } = useApp();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-[#0A011C] uppercase">
                  Chai & Paws
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100 p-1 rounded-[3px] border border-stone-200 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-[3px] transition-all ${
                activeTab === 'browse'
                  ? 'bg-[#0A011C] text-white'
                  : 'text-stone-600 hover:text-[#0A011C]'
              }`}
            >
              Browse Shifts
            </button>

            {/* OWNER'S CAFE TAB */}
            {isOwner && (
              <button
                onClick={() => {
                  if (activeCafe) setSelectedCafeId(activeCafe.id);
                  setActiveTab('my-cafe');
                }}
                className={`px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-cafe'
                    ? 'bg-[#FF0046] text-white'
                    : 'text-stone-600 hover:text-[#0A011C]'
                }`}
              >
                <span>☕</span>
                <span>{activeCafe ? activeCafe.name : "My Cafe"}</span>
              </button>
            )}

            {/* STUDENT'S BOOKED SHIFTS TAB */}
            {isAttendant && (
              <button
                onClick={() => setActiveTab('my-applications')}
                className={`px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-applications'
                    ? 'bg-[#00DADC] text-black'
                    : 'text-stone-600 hover:text-[#0A011C]'
                }`}
              >
                <span>🎒</span>
                <span>My Booked Shifts</span>
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

            {/* User Profile & Account Menu */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-[3px] border border-stone-200 hover:border-stone-300 bg-white transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-[3px] bg-stone-100 flex items-center justify-center text-sm border border-stone-200">
                  {currentUser?.mascot || '👤'}
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-[#0A011C] leading-tight uppercase font-headline">
                    {currentUser?.name?.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {isOwner ? 'Cafe Owner' : 'Student'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Account Dropdown */}
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-[3px] shadow-xl border border-stone-200 py-1.5 z-50 animate-pop">
                  <div className="px-3.5 py-2.5 border-b border-stone-100">
                    <p className="text-xs font-bold text-[#0A011C] uppercase font-headline">
                      {currentUser?.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      +91 {currentUser?.phone} · {isOwner ? 'Cafe Owner' : 'Student Attendant'}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        handleLogout();
                        setSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[3px] text-xs font-bold text-[#FF0046] hover:bg-[#FF0046]/10 transition-colors uppercase tracking-wider"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
