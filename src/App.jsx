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
import { PlusCircle } from 'lucide-react';

function AppContent() {
  const {
    currentUser,
    activeTab,
    isOwner,
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
    <div className="min-h-screen flex flex-col text-white pb-16 md:pb-0 relative overflow-hidden">
      
      {/* Background Ambient Warm Ember Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-600/15 blur-[140px] pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none -z-10"></div>

      {/* Modern Top Dark Glass Header / Navbar */}
      <Navbar />

      {/* Main Authenticated View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Modern Role Context Bar in Glass */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {currentUser.mascot || (isOwner ? '☕' : '🎒')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base text-white font-bubble">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {isOwner ? 'Cafe Owner' : 'Student Attendant'}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                {isOwner
                  ? `Managing ${activeCafe?.name || "Your Cafe"} · ${activeCafe?.area || 'Kolkata'}`
                  : `${currentUser.college || 'Kolkata Student'} · ${currentUser.address || 'Kolkata'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto z-10">
            {isOwner && (
              <button
                onClick={() => setCreateShiftModalOpen(true)}
                className="btn-orange-glow font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Shift Offer</span>
              </button>
            )}
          </div>

          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-orange-500/10 blur-xl pointer-events-none"></div>
        </div>

        {/* View Switcher based on active tab */}
        {activeTab === 'browse' && (
          <StudentShiftFeed />
        )}

        {activeTab === 'my-cafe' && (
          <OwnerCafeView />
        )}

        {activeTab === 'my-applications' && (
          <StudentApplicationsView />
        )}
      </main>

      {/* Modern Dark Glass Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#121118]/80 backdrop-blur-md py-8 px-4 mb-14 md:mb-0 text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bubble text-white font-bold text-sm">Chai & Paws Calcutta</span>
            <span>·</span>
            <span className="text-orange-400">Student Cafe Shift Platform</span>
          </div>
          <div className="flex items-center gap-4 text-white/50">
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
