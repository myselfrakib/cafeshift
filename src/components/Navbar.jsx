import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, PlusCircle, User, ChevronDown, Check, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    isOwner,
    isAttendant,
    activeTab,
    setActiveTab,
    activeCafe,
    ownerCafes,
    users,
    switchUser,
    setCreateShiftModalOpen,
    setSelectedCafeId,
    firebaseConnected,
    handleLogout
  } = useApp();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-lg font-bold tracking-tight text-stone-950">
                  Chai & Paws
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'browse'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
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
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-cafe'
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
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
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-applications'
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
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
                className="hidden sm:flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Shift</span>
              </button>
            )}

            {/* User Profile & Account Menu */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-sm">
                  {currentUser?.mascot || '👤'}
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-stone-900 leading-tight">
                    {currentUser?.name?.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    {isOwner ? 'Cafe Owner' : 'Student'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Account Dropdown */}
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-pop">
                  <div className="px-3.5 py-2.5 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-950">
                      {currentUser?.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      +91 {currentUser?.phone} · {isOwner ? 'Cafe Owner' : 'Student Attendant'}
                    </p>
                  </div>

                  <div className="p-1.5 border-b border-stone-100">
                    <p className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1">
                      Switch Role (Demo)
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          u.id === currentUser?.id
                            ? 'bg-stone-100 font-bold text-stone-950'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{u.mascot || '👤'}</span>
                          <span className="truncate">{u.name} ({u.role === 'owner' ? 'Owner' : 'Student'})</span>
                        </div>
                        {u.id === currentUser?.id && <Check className="w-3.5 h-3.5 text-stone-900" />}
                      </button>
                    ))}
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        handleLogout();
                        setSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
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
