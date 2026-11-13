import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { uploadImageToStorage } from '../services/firebaseService';
import { X, Coffee, MapPin, Upload, AlertCircle, Loader2 } from 'lucide-react';

export default function AddCafeModal({ isOpen, onClose, editCafe = null }) {
  const { addOwnerCafe, updateOwnerCafe } = useApp();

  const [name, setName] = useState('');
  const [area, setArea] = useState('Park Street');
  const [address, setAddress] = useState('');
  const [minHourlyWage, setMinHourlyWage] = useState(100);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter a cafe name');
    if (!address.trim()) return setError('Please enter the street address');
    if (Number(minHourlyWage) < 100) return setError('Minimum hourly wage must be at least ₹100/hr');

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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-t-[3px] sm:rounded-[3px] max-w-lg w-full p-5 sm:p-6 border border-stone-200 shadow-2xl max-h-[92vh] overflow-y-auto animate-pop">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-[3px] bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-[#0A011C] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center text-xs font-bold">
              ☕
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF0046] font-headline">
              {editCafe ? 'Edit Cafe Information' : 'Add Another Cafe Location'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-headline text-[#0A011C] uppercase tracking-tight">
            {editCafe ? `Edit ${editCafe.name}` : 'Register New Cafe Branch'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage multiple cafes from one account and publish shift offers across different Kolkata locations.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[3px] bg-[#FF0046]/10 border border-[#FF0046] text-[#FF0046] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Cafe Name */}
          <div>
            <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
              Cafe Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Salt Lake Nitro Brew Lab / Park Street Roasters"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-bold"
            />
          </div>

          {/* Kolkata Locality & Base Wage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Kolkata Neighborhood
              </label>
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
              >
                {CALCUTTA_AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Base Wage Guarantee
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  step={5}
                  required
                  value={minHourlyWage}
                  onChange={e => setMinHourlyWage(Math.max(100, Number(e.target.value) || 100))}
                  className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 font-bold text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
                />
                <span className="px-2 text-[10px] text-stone-400 font-bold uppercase font-headline whitespace-nowrap">
                  /hr
                </span>
              </div>
            </div>
          </div>

          {/* Full Street Address */}
          <div>
            <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
              <span>Full Street Address</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Godrej Waterside Tower, Sector 5, Salt Lake, Kolkata - 700091"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
            />
          </div>

          {/* Cafe Photo / Logo */}
          <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200">
            <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1.5 font-headline">
              Cafe Logo or Storefront Image (Optional)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[3px] bg-white border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Coffee className="w-5 h-5 text-stone-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-white hover:bg-stone-100 text-stone-700 rounded-[3px] border border-stone-200 transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-[#FF0046]" />
                  <span>{photoUrl ? 'Change Image' : 'Upload Cafe Image'}</span>
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
                {uploading && <span className="ml-2 text-[10px] text-stone-500">Uploading...</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
              Cafe Description / About
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Artisanal roasts, fast evening tech crowds, cozy indoor & outdoor seating."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[3px] border border-stone-200 font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold uppercase tracking-wider shadow-sm transition-colors text-xs"
            >
              {editCafe ? 'Save Changes' : 'Add Cafe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
