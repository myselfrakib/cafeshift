import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthScreen from './components/AuthScreen';
import GlassAppShowcase from './components/glass/GlassAppShowcase';
import CuteToast from './components/CuteToast';

function AppContent() {
  const { currentUser } = useApp();

  // Strict Auth Gate: No auth = No access
  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <CuteToast />
      </>
    );
  }

  // Authenticated State: Dark Frosted Glassmorphism Cafe UI (Matching User's Reference Image)
  return (
    <>
      <GlassAppShowcase />
      <CuteToast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
