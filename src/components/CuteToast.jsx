import React from 'react';
import { useApp } from '../context/AppContext';

export default function CuteToast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full px-2 animate-pop pointer-events-none">
      <div className="bg-white text-[#0A011C] p-3.5 rounded-[3px] shadow-xl border border-stone-200 border-l-4 border-l-[#FF0046] flex items-center gap-3 backdrop-blur-md">
        <span className="text-lg shrink-0">{toast.emoji || '⚡'}</span>
        <div className="flex-1 text-xs font-bold leading-tight text-[#0A011C] font-headline uppercase tracking-tight">
          {toast.message}
        </div>
      </div>
    </div>
  );
}
