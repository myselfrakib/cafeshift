import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function CuteToast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-pop">
      <div className="bg-amber-950 text-amber-50 p-4 rounded-2xl shadow-2xl border-2 border-amber-500/30 flex items-start gap-3 backdrop-blur-md">
        <div className="text-2xl select-none animate-bounce-small">
          {toast.emoji || '🐾'}
        </div>
        <div className="flex-1 text-sm font-medium leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
}

