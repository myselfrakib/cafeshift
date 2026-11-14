import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { uploadImageToStorage } from '../services/firebaseService';
import {
  searchPlacesAndCafes,
  fetchCurrentLocationAddress,
  matchKolkataArea
} from '../services/googlePlacesService';
import {
  ArrowLeft,
  X,
  Coffee,
  MapPin,
  Upload,
  AlertCircle,
  Loader2,
  Check,
  Sparkles,
  Trash2,
  Navigation,
  Search,
  ExternalLink,
  Compass,
  CheckCircle2,
  User,
  Phone
} from 'lucide-react';

export default function AddCafeModal({ isOpen, onClose, editCafe = null }) {
  const { addOwnerCafe, updateOwnerCafe, setIsEditingCafe, showToast, currentUser } = useApp();

  const [name, setName] = useState('');
  const [area, setArea] = useState('Park Street');
  const [address, setAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [minHourlyWage, setMinHourlyWage] = useState(100);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart Google Places suggestions state for Cafe Name
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationSuccessNote, setLocationSuccessNote] = useState('');

  const nameInputRef = useRef(null);
  const suggestionsBoxRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Smart Google Places suggestions state for Address
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  const addressInputRef = useRef(null);
  const addressSuggestionsBoxRef = useRef(null);
  const addressSearchTimeoutRef = useRef(null);

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

  // Close suggestions popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsBoxRef.current &&
        !suggestionsBoxRef.current.contains(e.target) &&
        nameInputRef.current &&
        !nameInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
      if (
        addressSuggestionsBoxRef.current &&
        !addressSuggestionsBoxRef.current.contains(e.target) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(e.target)
      ) {
        setShowAddressSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (addressSearchTimeoutRef.current) clearTimeout(addressSearchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (editCafe) {
      setName(editCafe.name || '');
      setArea(editCafe.area || 'Park Street');
      setAddress(editCafe.address || '');
      setManagerName(editCafe.managerName || editCafe.contactPerson || '');
      setManagerPhone(editCafe.managerPhone ? editCafe.managerPhone.replace(/\D/g, '').slice(-10) : (editCafe.phone ? editCafe.phone.replace(/\D/g, '').slice(-10) : ''));
      setMinHourlyWage(editCafe.minHourlyWage || 100);
      setDescription(editCafe.description || '');
      setPhotoUrl(editCafe.photoUrl || '');
    } else {
      setName('');
      setArea('Park Street');
      setAddress('');
      setManagerName(currentUser?.name || '');
      setManagerPhone(currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
      setMinHourlyWage(100);
      setDescription('');
      setPhotoUrl('');
    }
    setError('');
    setLocationSuccessNote('');
    setShowSuggestions(false);
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  }, [editCafe, isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle typing in cafe name to fetch Google Places / Directory data
  const handleNameChange = (val) => {
    setName(val);
    setError('');

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val || val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchingPlaces(false);
      return;
    }

    setIsSearchingPlaces(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchPlacesAndCafes(val);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.warn('Place search notice:', err);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 200);
  };

  // Auto-fill form from selected place suggestion
  const handleSelectSuggestion = (sugg) => {
    setName(sugg.name);
    setAddress(sugg.formattedAddress || sugg.address || '');
    const matchedLocality = sugg.area || matchKolkataArea(sugg.address || sugg.formattedAddress);
    setArea(matchedLocality);

    if (sugg.minHourlyWage && (!minHourlyWage || minHourlyWage === 100)) {
      setMinHourlyWage(sugg.minHourlyWage);
    }
    if (sugg.description && !description.trim()) {
      setDescription(sugg.description);
    }
    if (sugg.photoUrl && !photoUrl) {
      setPhotoUrl(sugg.photoUrl);
    }

    setShowSuggestions(false);
    setLocationSuccessNote(`Auto-filled: ${sugg.name} in ${matchedLocality}`);
  };

  // Handle typing address to search nearby places & street addresses
  const handleAddressChange = (val) => {
    setAddress(val);
    setError('');

    if (addressSearchTimeoutRef.current) {
      clearTimeout(addressSearchTimeoutRef.current);
    }

    if (!val || val.trim().length < 2) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      setIsSearchingAddress(false);
      return;
    }

    setIsSearchingAddress(true);
    addressSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchPlacesAndCafes(val);
        setAddressSuggestions(results);
        setShowAddressSuggestions(results.length > 0);
      } catch (err) {
        console.warn('Address place search notice:', err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 200);
  };

  // Auto-fill address & locality from selected address suggestion
  const handleSelectAddressSuggestion = (sugg) => {
    setAddress(sugg.formattedAddress || sugg.address || '');
    const matchedLocality = sugg.area || matchKolkataArea(sugg.address || sugg.formattedAddress);
    setArea(matchedLocality);
    setShowAddressSuggestions(false);
    setLocationSuccessNote(`Address auto-filled: ${sugg.formattedAddress || sugg.address} (${matchedLocality})`);

    // If cafe name is empty, auto-fill it from place suggestion name
    if (!name.trim() && sugg.name) {
      setName(sugg.name);
    }
  };

  // Auto-fetch GPS Current Location and reverse-geocode to Kolkata address
  const handleFetchCurrentLocation = async () => {
    setFetchingLocation(true);
    setError('');
    setLocationSuccessNote('');

    try {
      const loc = await fetchCurrentLocationAddress();
      setAddress(loc.address);
      setArea(loc.area);
      setLocationSuccessNote(`Location detected: ${loc.area}, Kolkata (${loc.address.slice(0, 45)}...)`);
      if (showToast) {
        showToast(`Detected location: ${loc.area}, Kolkata`, 'success', '📍');
      }
    } catch (err) {
      setError(err?.message || 'Could not fetch your current GPS location. Please allow browser location access.');
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter a cafe name');
    if (!address.trim()) return setError('Please enter the street address');
    if (Number(minHourlyWage) < 100) return setError('Minimum hourly wage must be at least ₹100/hr (Kolkata student fair wage standard)');

    const cleanPhone = managerPhone.replace(/\D/g, '');
    if (cleanPhone && cleanPhone.length !== 10) {
      return setError('Please enter a valid 10-digit mobile number for the manager (e.g. 9876543210)');
    }

    const finalManagerName = managerName.trim() || currentUser?.name || 'Cafe Manager';
    const finalManagerPhone = cleanPhone ? cleanPhone.slice(-10) : (currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');

    setIsSubmitting(true);
    try {
      if (editCafe) {
        await updateOwnerCafe(editCafe.id, {
          name: name.trim(),
          area,
          address: address.trim(),
          managerName: finalManagerName,
          managerPhone: finalManagerPhone,
          minHourlyWage: Number(minHourlyWage),
          description: description.trim(),
          photoUrl
        });
      } else {
        await addOwnerCafe({
          name: name.trim(),
          area,
          address: address.trim(),
          managerName: finalManagerName,
          managerPhone: finalManagerPhone,
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
    <div className="fixed inset-0 z-[70] bg-[#F8F9FA] flex flex-col w-screen h-screen overflow-y-auto animate-fade-in">
      
      {/* 1. Full-Screen Sticky Header */}
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
        
        {error && (
          <div className="p-3.5 rounded-[3px] bg-rose-50 border border-rose-300 text-[#FF0046] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {locationSuccessNote && (
          <div className="p-3 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between gap-2 animate-pop">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{locationSuccessNote}</span>
            </div>
            <button
              type="button"
              onClick={() => setLocationSuccessNote('')}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Cafe Information with Smart Autocomplete, Locality, Wage & Location */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  1. Outlet Details & Location
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Enter cafe name, locality, hourly wage guarantee, and street address with GPS or Places API matching.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* 1. Cafe Name with Smart Google Places Autocomplete */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-stone-700 font-headline flex items-center gap-1.5">
                    <span>Cafe Name</span>
                    <span className="text-[#FF0046]">*</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-[2px] bg-sky-50 text-sky-700 border border-sky-200 lowercase font-sans">
                      smart google match
                    </span>
                  </label>
                  {isSearchingPlaces && (
                    <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin text-[#00DADC]" />
                      <span>Matching Google Places...</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    placeholder="Type cafe name (e.g. Roastery, Blue Tokai, 8th Day, Sienna, Flurys...)"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    className="w-full pl-3.5 pr-8 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-bold"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Google Places Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsBoxRef}
                    className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-[3px] border border-stone-200 shadow-2xl z-40 max-h-72 overflow-y-auto animate-pop divide-y divide-stone-100"
                  >
                    <div className="bg-stone-100/90 px-3 py-1.5 flex items-center justify-between text-[10px] font-headline font-bold uppercase tracking-wider text-stone-600">
                      <span>Matching Kolkata Place Data (Select to Auto-Fill)</span>
                      <button
                        type="button"
                        onClick={() => setShowSuggestions(false)}
                        className="hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    {suggestions.map((sugg, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(sugg)}
                        className="p-3 hover:bg-stone-50 cursor-pointer transition-colors flex items-start gap-3 text-left group"
                      >
                        <div className="w-8 h-8 rounded-[2px] bg-stone-100 group-hover:bg-[#FF0046] group-hover:text-white text-stone-500 flex items-center justify-center shrink-0 text-sm font-bold transition-colors">
                          ☕
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-headline font-bold text-xs uppercase text-[#0A011C] group-hover:text-[#FF0046] transition-colors">
                              {sugg.name}
                            </span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-[2px] bg-[#00DADC]/20 text-[#006062]">
                              {sugg.area || 'Kolkata'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {sugg.formattedAddress || sugg.address}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-stone-100 text-stone-500 shrink-0">
                          {sugg.source || 'Place'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Locality & 3. Base Wage */}
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
                    Hourly Wage Floor (₹100/hr Min) <span className="text-[#FF0046]">*</span>
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

              {/* 4. Full Street Address with GPS Fetch & Places API Autocomplete */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                  <label className="font-bold uppercase tracking-wider text-stone-700 font-headline flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
                    <span>Full Street Address</span>
                    <span className="text-[#FF0046]">*</span>
                    {isSearchingAddress && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium lowercase font-sans">
                        <Loader2 className="w-3 h-3 animate-spin text-[#00DADC]" />
                        <span>searching nearby places...</span>
                      </span>
                    )}
                  </label>

                  {/* GPS Auto-Fetch Location Button */}
                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    disabled={fetchingLocation}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-stone-100 hover:bg-[#FF0046] hover:text-white text-stone-800 text-[10px] font-headline font-bold uppercase tracking-wider border border-stone-200 transition-colors shadow-2xs disabled:opacity-60"
                    title="Detect current GPS coordinates and auto-fill address & neighborhood"
                  >
                    {fetchingLocation ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Detecting GPS Location...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3 h-3 text-[#FF0046]" />
                        <span>📍 Fetch Current Location</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    ref={addressInputRef}
                    type="text"
                    required
                    placeholder="Type street address or landmark (nearby places suggested automatically)..."
                    value={address}
                    onChange={e => handleAddressChange(e.target.value)}
                    onFocus={() => {
                      if (addressSuggestions.length > 0) setShowAddressSuggestions(true);
                    }}
                    className="w-full pl-3.5 pr-8 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-medium"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Google Places Address Autocomplete Dropdown */}
                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <div
                    ref={addressSuggestionsBoxRef}
                    className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-[3px] border border-stone-200 shadow-2xl z-40 max-h-72 overflow-y-auto animate-pop divide-y divide-stone-100"
                  >
                    <div className="bg-stone-100/90 px-3 py-1.5 flex items-center justify-between text-[10px] font-headline font-bold uppercase tracking-wider text-stone-600">
                      <span>Nearby Places & Addresses (Select to Auto-Fill)</span>
                      <button
                        type="button"
                        onClick={() => setShowAddressSuggestions(false)}
                        className="hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    {addressSuggestions.map((sugg, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectAddressSuggestion(sugg)}
                        className="p-3 hover:bg-stone-50 cursor-pointer transition-colors flex items-start gap-3 text-left group"
                      >
                        <div className="w-8 h-8 rounded-[2px] bg-stone-100 group-hover:bg-[#FF0046] group-hover:text-white text-stone-500 flex items-center justify-center shrink-0 text-sm font-bold transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-headline font-bold text-xs uppercase text-[#0A011C] group-hover:text-[#FF0046] transition-colors">
                              {sugg.name}
                            </span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-[2px] bg-[#00DADC]/20 text-[#006062]">
                              {sugg.area || 'Kolkata'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {sugg.formattedAddress || sugg.address}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-stone-100 text-stone-500 shrink-0">
                          {sugg.source || 'Place'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Cafe Logo & Storefront Photo */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  2. Cafe Logo & Storefront Photo
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
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
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
                    PNG, JPG, or WebP. Auto-populated if choosing a verified Google place.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Manager & Shift Contact Details */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF0046]" />
                  <span>3. Floor Manager & Shift Contact Details</span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Students who book shifts at this outlet will receive this manager name and direct phone number (+91) to coordinate shift reporting and check-in.
                </p>
              </div>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setManagerName(currentUser.name || '');
                    setManagerPhone(currentUser.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
                  }}
                  className="self-start sm:self-auto text-[10px] font-headline font-bold uppercase tracking-wider text-[#006062] hover:text-[#0A011C] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-[2px] transition-colors flex items-center gap-1 shrink-0"
                  title="Auto-fill with your owner account name & phone"
                >
                  <User className="w-3 h-3 text-[#00DADC]" />
                  <span>Use My Contact Info</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Manager Name */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline flex items-center gap-1">
                  <span>Manager / Contact Person Name</span>
                  <span className="text-[#FF0046]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen (Floor Manager)"
                    value={managerName}
                    onChange={e => setManagerName(e.target.value)}
                    className="w-full pl-3.5 pr-8 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors font-medium"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Name of manager on shift duty (defaults to owner name).
                </span>
              </div>

              {/* Manager Phone Number with +91 Prefix */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#FF0046]" />
                  <span>Manager Phone Number (+91)</span>
                  <span className="text-[#FF0046]">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200 font-headline">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={managerPhone}
                    onChange={e => setManagerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 font-bold text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046] tracking-wider"
                  />
                </div>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Direct 10-digit mobile number for calls & WhatsApp from booked students.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Atmosphere & About */}
          <div className="bg-white rounded-[3px] p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A011C]">
                  4. About Your Cafe Outlet
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Give students an impression of your cafe culture and rush-hour vibes.
                </p>
              </div>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                Short Description & Work Atmosphere
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. A bustling specialty espresso lab in Hindustan Park with a friendly barista team and generous student perks."
                className="w-full px-3.5 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors leading-relaxed"
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 pb-12 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-[3px] border border-stone-300 text-stone-700 hover:bg-stone-100 font-headline text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-[3px] bg-[#FF0046] hover:bg-[#E0003E] active:bg-[#C00035] text-white font-headline text-sm font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Cafe Outlet...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editCafe ? 'Save Cafe Changes' : 'Register Cafe Outlet'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </main>

    </div>
  );
}
