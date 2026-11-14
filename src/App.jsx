import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import StudentShiftFeed from './components/StudentShiftFeed';
import OwnerCafeView from './components/OwnerCafeView';
import StudentApplicationsView from './components/StudentApplicationsView';
import StudentProfileView from './components/StudentProfileView';
import MobileBottomNav from './components/MobileBottomNav';
import CreateShiftModal from './components/CreateShiftModal';
import CreateJobModal from './components/CreateJobModal';
import CuteToast from './components/CuteToast';

function AppContent() {
  const {
    currentUser,
    isOwner,
    isAttendant,
    activeTab,
    setActiveTab
  } = useApp();

  // Owners cannot access browse shifts; force owner to their cafe view
  React.useEffect(() => {
    if (isOwner && activeTab === 'browse') {
      setActiveTab('my-cafe');
    }
  }, [isOwner, activeTab, setActiveTab]);

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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0A011C] pb-24">
      {/* Top Bar Card with whole name Calcutta Cafe Club */}
      <Navbar />

      {/* Main Authenticated View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Owner View */}
        {isOwner ? (
          <OwnerCafeView />
        ) : (
          /* Student Views */
          <>
            {activeTab === 'browse' && (
              <StudentShiftFeed />
            )}

            {activeTab === 'my-applications' && (
              <StudentApplicationsView />
            )}

            {activeTab === 'profile' && (
              <StudentProfileView />
            )}
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className={`mt-auto border-t border-stone-200 bg-white py-8 px-4 ${isAttendant ? 'mb-16' : 'mb-14 md:mb-0'} text-xs text-stone-500`}>
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
      <CreateJobModal />
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
