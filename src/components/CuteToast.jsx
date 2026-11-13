import React from 'react';
import { useApp } from '../context/AppContext';

export default function CuteToast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full px-2 animate-pop pointer-events-none">
      <div className="bg-stone-900 text-white p-3.5 rounded-xl shadow-lg border border-stone-700/60 flex items-center gap-3 backdrop-blur-md">
        <span className="text-lg shrink-0">{toast.emoji || '✨'}</span>
        <div className="flex-1 text-xs font-medium leading-tight text-stone-200">
          {toast.message}
        </div>
      </div>
    </div>
  );
}
