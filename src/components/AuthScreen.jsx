import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS, ANIMAL_MASCOTS } from '../data/seedData';
import { Coffee, GraduationCap, Lock, Mail, Phone, User, MapPin, Building, Eye, EyeOff, Sparkles, Check, ArrowRight, ShieldCheck, Loader2, Clock, IndianRupee, Zap } from 'lucide-react';

export default function AuthScreen() {
  const {
    loginUser,
    signupOwner,
    signupAttendant,
    uploadImage,
    isSyncing,
    firebaseConnected
  } = useApp();

  // Mode: 'login' | 'signup-attendant' | 'signup-owner'
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('Password@123');

  // Attendant (Student) state
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
    photoUrl: ''
  });

  // Owner state
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: '',
    password: 'Password@123',
    phone: '',
    cafeName: "Rakib's Cafe",
    cafeArea: 'Park Street',
    cafeAddress: '',
    cafeMascot: '🐱',
    minHourlyWage: 120
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim()) return setError('Please enter your email');
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
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-between text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Minimal Header */}
      <header className="border-b border-stone-200/80 bg-white/70 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center font-bold text-base shadow-xs">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-lg font-bold tracking-tight text-stone-900">
                  Chai & Paws
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100/80 px-3 py-1 rounded-full border border-stone-200/60">
            <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
            <span>Firebase Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 1. SIGN IN / SIGN UP CARD (PRIMARY FOCUS AT TOP) */}
        <div className="max-w-xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            
            {/* Header within Card */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-bubble text-stone-950 tracking-tight">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup-attendant' && 'Join as Student Attendant'}
                {mode === 'signup-owner' && 'Register Cafe as Owner'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {mode === 'login' && 'Sign in to access your shifts and cafe dashboard'}
                {mode === 'signup-attendant' && 'Earn hourly pocket money with flexible shifts around your studies'}
                {mode === 'signup-owner' && 'Staff your rush hours with verified students (min ₹100/hr)'}
              </p>
            </div>

            {/* Segmented Control Pill Tabs */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 mb-6 text-xs font-semibold text-stone-600">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2.5 rounded-xl transition-all text-center ${
                  mode === 'login'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-attendant'); setError(''); }}
                className={`py-2.5 rounded-xl transition-all text-center ${
                  mode === 'signup-attendant'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                Student Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-owner'); setError(''); }}
                className={`py-2.5 rounded-xl transition-all text-center ${
                  mode === 'signup-owner'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                Owner Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* A. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rakib@rakibscafe.in"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-800">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
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
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
                    <label className="text-xs font-bold text-stone-800 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Mukherjee"
                      value={attendantData.name}
                      onChange={e => setAttendantData({ ...attendantData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@stxaviers.edu.in"
                      value={attendantData.email}
                      onChange={e => setAttendantData({ ...attendantData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Password & Phone with +91 attached */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={attendantData.password}
                      onChange={e => setAttendantData({ ...attendantData, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 text-xs font-bold bg-stone-100 text-stone-700 rounded-l-xl border border-r-0 border-stone-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98312 99881"
                        value={attendantData.phone}
                        onChange={e => setAttendantData({ ...attendantData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 text-xs rounded-r-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* College / School in Kolkata */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    School or College Name (Kolkata)
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Xavier's College / Presidency Univ / Jadavpur Univ"
                      value={attendantData.college}
                      onChange={e => setAttendantData({ ...attendantData, college: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Residence address in Kolkata */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Current Residence Address (Kolkata)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 3B, Ballygunge Circular Road, Kolkata - 700019"
                      value={attendantData.address}
                      onChange={e => setAttendantData({ ...attendantData, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Age & Gender & Mascot */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Age</label>
                    <input
                      type="number"
                      min={16}
                      max={28}
                      required
                      value={attendantData.age}
                      onChange={e => setAttendantData({ ...attendantData, age: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Gender</label>
                    <select
                      value={attendantData.gender}
                      onChange={e => setAttendantData({ ...attendantData, gender: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Mascot</label>
                    <select
                      value={attendantData.mascot}
                      onChange={e => setAttendantData({ ...attendantData, mascot: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    >
                      <option value="🐼">🐼 Panda</option>
                      <option value="🐶">🐶 Pup</option>
                      <option value="🐱">🐱 Cat</option>
                      <option value="🐰">🐰 Bunny</option>
                      <option value="🦊">🦊 Fox</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
                    <label className="text-xs font-bold text-stone-800 block mb-1">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rakib Hassan"
                      value={ownerData.name}
                      onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="rakib@cafe.in"
                      value={ownerData.email}
                      onChange={e => setOwnerData({ ...ownerData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={ownerData.password}
                      onChange={e => setOwnerData({ ...ownerData, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 text-xs font-bold bg-stone-100 text-stone-700 rounded-l-xl border border-r-0 border-stone-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98301 23456"
                        value={ownerData.phone}
                        onChange={e => setOwnerData({ ...ownerData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 text-xs rounded-r-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cafe Details */}
                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1">Cafe Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rakib's Cafe"
                        value={ownerData.cafeName}
                        onChange={e => setOwnerData({ ...ownerData, cafeName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1">Kolkata Locality</label>
                      <select
                        value={ownerData.cafeArea}
                        onChange={e => setOwnerData({ ...ownerData, cafeArea: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                      >
                        {CALCUTTA_AREAS.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Full Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 42A Park Street, Kolkata - 700016"
                      value={ownerData.cafeAddress}
                      onChange={e => setOwnerData({ ...ownerData, cafeAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1">
                        Base Hourly Wage (Min ₹100)
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 text-xs font-bold bg-stone-100 text-stone-700 rounded-l-xl border border-r-0 border-stone-200">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={100}
                          step={5}
                          required
                          value={ownerData.minHourlyWage}
                          onChange={e => setOwnerData({ ...ownerData, minHourlyWage: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-r-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900 font-bold text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1">Mascot</label>
                      <select
                        value={ownerData.cafeMascot}
                        onChange={e => setOwnerData({ ...ownerData, cafeMascot: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-stone-900"
                      >
                        <option value="🐱">🐱 Cat</option>
                        <option value="☕">☕ Coffee</option>
                        <option value="🐰">🐰 Bunny</option>
                        <option value="🦊">🦊 Fox</option>
                        <option value="🐶">🐶 Pup</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
        <div className="border-t border-stone-200/80 pt-10 sm:pt-12 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Western cafe work culture, now in Calcutta</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bubble font-bold text-stone-950 tracking-tight">
              Flexible cafe shifts for students in Kolkata.
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              A win-win for cafes and students. Cafe owners handle high-energy rush hours with polite, enthusiastic students. Students earn hourly pocket money with shifts designed around college schedules.
            </p>
          </div>

          {/* 3 Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 text-sm font-bold">
                ₹
              </div>
              <h4 className="text-sm font-bold font-bubble text-stone-950">
                Guaranteed Minimum ₹100/Hour
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Owners can increase pay based on rush hours (₹120, ₹140, ₹150+).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 text-sm">
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <h4 className="text-sm font-bold font-bubble text-stone-950">
                Minimum 3-Hour Shifts
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Fair, predictable hours that fit right between classes or on weekends.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200 text-sm">
                <Zap className="w-4 h-4 text-stone-700" />
              </div>
              <h4 className="text-sm font-bold font-bubble text-stone-950">
                Instant Real-Time Shift Locking
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Once booked, shifts lock immediately. Owners reach out via Phone & WhatsApp.
              </p>
            </div>

          </div>

          {/* Verified Locations Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600">
            <span className="font-semibold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Verified locations:</span>
            </span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800 font-medium">Park Street</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800 font-medium">Southern Ave</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800 font-medium">Salt Lake Sec 5</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800 font-medium">Hindustan Park</span>
          </div>

        </div>

      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-stone-200/80 bg-white/50 px-6 py-4 text-center text-xs text-stone-500">
        Chai & Paws Calcutta · Verified student cafe staffing network · Minimum wage guaranteed
      </footer>
    </div>
  );
}
