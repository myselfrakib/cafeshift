import React, { useState } from 'react';
import { Menu, Search, SlidersHorizontal, Heart, Plus, Flame, Star, Home, Tag, ShoppingBag, Bell } from 'lucide-react';
import { FOOD_CATEGORIES, FEATURED_COMBO, POPULAR_ITEMS } from '../../data/menuData';

export default function GlassHomeScreen({ onSelectItem, onOpenMenu, currentUser, isShiftMode, setIsShiftMode, shifts = [], onSelectShift }) {
  const [selectedCategory, setSelectedCategory] = useState('burger');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({ 'food-spicy-chicken': true });

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = POPULAR_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="relative w-full max-w-[420px] rounded-[48px] overflow-hidden glass-panel border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col bg-[#140E0A] text-white">
      
      {/* 1. Status Bar Mock */}
      <div className="px-8 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-white/70 select-none z-10">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="w-5 h-2.5 rounded-sm border border-white/60 p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* 2. Top Header Bar: Menu & Avatar */}
      <div className="px-6 pt-3 pb-3 flex justify-between items-center z-10">
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 rounded-2xl glass-panel-subtle flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mode Switcher Pill (Food vs Calcutta Cafe Shifts) */}
        {setIsShiftMode && (
          <button
            onClick={() => setIsShiftMode(!isShiftMode)}
            className="px-3 py-1 rounded-full glass-pill text-[11px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 hover:bg-white/10 transition-colors"
          >
            <span>{isShiftMode ? '🐾 Shifts Active' : '🍔 Food Menu'}</span>
          </button>
        )}

        <div className="relative cursor-pointer">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Red notification dot */}
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#140E0A]"></span>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="px-6 pb-24 space-y-5 overflow-y-auto max-h-[750px] no-scrollbar">
        
        {/* 3. Greeting & Big Bold Headline */}
        <div className="pt-1">
          <p className="text-xs text-white/60 font-medium">
            Hi, {currentUser?.name?.split(' ')[0] || 'Alex'} 👋
          </p>
          <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-white tracking-tight leading-tight mt-0.5">
            Good Food<br />
            Good <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA234] via-[#FF6B00] to-[#FFA234]">Mood!</span>
          </h1>
        </div>

        {/* 4. Frosted Pill Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-white/[0.07] border border-white/10 rounded-full px-4 py-3 backdrop-blur-xl shadow-inner focus-within:border-orange-500/50 transition-colors">
            <Search className="w-4 h-4 text-white/40 shrink-0 mr-3" />
            <input
              type="text"
              placeholder={isShiftMode ? "Search Calcutta cafe shifts..." : "Search your favorite food"}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
            />
            <button className="w-8 h-8 rounded-full glass-panel-subtle flex items-center justify-center text-white/70 hover:text-white shrink-0 ml-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. Category Row */}
        <div>
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
            {FOOD_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                      isActive
                        ? 'orange-gradient-btn text-white scale-105 shadow-[0_4px_18px_rgba(255,107,0,0.45)]'
                        : 'glass-panel-subtle text-white/80 hover:bg-white/[0.09]'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isActive ? 'text-[#FFA234] font-bold' : 'text-white/60 group-hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Featured Banner: Spicy Burger Combo (Limited Time Offer) */}
        <div
          onClick={() => onSelectItem(FEATURED_COMBO)}
          className="relative rounded-[28px] overflow-hidden glass-panel border border-white/10 p-5 cursor-pointer glass-card-hover group"
        >
          {/* Subtle warm orange ambient background glow */}
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#FF6B00]/15 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2 max-w-[55%]">
              <div className="inline-flex items-center gap-1 text-[11px] text-white/70 font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>Limited Time Offer</span>
              </div>

              <h3 className="text-xl font-bold font-bubble text-white leading-tight">
                Spicy Burger<br />
                <span className="text-[#FFA234]">Combo</span>
              </h3>

              <div className="pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(FEATURED_COMBO);
                  }}
                  className="px-4 py-2 rounded-xl orange-gradient-btn text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Order Now</span>
                </button>
              </div>
            </div>

            {/* Floating Burger + Fries + Drink Artwork */}
            <div className="relative w-36 h-32 shrink-0">
              {/* Discount pill badge */}
              <div className="absolute top-1 right-1 z-20 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold text-white shadow-sm">
                20% OFF
              </div>
              <img
                src={FEATURED_COMBO.image}
                alt="Combo"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* 7. Popular Now Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-bubble text-white">
              Popular Now
            </h3>
            <button className="text-xs text-white/50 hover:text-white transition-colors">
              View All
            </button>
          </div>

          {/* Horizontal Scrolling Popular Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            {filteredItems.slice(0, 4).map(item => {
              const isFav = favorites[item.id] || item.isFavorite;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="rounded-[24px] glass-panel p-3 flex flex-col justify-between cursor-pointer glass-card-hover group border border-white/10"
                >
                  {/* Top Image + Badges */}
                  <div className="relative w-full h-28 rounded-2xl overflow-hidden mb-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    
                    {/* Tag badge (e.g. Spicy) */}
                    {item.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FF4500]/80 text-[9px] font-bold text-white uppercase backdrop-blur-md">
                        {item.tag}
                      </span>
                    )}

                    {/* Heart button */}
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full glass-pill flex items-center justify-center transition-all"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-xs font-bold font-bubble text-white truncate">
                      {item.name}
                    </h4>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-white font-bubble">
                        ${item.price.toFixed(2)}
                      </span>

                      {/* Orange Plus Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item);
                        }}
                        className="w-7 h-7 rounded-xl orange-gradient-btn flex items-center justify-center text-white transition-all active:scale-95 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Calcutta Cafe Shifts Section (If in cafe/shifts context) */}
        {shifts && shifts.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-bubble text-white flex items-center gap-1.5">
                <span>☕ Student Cafe Shifts</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-sans">
                  Kolkata
                </span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {shifts.filter(s => s.status === 'open').slice(0, 2).map(shift => (
                <div
                  key={shift.id}
                  onClick={() => onSelectShift && onSelectShift(shift)}
                  className="rounded-2xl glass-panel p-3.5 flex items-center justify-between gap-3 cursor-pointer glass-card-hover border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xl shrink-0">
                      {shift.cafeMascot || '☕'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                        {shift.roleName}
                      </h4>
                      <p className="text-[11px] text-white/60">
                        {shift.cafeName} · {shift.cafeArea}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#FFA234] block font-bubble">
                      ₹{shift.hourlyWage}/hr
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ₹{shift.totalEarnings} total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 9. Frosted Bottom Navigation Dock */}
      <div className="absolute bottom-0 inset-x-0 px-6 py-3 bg-[#1A120D]/90 backdrop-blur-2xl border-t border-white/10 z-20">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-[#FF6B00]">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
            <Tag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Offers</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Orders</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Favorite</span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2"></div>
      </div>

    </div>
  );
}
