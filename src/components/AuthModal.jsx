import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS, ANIMAL_MASCOTS } from '../data/seedData';
import { X, Coffee, GraduationCap, Sparkles, Phone, Mail, User, MapPin, Building, ShieldCheck, Lock, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authInitialMode,
    signupOwner,
    signupAttendant,
    loginUser,
    users,
    switchUser,
    uploadImage,
    isSyncing
  } = useApp();

  const [mode, setMode] = useState(authInitialMode || 'signup-owner');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('Password@123');

  // Owner Form State
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: '',
    password: 'Password@123',
    phone: '',
    cafeName: "Rakib's Cafe",
    cafeArea: 'Park Street',
    cafeAddress: '',
    cafeMascot: '🐱',
    cafePhotoUrl: '',
    cafeDescription: '',
    minHourlyWage: 120
  });

  // Attendant Form State
  const [attendantData, setAttendantData] = useState({
    name: '',
    email: '',
    password: 'Password@123',
    phone: '',
    gender: 'Female',
    age: 19,
    address: '',
    college: '',
    mascot: '🐼',
    photoUrl: '',
    bio: ''
  });

  // Uploading image states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  // Handle image upload to Firebase Storage
  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, type === 'cafe' ? 'cafe_photos' : 'student_photos');
      if (type === 'cafe') {
        setOwnerData(prev => ({ ...prev, cafePhotoUrl: url }));
      } else {
        setAttendantData(prev => ({ ...prev, photoUrl: url }));
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim()) return setError('Please enter your email');
    try {
      await loginUser(loginEmail, loginPassword);
    } catch (err) {
      setError(err.message || 'Login failed. Check your email or select a demo account.');
    }
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!ownerData.name.trim()) return setError('Please enter your full name');
    if (!ownerData.email.trim() || !ownerData.email.includes('@')) return setError('Please enter a valid email');
    if (!ownerData.phone.trim() || ownerData.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid 10-digit mobile number for +91');
    }
    if (!ownerData.cafeName.trim()) return setError('Please enter your Cafe name (e.g., Rakib\'s Cafe)');
    if (Number(ownerData.minHourlyWage) < 100) return setError('Minimum hourly wage must be at least ₹100/hr');

    try {
      await signupOwner(ownerData);
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  const handleAttendantSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!attendantData.name.trim()) return setError('Please enter your full name');
    if (!attendantData.email.trim() || !attendantData.email.includes('@')) return setError('Please enter a valid email');
    if (!attendantData.phone.trim() || attendantData.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid 10-digit mobile number for +91');
    }
    if (!attendantData.address.trim()) return setError('Please provide your current Kolkata residence address');
    if (!attendantData.college.trim()) return setError('Please enter your School or College name in Kolkata');

    try {
      await signupAttendant(attendantData);
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-amber-950/50 backdrop-blur-sm overflow-y-auto">
      {/* Responsive Container: Bottom Sheet on Mobile, Centered Modal on Tablet & Desktop */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl border-t sm:border-2 border-amber-200/90 max-h-[92vh] overflow-y-auto">
        {/* Mobile Pull Handle Bar */}
        <div className="sm:hidden w-12 h-1.5 bg-amber-300 rounded-full mx-auto mb-4"></div>

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot & Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-amber-100 text-3xl shadow-inner border border-amber-200 animate-float mb-2">
            {mode === 'signup-owner' ? '☕🐱' : mode === 'signup-attendant' ? '🎒🐼' : '🔑🐾'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-bubble text-amber-950">
            {mode === 'signup-owner' && 'Register as Cafe Owner (Firebase)'}
            {mode === 'signup-attendant' && 'Join as Student Attendant (Firebase)'}
            {mode === 'login' && 'Sign In with Firebase'}
          </h2>
          <p className="text-xs text-amber-800/80 mt-1 max-w-sm mx-auto">
            {mode === 'signup-owner' && 'Post flexible rush-hour shifts at minimum ₹100/hr with real-time Firebase sync.'}
            {mode === 'signup-attendant' && 'Work at Kolkata\'s aesthetic cafes, earn hourly cash & gain hospital experience!'}
            {mode === 'login' && 'Enter your credentials or choose a quick demo profile.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-amber-100/70 rounded-2xl mb-5 text-xs font-bold text-amber-900">
          <button
            type="button"
            onClick={() => { setMode('signup-owner'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              mode === 'signup-owner' ? 'bg-white text-amber-950 shadow-sm' : 'hover:bg-amber-200/50'
            }`}
          >
            <span>☕</span>
            <span className="truncate">Owner</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup-attendant'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              mode === 'signup-attendant' ? 'bg-white text-amber-950 shadow-sm' : 'hover:bg-amber-200/50'
            }`}
          >
            <span>🎒</span>
            <span className="truncate">Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              mode === 'login' ? 'bg-white text-amber-950 shadow-sm' : 'hover:bg-amber-200/50'
            }`}
          >
            <span>🔑</span>
            <span className="truncate">Sign In</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* OWNER SIGNUP FORM */}
        {mode === 'signup-owner' && (
          <form onSubmit={handleOwnerSubmit} className="space-y-4">
            <div className="bg-amber-50/60 p-3 sm:p-4 rounded-2xl border border-amber-200/60 space-y-3">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Owner Personal Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-amber-800">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rakib Hassan"
                    value={ownerData.name}
                    onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-amber-800">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rakib@cafe.com"
                    value={ownerData.email}
                    onChange={e => setOwnerData({ ...ownerData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-bold text-amber-800">Firebase Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={ownerData.password}
                  onChange={e => setOwnerData({ ...ownerData, password: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Phone with Auto +91 attached */}
              <div>
                <label className="text-[11px] font-bold text-amber-800">
                  Phone Number <span className="text-amber-600 font-semibold">(Auto +91 India Attached)</span>
                </label>
                <div className="flex items-center mt-1">
                  <span className="px-3 py-2 text-xs font-bold bg-amber-200/80 text-amber-900 rounded-l-xl border border-r-0 border-amber-300">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98301 23456"
                    value={ownerData.phone}
                    onChange={e => setOwnerData({ ...ownerData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 text-xs rounded-r-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* CAFE DETAILS */}
            <div className="bg-orange-50/60 p-3 sm:p-4 rounded-2xl border border-orange-200/60 space-y-3">
              <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
                Cafe Details (Kolkata)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-amber-900">Cafe Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rakib's Cafe"
                    value={ownerData.cafeName}
                    onChange={e => setOwnerData({ ...ownerData, cafeName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-900">Kolkata Locality / Area</label>
                  <select
                    value={ownerData.cafeArea}
                    onChange={e => setOwnerData({ ...ownerData, cafeArea: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    {CALCUTTA_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-900">Full Cafe Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42A Park Street (Near Flurys), Kolkata - 700016"
                  value={ownerData.cafeAddress}
                  onChange={e => setOwnerData({ ...ownerData, cafeAddress: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Firebase Storage Photo Upload for Cafe */}
              <div>
                <label className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
                  <span>Cafe Storefront / Logo Photo</span>
                  <span className="text-amber-600 font-normal text-[10px]">Firebase Storage</span>
                </label>
                <div className="mt-1 flex items-center gap-3">
                  {ownerData.cafePhotoUrl ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-300">
                      <img src={ownerData.cafePhotoUrl} alt="Cafe" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-dashed border-amber-300 flex items-center justify-center text-xl text-amber-700">
                      ☕
                    </div>
                  )}

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-50 transition-colors shadow-sm">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cafe Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'cafe')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Minimum wage setter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
                    <span>Default Hourly Wage</span>
                    <span className="text-amber-600 font-extrabold">Min ₹100/hr</span>
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="px-3 py-2 text-xs font-bold bg-amber-100 text-amber-900 rounded-l-xl border border-r-0 border-amber-200">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={100}
                      step={5}
                      required
                      value={ownerData.minHourlyWage}
                      onChange={e => setOwnerData({ ...ownerData, minHourlyWage: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-r-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-amber-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-900">Cafe Mascot Animal</label>
                  <div className="flex gap-1.5 mt-1 overflow-x-auto py-1">
                    {ANIMAL_MASCOTS.slice(0, 5).map(m => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setOwnerData({ ...ownerData, cafeMascot: m.emoji })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                          ownerData.cafeMascot === m.emoji
                            ? 'bg-amber-200 border-amber-500 scale-110 shadow-sm'
                            : 'bg-white border-amber-200 hover:bg-amber-50'
                        }`}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSyncing || uploadingImage}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Coffee className="w-4 h-4" />
              )}
              <span>Complete Cafe Registration (Firebase)</span>
            </button>
          </form>
        )}

        {/* ATTENDANT (STUDENT) SIGNUP FORM */}
        {mode === 'signup-attendant' && (
          <form onSubmit={handleAttendantSubmit} className="space-y-4">
            <div className="bg-emerald-50/60 p-3 sm:p-4 rounded-2xl border border-emerald-200/60 space-y-3">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                Student Profile Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-emerald-900">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Mukherjee"
                    value={attendantData.name}
                    onChange={e => setAttendantData({ ...attendantData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-900">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ananya@college.edu.in"
                    value={attendantData.email}
                    onChange={e => setAttendantData({ ...attendantData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-bold text-emerald-900">Firebase Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={attendantData.password}
                  onChange={e => setAttendantData({ ...attendantData, password: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Phone with Auto +91 attached */}
              <div>
                <label className="text-[11px] font-bold text-emerald-900">
                  Mobile Number <span className="text-emerald-700 font-semibold">(Auto +91 India Attached)</span>
                </label>
                <div className="flex items-center mt-1">
                  <span className="px-3 py-2 text-xs font-bold bg-emerald-200/80 text-emerald-900 rounded-l-xl border border-r-0 border-emerald-300">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98312 99881"
                    value={attendantData.phone}
                    onChange={e => setAttendantData({ ...attendantData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 text-xs rounded-r-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Gender and Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-emerald-900">Gender</label>
                  <select
                    value={attendantData.gender}
                    onChange={e => setAttendantData({ ...attendantData, gender: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-900">Age (Years)</label>
                  <input
                    type="number"
                    min={16}
                    max={28}
                    required
                    value={attendantData.age}
                    onChange={e => setAttendantData({ ...attendantData, age: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              {/* School / College Name in Kolkata */}
              <div>
                <label className="text-[11px] font-bold text-emerald-900">
                  School or College Name (Kolkata)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Xavier's College / Presidency Univ / Jadavpur Univ"
                  value={attendantData.college}
                  onChange={e => setAttendantData({ ...attendantData, college: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Current Residence Address */}
              <div>
                <label className="text-[11px] font-bold text-emerald-900">
                  Current Residence Address in Kolkata
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 3B, Ballygunge Circular Road, Kolkata - 700019"
                  value={attendantData.address}
                  onChange={e => setAttendantData({ ...attendantData, address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Student Photo Upload (Firebase Storage) */}
              <div>
                <label className="text-[11px] font-bold text-emerald-900 flex items-center justify-between">
                  <span>Student Photo / College ID</span>
                  <span className="text-emerald-700 font-normal text-[10px]">Firebase Storage</span>
                </label>
                <div className="mt-1 flex items-center gap-3">
                  {attendantData.photoUrl ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-300">
                      <img src={attendantData.photoUrl} alt="Student" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-dashed border-emerald-300 flex items-center justify-center text-xl text-emerald-700">
                      🎒
                    </div>
                  )}

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Student ID Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'student')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Cute Mascot */}
              <div>
                <label className="text-[11px] font-bold text-emerald-900">Choose your Student Mascot</label>
                <div className="flex gap-2 mt-1 overflow-x-auto py-1">
                  {ANIMAL_MASCOTS.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setAttendantData({ ...attendantData, mascot: m.emoji })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                        attendantData.mascot === m.emoji
                          ? 'bg-emerald-200 border-emerald-500 scale-110 shadow-sm'
                          : 'bg-white border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSyncing || uploadingImage}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
              <span>Create Student Account (Firebase)</span>
            </button>
          </form>
        )}

        {/* SIGN IN TAB */}
        {mode === 'login' && (
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                Sign In with Firebase Auth
              </span>
              <div>
                <label className="text-[11px] font-bold text-amber-900">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rakib@rakibscafe.in or student@stxaviers.edu.in"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-900">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sign In with Firebase</span>
              </button>
            </form>

            <div className="relative text-center my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-200"></div></div>
              <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                Or Quick 1-Click Demo Profile
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setAuthModalOpen(false);
                  }}
                  className="p-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/60 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                      {u.mascot || '🐾'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-950 flex items-center gap-2">
                        {u.name}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'owner' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          {u.role === 'owner' ? 'Cafe Owner' : 'Student'}
                        </span>
                      </div>
                      <div className="text-xs text-amber-700">
                        +91 {u.phone} {u.college ? `· ${u.college.split(' - ')[0]}` : ''}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-700 group-hover:text-amber-950">
                    Switch →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
