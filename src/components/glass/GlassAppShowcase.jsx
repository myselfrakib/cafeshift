import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import GlassHomeScreen from './GlassHomeScreen';
import GlassDetailSheet from './GlassDetailSheet';
import { POPULAR_ITEMS, FEATURED_COMBO } from '../../data/menuData';
import { Sparkles, Coffee, Smartphone, Monitor, ShoppingBag, Check, LogOut, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GlassAppShowcase() {
  const {
    currentUser,
    isOwner,
    isAttendant,
    shifts,
    applyForShift,
    handleLogout,
    showToast
  } = useApp();

  // Selected item for the right-hand detail sheet (default to Spicy Chicken Burger exactly like image!)
  const [selectedItem, setSelectedItem] = useState(POPULAR_ITEMS[0]);
  const [isShiftMode, setIsShiftMode] = useState(false);
  const [viewMode, setViewMode] = useState('dual'); // 'dual' (like photo) | 'single' (interactive mobile)
  const [cartCount, setCartCount] = useState(1);

  const handleAddToCart = (item) => {
    setCartCount(prev => prev + 1);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF9E2C', '#FF6B00', '#FFA234', '#FFFFFF']
      });
    } catch (e) {}
    showToast(`Added ${item.name} (${item.selectedSize || 'Regular'}) to cart! 🍔`, 'success', '🛍️');
  };

  const handleApplyShift = (shiftId) => {
    applyForShift(shiftId);
  };

  return (
    <div className="min-h-screen bg-ambient-espresso text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#120B07]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl orange-gradient-btn flex items-center justify-center font-bold text-xl shadow-lg">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-xl font-bold tracking-tight text-white">
                  Chai & Paws
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-orange-400 border border-orange-500/30">
                  Calcutta Glass UI
                </span>
              </div>
              <p className="text-[11px] text-white/50 hidden sm:block">
                Artisan Cafe & Student Shift Network
              </p>
            </div>
          </div>

          {/* Center Mode Controls */}
          <div className="flex items-center gap-2 bg-white/[0.06] p-1 rounded-2xl border border-white/10 text-xs font-semibold">
            {/* Food vs Shifts Mode */}
            <button
              onClick={() => {
                setIsShiftMode(false);
                setSelectedItem(POPULAR_ITEMS[0]);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                !isShiftMode
                  ? 'orange-gradient-btn text-white font-bold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🍔 Food & Menu
            </button>
            <button
              onClick={() => {
                setIsShiftMode(true);
                if (shifts.length > 0) {
                  const openShift = shifts.find(s => s.status === 'open') || shifts[0];
                  setSelectedItem({
                    ...openShift,
                    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
                    price: openShift.hourlyWage,
                    rating: 4.9,
                    reviewsCount: 84
                  });
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isShiftMode
                  ? 'orange-gradient-btn text-white font-bold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🐾 Cafe Shifts
            </button>

            {/* Dual Phone Showcase Toggle */}
            <div className="hidden lg:flex items-center border-l border-white/10 pl-2 ml-1 gap-1">
              <button
                onClick={() => setViewMode('dual')}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  viewMode === 'dual' ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="View Dual Phone Mockup (Exactly like image)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Dual Phone</span>
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  viewMode === 'single' ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="Single Active Phone View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Single</span>
              </button>
            </div>
          </div>

          {/* Right User Account & Sign Out */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel-subtle border border-white/10">
              <span className="text-base">{currentUser?.mascot || '👤'}</span>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-white leading-tight">
                  {currentUser?.name?.split(' ')[0] || 'Member'}
                </div>
                <div className="text-[10px] text-white/50">
                  {isOwner ? 'Cafe Owner' : 'Student'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Dual Phone Stage (Matching User's Photo) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          
          {/* Subtitle / Tip */}
          <div className="mb-6 text-center">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/10 text-orange-400 inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dark Frosted Glassmorphism UI (Click cards on Left Phone to preview on Right Phone!)</span>
            </span>
          </div>

          {/* Dual Phone Layout Container */}
          <div className={`w-full flex justify-center items-start gap-8 lg:gap-12 flex-wrap ${
            viewMode === 'single' ? 'max-w-md' : 'max-w-5xl'
          }`}>
            
            {/* PHONE 1: HOME & DISCOVERY SCREEN (LEFT SCREEN IN IMAGE) */}
            <div className="w-full sm:w-auto flex justify-center">
              <GlassHomeScreen
                onSelectItem={(item) => setSelectedItem(item)}
                currentUser={currentUser}
                isShiftMode={isShiftMode}
                setIsShiftMode={setIsShiftMode}
                shifts={shifts}
                onSelectShift={(shift) => {
                  setSelectedItem({
                    ...shift,
                    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
                    price: shift.hourlyWage,
                    rating: 4.9,
                    reviewsCount: 84
                  });
                }}
              />
            </div>

            {/* PHONE 2: DETAIL & CUSTOMIZATION SHEET (RIGHT SCREEN IN IMAGE) */}
            {(viewMode === 'dual' || window.innerWidth >= 1024) && (
              <div className="w-full sm:w-auto flex justify-center">
                <GlassDetailSheet
                  item={selectedItem}
                  onClose={() => setSelectedItem(POPULAR_ITEMS[0])}
                  onAddToCart={handleAddToCart}
                  onApplyShift={handleApplyShift}
                  isShiftMode={isShiftMode}
                />
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Modern Minimal Glass Footer */}
      <footer className="border-t border-white/10 bg-[#120B07]/80 backdrop-blur-xl py-4 px-6 text-center text-xs text-white/40">
        Chai & Paws Calcutta · Dark Frosted Glassmorphic Interface · Inspired by Modern Mobile Design
      </footer>

    </div>
  );
}
