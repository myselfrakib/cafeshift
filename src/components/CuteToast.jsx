import React from 'react';
import { useApp } from '../context/AppContext';

export default function CuteToast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full px-2 animate-pop pointer-events-none">
      <div className="glass-panel text-white p-4 rounded-2xl shadow-2xl border border-orange-500/30 flex items-center gap-3 backdrop-blur-2xl">
        <span className="text-xl shrink-0">{toast.emoji || '✨'}</span>
        <div className="flex-1 text-xs font-semibold leading-snug text-white/90">
          {toast.message}
        </div>
      </div>
    </div>
  );
}
