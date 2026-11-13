import React, { useState } from 'react';
import { ChevronLeft, Heart, Star, SlidersHorizontal, Plus, Minus, Share2, Sparkles, Check } from 'lucide-react';

export default function GlassDetailSheet({ item, onClose, onAddToCart, onApplyShift, isShiftMode = false }) {
  if (!item) return null;

  // Customization state
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [quantity, setQuantity] = useState(1);
  const [durationHours, setDurationHours] = useState(item.durationHours || 4);
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || true);

  // Toggles for add-ons
  const [addOns, setAddOns] = useState({
    cheese: true,
    patty: false,
    bacon: true,
    coffee: true,
    snack: true,
    tips: true
  });

  const toggleAddOn = (key) => {
    setAddOns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate dynamic price
  const basePrice = item.price || 6.49;
  const sizeMultiplier = selectedSize === 'Large' ? 1.3 : selectedSize === 'X Large' ? 1.6 : 1.0;
  const cheesePrice = addOns.cheese ? 0.99 : 0;
  const pattyPrice = addOns.patty ? 2.49 : 0;
  const baconPrice = addOns.bacon ? 1.49 : 0;
  const itemTotal = ((basePrice * sizeMultiplier) + cheesePrice + pattyPrice + baconPrice) * quantity;

  // Shift wage calculation
  const wage = item.hourlyWage || 140;
  const shiftTotal = wage * durationHours;

  return (
    <div className="relative w-full max-w-[420px] rounded-[48px] overflow-hidden glass-panel border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col bg-[#140E0A] text-white">
      {/* Top Status Bar Mock */}
      <div className="px-8 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-white/70 select-none z-20">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="w-5 h-2.5 rounded-sm border border-white/60 p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-9 inset-x-0 px-6 flex justify-between items-center z-20">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full glass-pill hover:bg-white/20 flex items-center justify-center transition-all active:scale-95 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`w-10 h-10 rounded-full glass-pill flex items-center justify-center transition-all active:scale-95 ${
            isFavorite ? 'text-red-500 bg-red-500/20 border-red-500/40' : 'text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Hero Food / Shift Image with ambient particles glow */}
      <div className="relative h-72 w-full overflow-hidden flex items-center justify-center">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'}
          alt={item.name || item.roleName}
          className="w-full h-full object-cover scale-105"
        />
        {/* Dark gradient overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A] via-[#140E0A]/40 to-black/30"></div>
        {/* Subtle warm orange ambient light */}
        <div className="absolute -bottom-10 inset-x-0 h-24 bg-gradient-to-t from-[#140E0A] to-transparent"></div>
      </div>

      {/* Frosted Glass Content Panel */}
      <div className="relative -mt-6 px-6 pb-6 pt-4 space-y-5 rounded-t-[36px] bg-[#1A120D]/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-15px_30px_rgba(0,0,0,0.5)]">
        
        {/* Tags & Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF4500]/20 text-[#FF5722] border border-[#FF5722]/40 uppercase tracking-wider">
              {item.tag || (isShiftMode ? 'Verified Shift' : 'Spicy')}
            </span>
            {isShiftMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Min ₹100/hr
              </span>
            )}
          </div>
          <button className="text-white/60 hover:text-white transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Title, Rating & Price */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold font-bubble text-white leading-tight">
              {item.name || item.roleName}
            </h2>
            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-[#FFA234] font-bubble">
                {isShiftMode ? `₹${wage}/hr` : `$${basePrice.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-white/70">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 font-bold text-white">{item.rating || 4.8}</span>
            </div>
            <span>({item.reviewsCount || 120} reviews)</span>
            {isShiftMode && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-amber-300 font-medium">{item.cafeArea || 'Park Street, Kolkata'}</span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-white/70 leading-relaxed">
          {item.description || item.notes || 'Crispy spicy chicken patty with fresh lettuce, tomato, onion and our special sauce.'}
        </p>

        {/* CUSTOMIZE SECTION */}
        <div className="space-y-4 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">
            {isShiftMode ? 'Shift Duration & Perks' : 'Customize'}
          </h4>

          {/* Size Pills (or Duration Pills) */}
          {!isShiftMode ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 w-12">Size</span>
              <div className="flex-1 grid grid-cols-3 gap-2">
                {['Regular', 'Large', 'X Large'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all text-center ${
                      selectedSize === size
                        ? 'orange-gradient-btn text-white font-bold shadow-md'
                        : 'glass-panel-subtle text-white/70 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 w-14">Duration</span>
              <div className="flex-1 grid grid-cols-3 gap-2">
                {[3, 4, 5].map(hrs => (
                  <button
                    key={hrs}
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all text-center ${
                      durationHours === hrs
                        ? 'orange-gradient-btn text-white font-bold shadow-md'
                        : 'glass-panel-subtle text-white/70 hover:text-white'
                    }`}
                  >
                    {hrs} Hours
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-on Toggle Switches */}
          <div className="space-y-2.5 pt-1">
            {!isShiftMode ? (
              <>
                {/* Toggle: Add Cheese */}
                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/80 font-medium">Add Cheese (+$0.99)</span>
                  <button
                    onClick={() => toggleAddOn('cheese')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      addOns.cheese ? 'bg-[#FF6B00]' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        addOns.cheese ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle: Extra Patty */}
                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/80 font-medium">Extra Patty (+$2.49)</span>
                  <button
                    onClick={() => toggleAddOn('patty')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      addOns.patty ? 'bg-[#FF6B00]' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        addOns.patty ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle: Add Bacon */}
                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/80 font-medium">Add Bacon (+$1.49)</span>
                  <button
                    onClick={() => toggleAddOn('bacon')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      addOns.bacon ? 'bg-[#FF6B00]' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        addOns.bacon ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/80 font-medium">Free Caramel Latte / Coffee ☕</span>
                  <button
                    onClick={() => toggleAddOn('coffee')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      addOns.coffee ? 'bg-[#FF6B00]' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${addOns.coffee ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/80 font-medium">Fresh Snack / Chicken Puff 🥪</span>
                  <button
                    onClick={() => toggleAddOn('snack')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      addOns.snack ? 'bg-[#FF6B00]' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${addOns.snack ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/80 font-medium">Student Tip Share Bonus 💸</span>
                  <button
                    onClick={() => toggleAddOn('tips')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      addOns.tips ? 'bg-[#FF6B00]' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${addOns.tips ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR */}
        <div className="pt-2 flex items-center gap-3">
          {/* Stepper */}
          {!isShiftMode ? (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl glass-panel-subtle border border-white/10 shrink-0">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/80 hover:text-white disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm min-w-[16px] text-center text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/80 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 rounded-2xl glass-panel-subtle border border-white/10 shrink-0 text-center">
              <div className="text-[10px] text-white/60 uppercase font-bold">Shift Payout</div>
              <div className="text-xs font-bold text-amber-300">₹{shiftTotal}</div>
            </div>
          )}

          {/* Add to Cart or Apply Shift Button */}
          {!isShiftMode ? (
            <button
              onClick={() => onAddToCart && onAddToCart({ ...item, selectedSize, quantity, itemTotal })}
              className="flex-1 py-3 px-5 rounded-2xl orange-gradient-btn text-white font-bold text-sm flex items-center justify-between transition-all active:scale-95 shadow-lg"
            >
              <span>Add to Cart</span>
              <span className="font-bubble text-base">${itemTotal.toFixed(2)}</span>
            </button>
          ) : (
            <button
              onClick={() => onApplyShift && onApplyShift(item.id)}
              className="flex-1 py-3 px-5 rounded-2xl orange-gradient-btn text-white font-bold text-sm flex items-center justify-between transition-all active:scale-95 shadow-lg"
            >
              <span>Book & Apply Shift 🐾</span>
              <span className="font-bubble text-base">₹{shiftTotal}</span>
            </button>
          )}
        </div>

        {/* Home Indicator line */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2"></div>
      </div>
    </div>
  );
}
