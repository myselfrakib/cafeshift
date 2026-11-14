import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { uploadImageToStorage } from '../services/firebaseService';
import { ArrowLeft, X, Coffee, MapPin, Upload, AlertCircle, Loader2, Check, Sparkles, Trash2 } from 'lucide-react';

export default function AddCafeModal({ isOpen, onClose, editCafe = null }) {
  const { addOwnerCafe, updateOwnerCafe, setIsEditingCafe } = useApp();

  const [name, setName] = useState('');
  const [area, setArea] = useState('Park Street');
  const [address, setAddress] = useState('');
  const [minHourlyWage, setMinHourlyWage] = useState(100);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with active cafe and inform app context that full-screen editing is active
  useEffect(() => {
    if (isOpen) {
      if (setIsEditingCafe) setIsEditingCafe(true);
      document.body.style.overflow = 'hidden';
    } else {
      if (setIsEditingCafe) setIsEditingCafe(false);
      document.body.style.overflow = '';
    }

    return () => {
      if (setIsEditingCafe) setIsEditingCafe(false);
      document.body.style.overflow = '';
    };
  }, [isOpen, setIsEditingCafe]);

  // Handle ESC key to exit edit mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (editCafe) {
      setName(editCafe.name || '');
      setArea(editCafe.area || 'Park Street');
      setAddress(editCafe.address || '');
      setMinHourlyWage(editCafe.minHourlyWage || 100);
      setDescription(editCafe.description || '');
      setPhotoUrl(editCafe.photoUrl || '');
    } else {
      setName('');
      setArea('Park Street');
      setAddress('');
      setMinHourlyWage(100);
      setDescription('');
      setPhotoUrl('');
    }
    setError('');
  }, [editCafe, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter a cafe name');
    if (!address.trim()) return setError('Please enter the street address');
    if (Number(minHourlyWage) < 100) return setError('Minimum hourly wage must be at least ₹100/hr (Kolkata student fair wage standard)');

    setIsSubmitting(true);
    try {
      if (editCafe) {
        await updateOwnerCafe(editCafe.id, {
          name: name.trim(),
          area,
          address: address.trim(),
          minHourlyWage: Number(minHourlyWage),
          description: description.trim(),
          photoUrl
        });
      } else {
        await addOwnerCafe({
          name: name.trim(),
          area,
          address: address.trim(),
          minHourlyWage: Number(minHourlyWage),
          description: description.trim() || 'A vibrant Kolkata cafe offering flexible student shifts.',
          photoUrl
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save cafe details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col w-screen h-screen overflow-y-auto animate-fade-in">
      
      {/* 1. Full-Screen Sticky Header (Replaces regular navbar during edit) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Back Arrow Button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[3px] border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-[#0A011C] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
              title="Return to Cafe Dashboard (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-stone-500" />
              <span className="hidden xs:inline">Back</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-xs shrink-0 font-headline shadow-2xs">
                ☕
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-[2px] bg-rose-50 text-[#FF0046] border border-rose-200 font-headline shrink-0">
                    {editCafe ? 'Edit Cafe Profile' : 'New Cafe Branch'}
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight truncate">
                  {editCafe ? `Editing ${editCafe.name}` : 'Register New Cafe Location'}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Quick Save Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#0A011C] rounded-[3px] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editCafe ? 'Save Changes' : 'Publish Cafe'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Full-Screen Form Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6">
        
        {/* Banner Info */}
        <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-headline text-[#0A011C] uppercase tracking-tight">
              {editCafe ? 'Cafe Storefront & Outlet Details' : 'Register New Kolkata Outlet'}
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Update cafe branding, neighborhood area, street address, and student fair wage floor. Changes update immediately for all students across Kolkata.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-[3px] bg-stone-100 text-stone-700 border border-stone-200">
              ₹100/hr Min Guarantee
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-[3px] bg-rose-50 border border-rose-300 text-[#FF0046] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Cafe Photo / Branding */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  1. Cafe Logo & Storefront Photo
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Appears on student shift offer cards and your cafe roster.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[3px] bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative group">
                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-xs font-bold transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-rose-300" />
                      <span>Remove</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Coffee className="w-8 h-8 text-stone-300 mx-auto mb-1" />
                    <span className="text-[10px] text-stone-400 font-bold uppercase font-headline">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#0A011C] hover:bg-[#FF0046] text-white rounded-[3px] transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{photoUrl ? 'Change Cafe Photo' : 'Upload Storefront Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          try {
                            const url = await uploadImageToStorage(file, 'cafes');
                            setPhotoUrl(url);
                          } finally {
                            setUploading(false);
                          }
                        }
                      }}
                    />
                  </label>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="px-3 py-2 text-xs font-bold uppercase tracking-wider border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-[3px]"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {uploading ? (
                  <p className="text-xs text-[#FF0046] font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading image to secure storage...</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-400">
                    PNG, JPG, or WebP. Recommended ratio 1:1 or 4:3.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Basic Cafe Information */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  2. Outlet Location & Name
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Core identity and location for matching students in the neighborhood.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Cafe Name */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                  Cafe Name <span className="text-[#FF0046]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salt Lake Nitro Brew Lab / Park Street Roasters"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-bold"
                />
              </div>

              {/* Neighborhood & Base Wage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                    Kolkata Locality <span className="text-[#FF0046]">*</span>
                  </label>
                  <select
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] font-medium focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  >
                    {CALCUTTA_AREAS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                    Hourly Wage Floor (₹100/hr Min)
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200 font-headline">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={100}
                      step={5}
                      required
                      value={minHourlyWage}
                      onChange={e => setMinHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                      className="w-full px-3.5 py-2.5 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 font-bold text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                    <span className="px-2.5 text-[11px] text-stone-400 font-bold uppercase font-headline whitespace-nowrap">
                      /hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Street Address */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
                  <span>Full Street Address <span className="text-[#FF0046]">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Godrej Waterside Tower, Block DP, Sector 5, Salt Lake, Kolkata - 700091"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Atmosphere & About */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  3. Cafe Atmosphere & Perks
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Helps students understand your cafe culture and rush hour needs.
                </p>
              </div>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Description / Atmosphere Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Specialty pour-overs, evening tech crowds from Sector 5, cozy ambient music, friendly supportive staff."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-[3px] border border-stone-200 hover:border-stone-300 font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 transition-colors text-xs text-center"
            >
              Cancel & Exit
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase tracking-wider shadow-sm transition-colors text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Cafe Information...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editCafe ? 'Save Changes' : 'Register Cafe Branch'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
