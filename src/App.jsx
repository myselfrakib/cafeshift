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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0A011C] pb-16 md:pb-0">
      {/* Navbar */}
      <Navbar />

      {/* Main Authenticated View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Role Context Bar */}
        <div className="bg-white rounded-[3px] p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[3px] bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-headline font-bold text-sm text-[#FF0046]">
                  {currentUser.name ? currentUser.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() : (isOwner ? '☕' : 'CC')}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline font-bold text-base text-[#0A011C] uppercase tracking-tight">
                  {currentUser.name}
                </span>
                <span className={`text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-[3px] ${
                  isOwner
                    ? 'bg-[#FF0046] text-white'
                    : 'bg-[#00DADC] text-black'
                }`}>
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
                className="bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-[3px] shadow-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Shift Offer</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switcher based on active tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A011C] uppercase tracking-tight">
                  Available Cafe Shifts
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Browse and apply for verified rush-hour cafe shifts across Calcutta. Shifts lock in real-time.
                </p>
              </div>

              <div className="text-xs font-semibold text-stone-600 bg-white px-3.5 py-1.5 rounded-[3px] border border-stone-200 self-start sm:self-auto shadow-2xs">
                Fair Wage: <strong className="text-[#FF0046]">Min ₹100/hr</strong> · Shifts: <strong className="text-[#0A011C]">3+ hrs</strong>
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

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8 px-4 mb-14 md:mb-0 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-headline text-[#0A011C] font-bold text-sm tracking-wider uppercase">Calcutta Cafe Club</span>
            <span>·</span>
            <span>Student Cafe Work Platform</span>
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            <span className="hover:text-[#0A011C] transition-colors">Park Street</span>
            <span>·</span>
            <span className="hover:text-[#0A011C] transition-colors">Southern Avenue</span>
            <span>·</span>
            <span className="hover:text-[#0A011C] transition-colors">Salt Lake Sec 5</span>
            <span>·</span>
            <span className="hover:text-[#0A011C] transition-colors">Hindustan Park</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
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
