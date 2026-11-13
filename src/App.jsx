import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import StudentShiftFeed from './components/StudentShiftFeed';
import OwnerCafeView from './components/OwnerCafeView';
import StudentApplicationsView from './components/StudentApplicationsView';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import CreateShiftModal from './components/CreateShiftModal';
import CuteToast from './components/CuteToast';
import { Coffee, Heart, Sparkles, MapPin, ShieldCheck, ChevronRight, Database, Wifi } from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    isOwner,
    isAttendant,
    currentUser,
    activeCafe,
    switchUser,
    users,
    firebaseConnected
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container (Responsive padding for Mobile, Tablet & Desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Quick Demo Switcher Bar */}
        <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl shrink-0">🐾</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-amber-950">
                  Viewing as: <strong className="underline decoration-amber-500 font-bubble">{currentUser?.name}</strong>
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {isOwner ? '🏢 Cafe Owner' : '🎒 Student Attendant'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1 ${
                  firebaseConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${firebaseConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span>hungrybites-c7930</span>
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {isOwner
                  ? `Owner of ${activeCafe?.name || "Rakib's Cafe"} · Click the cafe tab to post offers & view applicant contacts!`
                  : `Student at ${currentUser?.college || "Kolkata"} · Click 'Apply Now' on any shift to book and test!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            {isOwner ? (
              <button
                onClick={() => {
                  const student = users.find(u => u.role === 'attendant');
                  if (student) switchUser(student.id);
                  setActiveTab('browse');
                }}
                className="w-full sm:w-auto bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
              >
                <span>🎒</span>
                <span>Switch to Student (Ananya)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const owner = users.find(u => u.role === 'owner');
                  if (owner) switchUser(owner.id);
                  setActiveTab('my-cafe');
                }}
                className="w-full sm:w-auto bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
              >
                <span>☕</span>
                <span>Switch to Owner (Rakib's Cafe)</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switcher based on active tab */}
        {activeTab === 'browse' && (
          <div className="space-y-5 sm:space-y-6">
            <HeroBanner />
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bubble font-bold text-amber-950 flex items-center gap-2">
                    <span>☕ Available Cafe Shifts in Calcutta</span>
                    <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full font-sans">
                      Live
                    </span>
                  </h2>
                  <p className="text-xs text-amber-800">
                    Applying instantly books the shift in Firebase and removes it from public listings.
                  </p>
                </div>
              </div>
              <StudentShiftFeed />
            </div>
          </div>
        )}

        {activeTab === 'my-cafe' && (
          <OwnerCafeView />
        )}

        {activeTab === 'my-applications' && (
          <StudentApplicationsView />
        )}
      </main>

      {/* Cute Responsive Footer */}
      <footer className="mt-auto bg-amber-950 text-amber-100 border-t border-amber-900/50 py-10 px-4 mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☕🐾</span>
              <span className="font-bubble text-xl font-bold text-white">Chai & Paws Calcutta</span>
            </div>
            <p className="text-amber-300/80 leading-relaxed max-w-sm">
              Empowering Kolkata's school & college students with flexible hourly cafe work.
              Backed by Firebase Realtime Database, Firestore, and Storage.
            </p>
            <div className="mt-3 text-[11px] text-amber-400 font-semibold">
              Minimum wage guarantee: ₹100/hr · Minimum shift: 3 hours
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3 font-bubble">Kolkata Cafe Hubs</h4>
            <ul className="space-y-1.5 text-amber-200/80">
              <li>📍 Park Street & Camac Street</li>
              <li>📍 Southern Avenue & Hindustan Park</li>
              <li>📍 Salt Lake Sector 1 & Sector 5 IT Hub</li>
              <li>📍 New Town, Ballygunge & Gariahat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3 font-bubble">Firebase Cloud Architecture</h4>
            <div className="space-y-2">
              <p className="text-amber-200/80">
                Connected to project <strong className="text-amber-300">hungrybites-c7930</strong>:
                Realtime shift locks, Firebase Auth for owners & attendants, and Firebase Storage photo uploads.
              </p>
              <div className="flex items-center gap-2 text-amber-300 font-bold mt-2">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>for Calcutta's Cafe Culture</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-amber-900 mt-8 pt-4 text-center text-[11px] text-amber-400/60">
          © {new Date().getFullYear()} Chai & Paws Calcutta. All rights reserved.
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens) */}
      <MobileBottomNav />

      {/* Global Modals & Toasts */}
      <AuthModal />
      <CreateShiftModal />
      <CuteToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
