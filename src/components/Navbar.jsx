import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, PlusCircle, ChevronDown, Check, LogOut } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    isOwner,
    isAttendant,
    activeTab,
    setActiveTab,
    activeCafe,
    users,
    switchUser,
    setCreateShiftModalOpen,
    setSelectedCafeId,
    handleLogout
  } = useApp();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#121118]/80 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-[0_4px_16px_rgba(255,107,0,0.35)] group-hover:scale-105 transition-transform">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-lg font-bold tracking-tight text-white">
                  Chai & Paws
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-orange-400 border border-white/[0.1]">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.05] p-1.5 rounded-2xl border border-white/[0.08] text-xs font-semibold backdrop-blur-md">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'browse'
                  ? 'glass-pill-active font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
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
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-cafe'
                    ? 'glass-pill-active font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
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
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-applications'
                    ? 'glass-pill-active font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
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
                className="hidden sm:flex items-center gap-1.5 btn-orange-glow font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Shift</span>
              </button>
            )}

            {/* User Profile & Account Menu */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.09] transition-all text-left backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-sm">
                  {currentUser?.mascot || '👤'}
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-white leading-tight">
                    {currentUser?.name?.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-orange-400 font-medium">
                    {isOwner ? 'Cafe Owner' : 'Student'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
              </button>

              {/* Account Dropdown */}
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl py-2 z-50 animate-pop">
                  <div className="px-4 py-2.5 border-b border-white/[0.08]">
                    <p className="text-xs font-bold text-white">
                      {currentUser?.name}
                    </p>
                    <p className="text-[11px] text-white/50">
                      +91 {currentUser?.phone} · {isOwner ? 'Cafe Owner' : 'Student Attendant'}
                    </p>
                  </div>

                  <div className="p-1.5 border-b border-white/[0.08]">
                    <p className="text-[10px] uppercase font-bold text-white/40 px-2 py-1">
                      Switch Role (Demo)
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors text-left ${
                          u.id === currentUser?.id
                            ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30'
                            : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{u.mascot || '👤'}</span>
                          <span className="truncate">{u.name} ({u.role === 'owner' ? 'Owner' : 'Student'})</span>
                        </div>
                        {u.id === currentUser?.id && <Check className="w-3.5 h-3.5 text-orange-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        handleLogout();
                        setSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
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
