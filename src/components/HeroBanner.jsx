import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Coffee, GraduationCap, Clock, IndianRupee, Heart, ShieldCheck } from 'lucide-react';

export default function HeroBanner() {
  const { setAuthModalOpen, setAuthInitialMode, isOwner, isAttendant, setActiveTab, activeCafe } = useApp();

  return (
    <div className="relative rounded-3xl overflow-hidden cute-gradient-header border-2 border-amber-200/90 shadow-md p-6 sm:p-10">
      {/* Decorative background cute paw emojis */}
      <div className="absolute top-3 right-8 text-4xl opacity-20 select-none animate-float pointer-events-none">
        🐾
      </div>
      <div className="absolute bottom-4 left-6 text-3xl opacity-20 select-none pointer-events-none">
        ☕
      </div>

      <div className="relative z-10 max-w-3xl">
        {/* Cute Pill Tag */}
        <div className="inline-flex items-center gap-2 bg-amber-200/80 border border-amber-300 text-amber-950 px-3.5 py-1 rounded-full text-xs font-bold mb-4 shadow-sm">
          <span>🐾</span>
          <span>Calcutta's Student Cafe Work Revolution</span>
          <span>•</span>
          <span className="text-amber-800">Famous in the West, now in Kolkata!</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bubble font-bold text-amber-950 leading-tight">
          Flexible Cafe Shifts for <span className="text-amber-700 underline decoration-amber-400">School & College Students</span> in Calcutta ☕💛
        </h1>

        <p className="text-xs sm:text-sm text-amber-900/80 font-medium mt-3 leading-relaxed max-w-2xl">
          A true win-win for Kolkata's cafe culture! Cafe & restaurant owners manage intense rush hours with energetic student attendants — while students earn guaranteed pocket money (minimum ₹100/hour) with flexible 3+ hour shifts between studies.
        </p>

        {/* Quick Highlights / Mascot Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5">
          <div className="bg-white/90 backdrop-blur-sm border border-amber-200 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-950 shadow-sm">
            <span className="text-base">💸</span>
            <span>Min ₹100/Hr Guaranteed</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-amber-200 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-950 shadow-sm">
            <span className="text-base">⏱️</span>
            <span>Min 3-Hour Shifts</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-amber-200 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-950 shadow-sm">
            <span className="text-base">📍</span>
            <span>Park Street · Salt Lake · Southern Ave</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-amber-200 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-950 shadow-sm">
            <span className="text-base">🐱</span>
            <span>Cute Animal Mascots</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => {
              setAuthInitialMode('signup-owner');
              setAuthModalOpen(true);
            }}
            className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all hover:scale-102 flex items-center gap-2"
          >
            <Coffee className="w-4 h-4" />
            <span>Register as Cafe Owner 🏢</span>
          </button>

          <button
            onClick={() => {
              setAuthInitialMode('signup-attendant');
              setAuthModalOpen(true);
            }}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all hover:scale-102 flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Join as Student Attendant 🎒</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('my-cafe')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-amber-300 transition-all flex items-center gap-2"
            >
              <span>☕</span>
              <span>Open {activeCafe?.name || "Rakib's Cafe"} Tab</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

