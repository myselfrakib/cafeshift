import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, PlusCircle, User, Sparkles, Store, GraduationCap, ChevronDown, Check, LogOut, Database, Wifi } from 'lucide-react';

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
    setAuthModalOpen,
    setAuthInitialMode,
    setCreateShiftModalOpen,
    setSelectedCafeId,
    firebaseConnected,
    firebaseUser,
    handleLogout
  } = useApp();

  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Top Cute Calcutta Announcement & Firebase Live Sync Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-rose-600 to-amber-800 text-white text-[11px] sm:text-xs py-1 px-4 font-medium flex items-center justify-between text-center overflow-x-auto whitespace-nowrap">
        <div className="mx-auto flex items-center gap-2">
          <span>✨ Calcutta Student Cafe Shifts</span>
          <span className="hidden sm:inline">·</span>
          <span>Guaranteed Min ₹100/Hour 💸</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">Min 3-Hour Flexible Shifts 🐾</span>
          <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.2 rounded-full text-[10px] font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${firebaseConnected ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'}`}></span>
            <span>Firebase {firebaseConnected ? 'Synced' : 'Ready'}</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-2 border-amber-300 flex items-center justify-center text-xl sm:text-2xl shadow-sm group-hover:scale-105 transition-transform duration-200">
              ☕🐾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bubble text-xl sm:text-2xl font-bold tracking-tight text-amber-950">
                  Chai & Paws
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.2 rounded-full border border-amber-300/60 uppercase tracking-wider">
                  Kolkata
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-amber-800/70 font-medium">
                Student Cafe Jobs · Rush-Hour Staffing
              </p>
            </div>
          </div>

          {/* Navigation Tabs for Tablet & Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-amber-100 text-amber-950 shadow-sm border border-amber-300/60'
                  : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-50'
              }`}
            >
              <span>🐾</span>
              <span>Available Shifts</span>
            </button>

            {/* OWNER'S CAFE TAB */}
            {isOwner && (
              <button
                onClick={() => {
                  if (activeCafe) setSelectedCafeId(activeCafe.id);
                  setActiveTab('my-cafe');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                  activeTab === 'my-cafe'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md border-amber-700 scale-102'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>☕</span>
                <span className="font-bold">
                  {activeCafe ? activeCafe.name : "Rakib's Cafe"}
                </span>
                <span className="text-xs bg-white/30 text-current px-1.5 rounded-full">
                  Owner
                </span>
              </button>
            )}

            {/* Student Bookings Tab */}
            {isAttendant && (
              <button
                onClick={() => setActiveTab('my-applications')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'my-applications'
                    ? 'bg-emerald-100 text-emerald-950 shadow-sm border border-emerald-300'
                    : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <span>🎒</span>
                <span>My Booked Shifts</span>
              </button>
            )}
          </div>

          {/* Right Actions: Quick Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Post Shift button for owners (Tablet & Desktop) */}
            {isOwner && (
              <button
                onClick={() => setCreateShiftModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md transition-transform hover:scale-102 active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Shift Offer</span>
              </button>
            )}

            {/* Quick Role / User Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200/90 rounded-2xl px-2.5 sm:px-3 py-1.5 transition-all text-left"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-200 flex items-center justify-center text-base sm:text-lg shadow-inner">
                  {currentUser?.mascot || '🐾'}
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-amber-950 leading-tight flex items-center gap-1">
                    {currentUser?.name?.split(' ')[0]}
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1 rounded font-medium">
                      {isOwner ? 'Owner' : 'Student'}
                    </span>
                  </div>
                  <div className="text-amber-700/80 text-[10px] truncate max-w-[90px]">
                    {isOwner ? (activeCafe?.name || 'Cafe Owner') : 'Attendant'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-800" />
              </button>

              {/* Dropdown Menu */}
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-amber-200 py-2 z-50 animate-pop">
                  <div className="px-4 py-2 border-b border-amber-100">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        Active Account
                      </p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Firebase
                      </span>
                    </div>
                    <p className="text-sm font-bold text-amber-950 mt-0.5">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-amber-700">
                      +91 {currentUser?.phone} · {currentUser?.role === 'owner' ? 'Cafe Owner' : 'Student Attendant'}
                    </p>
                  </div>

                  <div className="p-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 px-2 py-1">
                      Quick Demo Switcher
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          u.id === currentUser?.id
                            ? 'bg-amber-100 text-amber-950 font-bold'
                            : 'hover:bg-amber-50 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{u.mascot || '🐾'}</span>
                          <div>
                            <div>{u.name}</div>
                            <div className="text-[10px] text-amber-700">
                              {u.role === 'owner' ? '🏢 Owner (Rakib\'s Cafe)' : '🎒 Student Attendant'}
                            </div>
                          </div>
                        </div>
                        {u.id === currentUser?.id && (
                          <Check className="w-3.5 h-3.5 text-amber-700" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-amber-100 space-y-1">
                    <button
                      onClick={() => {
                        setAuthInitialMode('signup-owner');
                        setAuthModalOpen(true);
                        setSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-50 rounded-xl"
                    >
                      <span>☕</span>
                      <span>Register New Cafe Owner</span>
                    </button>
                    <button
                      onClick={() => {
                        setAuthInitialMode('signup-attendant');
                        setAuthModalOpen(true);
                        setSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-50 rounded-xl"
                    >
                      <span>🎒</span>
                      <span>Register New Student Attendant</span>
                    </button>
                    {firebaseUser && (
                      <button
                        onClick={() => {
                          handleLogout();
                          setSwitcherOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Firebase</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Login / Signup Button */}
            <button
              onClick={() => {
                setAuthInitialMode('signup-owner');
                setAuthModalOpen(true);
              }}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 sm:py-2 rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden">Join</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
