import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import StudentShiftFeed from './components/StudentShiftFeed';
import OwnerCafeView from './components/OwnerCafeView';
import StudentApplicationsView from './components/StudentApplicationsView';
import MobileBottomNav from './components/MobileBottomNav';
import CreateShiftModal from './components/CreateShiftModal';
import CuteToast from './components/CuteToast';
import { Coffee, MapPin, Heart, PlusCircle, ArrowUpRight } from 'lucide-react';

function AppContent() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isOwner,
    isAttendant,
    activeCafe,
    setCreateShiftModalOpen
  } = useApp();

  // STRICT AUTH GATE: Without auth, NO homepage or anything!
  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <CuteToast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 pb-16 md:pb-0">
      {/* Modern Top Header / Navbar */}
      <Navbar />

      {/* Main Authenticated View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Modern Role Context Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl shrink-0 border border-stone-200/60">
              {currentUser.mascot || (isOwner ? '☕' : '🎒')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-stone-950 font-bubble">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  {isOwner ? 'Cafe Owner' : 'Student Attendant'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {isOwner
                  ? `Managing ${activeCafe?.name || "Your Cafe"} · ${activeCafe?.area || 'Kolkata'}`
                  : `${currentUser.college || 'Kolkata Student'} · ${currentUser.address || 'Kolkata'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isOwner && (
              <button
                onClick={() => setCreateShiftModalOpen(true)}
                className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Shift Offer</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switcher based on active tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-4">
              <div>
                <h1 className="text-2xl font-bubble font-bold text-stone-950">
                  Available Cafe Shifts
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Browse and apply for verified rush-hour cafe shifts across Calcutta. Shifts lock in real-time.
                </p>
              </div>

              <div className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200/60 self-start sm:self-auto">
                Minimum wage: <strong className="text-stone-900">₹100/hr</strong> · Shifts: <strong className="text-stone-900">3+ hrs</strong>
              </div>
            </div>

            <StudentShiftFeed />
          </div>
        )}

        {activeTab === 'my-cafe' && (
          <OwnerCafeView />
        )}

        {activeTab === 'my-applications' && (
          <StudentApplicationsView />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-8 px-4 mb-14 md:mb-0 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bubble text-stone-900 font-bold text-sm">Chai & Paws Calcutta</span>
            <span>·</span>
            <span>Student Cafe Work Platform</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Park Street</span>
            <span>·</span>
            <span>Southern Avenue</span>
            <span>·</span>
            <span>Salt Lake Sector 5</span>
            <span>·</span>
            <span>Hindustan Park</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens) */}
      <MobileBottomNav />

      {/* Global Modals & Toasts */}
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
