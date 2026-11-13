import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { uploadImageToStorage } from '../services/firebaseService';
import { Coffee, GraduationCap, Lock, Mail, Phone, MapPin, Eye, EyeOff, Sparkles, ArrowRight, Loader2, Clock, Zap, Camera, Upload } from 'lucide-react';

export default function AuthScreen() {
  const {
    loginUser,
    signupOwner,
    signupAttendant,
    isSyncing,
    firebaseConnected
  } = useApp();

  // Mode: 'login' | 'signup-attendant' | 'signup-owner'
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Attendant (Student) state
  const [attendantData, setAttendantData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Female',
    age: 19,
    address: '',
    college: '',
    photoUrl: ''
  });

  // Owner state
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cafeName: '',
    cafeArea: 'Park Street',
    cafeAddress: '',
    photoUrl: '',
    minHourlyWage: 100
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim()) return setError('Please enter your email');
    if (!loginPassword) return setError('Please enter your password');
    try {
      await loginUser(loginEmail.trim(), loginPassword);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    }
  };

  const handleStudentSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!attendantData.name.trim()) return setError('Please enter your full name');
    if (!attendantData.email.trim() || !attendantData.email.includes('@')) return setError('Please enter a valid email');
    if (!attendantData.password || attendantData.password.length < 6) return setError('Password must be at least 6 characters');
    if (!attendantData.phone.trim() || attendantData.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid 10-digit mobile number for +91');
    }
    if (!attendantData.college.trim()) return setError('Please enter your school or college name in Kolkata');
    if (!attendantData.address.trim()) return setError('Please enter your current Kolkata residence address');

    try {
      await signupAttendant(attendantData);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  const handleOwnerSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!ownerData.name.trim()) return setError('Please enter your full name');
    if (!ownerData.email.trim() || !ownerData.email.includes('@')) return setError('Please enter a valid email');
    if (!ownerData.password || ownerData.password.length < 6) return setError('Password must be at least 6 characters');
    if (!ownerData.phone.trim() || ownerData.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid 10-digit mobile number for +91');
    }
    if (!ownerData.cafeName.trim()) return setError('Please enter your cafe name');
    if (Number(ownerData.minHourlyWage) < 100) return setError('Hourly wage must be at least ₹100/hr (Kolkata student fair wage)');

    try {
      await signupOwner(ownerData);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between text-[#0A011C] selection:bg-[#FF0046] selection:text-white">
      
      {/* Top Header */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm font-headline">
              CCC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline text-xl font-bold tracking-tight text-[#0A011C] uppercase">
                  Calcutta Cafe Club
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-[3px] border border-stone-200">
            <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500' : 'bg-[#FE9900]'}`}></span>
            <span>Firebase Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 1. SIGN IN / SIGN UP CARD (CLEAN WHITE CARD) */}
        <div className="max-w-xl mx-auto w-full">
          <div className="bg-white rounded-[3px] p-6 sm:p-8 border border-stone-200 shadow-md">
            
            {/* Header within Card */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-[#0A011C] tracking-tight uppercase">
                {mode === 'login' && 'Sign In to Portal'}
                {mode === 'signup-attendant' && 'Join as Student Attendant'}
                {mode === 'signup-owner' && 'Register Cafe as Owner'}
              </h2>
              <p className="text-xs text-stone-500 mt-1.5 font-sans">
                {mode === 'login' && 'Sign in to access your shifts and cafe dashboard'}
                {mode === 'signup-attendant' && 'Earn hourly pocket money with flexible shifts around your studies'}
                {mode === 'signup-owner' && 'Staff your rush hours with verified students (min ₹100/hr)'}
              </p>
            </div>

            {/* Segmented Control Pill Tabs */}
            <div className="grid grid-cols-3 p-1 rounded-[3px] bg-stone-100 mb-6 text-xs font-bold uppercase tracking-wider text-stone-600 border border-stone-200">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2.5 rounded-[3px] transition-all text-center ${
                  mode === 'login'
                    ? 'bg-[#FF0046] text-white shadow-xs'
                    : 'hover:text-[#0A011C]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-attendant'); setError(''); }}
                className={`py-2.5 rounded-[3px] transition-all text-center ${
                  mode === 'signup-attendant'
                    ? 'bg-[#FF0046] text-white shadow-xs'
                    : 'hover:text-[#0A011C]'
                }`}
              >
                Student Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-owner'); setError(''); }}
                className={`py-2.5 rounded-[3px] transition-all text-center ${
                  mode === 'signup-owner'
                    ? 'bg-[#FF0046] text-white shadow-xs'
                    : 'hover:text-[#0A011C]'
                }`}
              >
                Owner Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-[3px] bg-rose-50 border border-rose-200 text-[#FF0046] text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* A. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 font-headline">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-headline">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3 shadow-sm"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* B. SIGN UP AS ATTENDANT (STUDENT) */}
            {mode === 'signup-attendant' && (
              <form onSubmit={handleStudentSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Mukherjee"
                      value={attendantData.name}
                      onChange={e => setAttendantData({ ...attendantData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@stxaviers.edu.in"
                      value={attendantData.email}
                      onChange={e => setAttendantData({ ...attendantData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>
                </div>

                {/* Password & Phone with +91 attached */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={attendantData.password}
                      onChange={e => setAttendantData({ ...attendantData, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                      Mobile Number (+91)
                    </label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98312 99881"
                        value={attendantData.phone}
                        onChange={e => setAttendantData({ ...attendantData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* College / School in Kolkata */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                    School or College Name (Kolkata)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier's College / Presidency Univ / Jadavpur Univ"
                    value={attendantData.college}
                    onChange={e => setAttendantData({ ...attendantData, college: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  />
                </div>

                {/* Residence address in Kolkata */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                    Current Residence Address (Kolkata)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 3B, Ballygunge Circular Road, Kolkata - 700019"
                    value={attendantData.address}
                    onChange={e => setAttendantData({ ...attendantData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                  />
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Age</label>
                    <input
                      type="number"
                      min={16}
                      max={28}
                      required
                      value={attendantData.age}
                      onChange={e => setAttendantData({ ...attendantData, age: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Gender</label>
                    <select
                      value={attendantData.gender}
                      onChange={e => setAttendantData({ ...attendantData, gender: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 font-headline">
                    Profile Photo (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[3px] bg-white border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {attendantData.photoUrl ? (
                        <img src={attendantData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-5 h-5 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-white hover:bg-stone-100 text-stone-700 rounded-[3px] border border-stone-200 transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-[#FF0046]" />
                        <span>{attendantData.photoUrl ? 'Change Photo' : 'Upload Student Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadingPhoto(true);
                              try {
                                const url = await uploadImageToStorage(file, 'students');
                                setAttendantData(prev => ({ ...prev, photoUrl: url }));
                              } finally {
                                setUploadingPhoto(false);
                              }
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-stone-400 mt-1">PNG, JPG, or WebP. Shown to cafe owners when booked.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Create Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* C. SIGN UP AS OWNER (CAFE) */}
            {mode === 'signup-owner' && (
              <form onSubmit={handleOwnerSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rakib Hassan"
                      value={ownerData.name}
                      onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="rakib@cafe.in"
                      value={ownerData.email}
                      onChange={e => setOwnerData({ ...ownerData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={ownerData.password}
                      onChange={e => setOwnerData({ ...ownerData, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                      Mobile Number (+91)
                    </label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98301 23456"
                        value={ownerData.phone}
                        onChange={e => setOwnerData({ ...ownerData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cafe Details */}
                <div className="pt-2 border-t border-stone-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Cafe Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rakib's Cafe"
                        value={ownerData.cafeName}
                        onChange={e => setOwnerData({ ...ownerData, cafeName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Kolkata Locality</label>
                      <select
                        value={ownerData.cafeArea}
                        onChange={e => setOwnerData({ ...ownerData, cafeArea: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
                      >
                        {CALCUTTA_AREAS.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Full Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 42A Park Street, Kolkata - 700016"
                      value={ownerData.cafeAddress}
                      onChange={e => setOwnerData({ ...ownerData, cafeAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                      Base Starting Hourly Wage (Min ₹100/hr)
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
                        value={ownerData.minHourlyWage}
                        onChange={e => setOwnerData({ ...ownerData, minHourlyWage: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 font-bold text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046]"
                      />
                    </div>
                  </div>

                  {/* Cafe Logo / Storefront Photo Upload */}
                  <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 font-headline">
                      Cafe Logo or Photo (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[3px] bg-white border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        {ownerData.photoUrl ? (
                          <img src={ownerData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Coffee className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-white hover:bg-stone-100 text-stone-700 rounded-[3px] border border-stone-200 transition-colors shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#FF0046]" />
                          <span>{ownerData.photoUrl ? 'Change Photo' : 'Upload Cafe Logo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadingPhoto(true);
                                try {
                                  const url = await uploadImageToStorage(file, 'cafes');
                                  setOwnerData(prev => ({ ...prev, photoUrl: url }));
                                } finally {
                                  setUploadingPhoto(false);
                                }
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-stone-400 mt-1">Displayed to students on shift offer cards.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 bg-[#FF0046] hover:bg-[#E6003F] text-white font-bold text-xs uppercase tracking-wider rounded-[3px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Register Cafe & Open Tab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

        {/* 2. PLATFORM INFO & WORK CULTURE SHOWCASE (PLACED AFTER THE SIGN IN / SIGNUP CARD) */}
        <div className="border-t border-stone-200 pt-10 sm:pt-14 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-stone-100 border border-stone-200 text-[#0A011C] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF0046]" />
              <span>Western cafe work culture, now in Calcutta</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A011C] tracking-tight uppercase">
              Flexible cafe shifts for students in Kolkata.
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              A win-win for cafes and students. Cafe owners handle high-energy rush hours with polite, enthusiastic students. Students earn hourly pocket money with shifts designed around college schedules.
            </p>
          </div>

          {/* 3 Value Proposition Cards (Clean white cards with 3px corners & IFP accents) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-[#FF0046] shadow-xs transition-colors space-y-2">
              <div className="w-9 h-9 rounded-[3px] bg-rose-50 text-[#FF0046] flex items-center justify-center border border-rose-200 text-sm font-bold font-headline">
                ₹
              </div>
              <h4 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Guaranteed Minimum ₹100/Hour
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Owners can increase pay based on rush hours (₹120, ₹140, ₹150+).
              </p>
            </div>

            <div className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-[#00DADC] shadow-xs transition-colors space-y-2">
              <div className="w-9 h-9 rounded-[3px] bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-200 text-sm">
                <Clock className="w-4 h-4 text-cyan-700" />
              </div>
              <h4 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Minimum 3-Hour Shifts
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Fair, predictable hours that fit right between classes or on weekends.
              </p>
            </div>

            <div className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-[#FE9900] shadow-xs transition-colors space-y-2">
              <div className="w-9 h-9 rounded-[3px] bg-amber-50 text-[#FE9900] flex items-center justify-center border border-amber-200 text-sm">
                <Zap className="w-4 h-4 text-[#FE9900]" />
              </div>
              <h4 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Instant Real-Time Shift Locking
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Once booked, shifts lock immediately. Owners reach out via Phone & WhatsApp.
              </p>
            </div>

          </div>

          {/* Verified Locations Bar */}
          <div className="bg-white rounded-[3px] p-4 border border-stone-200 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 shadow-2xs">
            <span className="font-bold text-[#0A011C] uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
              <span>Verified locations:</span>
            </span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Park Street</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Southern Ave</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Salt Lake Sec 5</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Hindustan Park</span>
          </div>

        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200 bg-white px-6 py-4 text-center text-xs text-stone-500">
        Calcutta Cafe Club · Verified student cafe staffing network · Minimum ₹100/hr wage guaranteed
      </footer>
    </div>
  );
}
