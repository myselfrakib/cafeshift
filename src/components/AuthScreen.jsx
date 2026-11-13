import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS, ANIMAL_MASCOTS } from '../data/seedData';
import { Coffee, GraduationCap, Lock, Mail, Phone, MapPin, Building, Eye, EyeOff, Sparkles, Check, ArrowRight, Loader2, Clock, Zap } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col justify-between text-white selection:bg-orange-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Warm Ember Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-600/15 blur-[120px] pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* Top Glass Header */}
      <header className="border-b border-white/[0.08] bg-[#121118]/60 backdrop-blur-2xl px-6 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-[0_4px_16px_rgba(255,107,0,0.35)]">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-xl font-bold tracking-tight text-white">
                  Chai & Paws
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-orange-400 border border-white/[0.1]">
                  Kolkata
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70 bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`}></span>
            <span>{firebaseConnected ? 'Firebase Active' : 'Connecting'}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 1. SIGN IN / SIGN UP CARD (PRIMARY FOCUS) */}
        <div className="max-w-xl mx-auto w-full">
          <div className="glass-panel rounded-3xl p-6 sm:p-9 relative">
            
            {/* Header within Card */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-bubble text-white tracking-tight">
                {mode === 'login' && (
                  <>Good Coffee Good <span className="text-orange-400">Shifts!</span></>
                )}
                {mode === 'signup-attendant' && (
                  <>Join as <span className="text-orange-400">Student Attendant</span></>
                )}
                {mode === 'signup-owner' && (
                  <>Register Cafe as <span className="text-orange-400">Owner</span></>
                )}
              </h2>
              <p className="text-xs text-white/60 mt-1.5">
                {mode === 'login' && 'Sign in to access your student shifts & cafe management'}
                {mode === 'signup-attendant' && 'Earn flexible pocket money with hourly cafe jobs in Kolkata'}
                {mode === 'signup-owner' && 'Staff your rush hours with verified students (minimum ₹100/hr)'}
              </p>
            </div>

            {/* Segmented Control Pill Tabs */}
            <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-white/[0.06] border border-white/[0.08] mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2.5 rounded-xl transition-all text-center ${
                  mode === 'login'
                    ? 'glass-pill-active font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-attendant'); setError(''); }}
                className={`py-2.5 rounded-xl transition-all text-center ${
                  mode === 'signup-attendant'
                    ? 'glass-pill-active font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Student Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-owner'); setError(''); }}
                className={`py-2.5 rounded-xl transition-all text-center ${
                  mode === 'signup-owner'
                    ? 'glass-pill-active font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Owner Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* A. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@college.edu or owner@cafe.in"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl glass-input placeholder-white/30 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-white/80">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 text-xs sm:text-sm rounded-2xl glass-input placeholder-white/30 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 px-5 btn-orange-glow font-bold text-sm rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
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
                    <label className="text-xs font-bold text-white/80 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Mukherjee"
                      value={attendantData.name}
                      onChange={e => setAttendantData({ ...attendantData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@college.edu.in"
                      value={attendantData.email}
                      onChange={e => setAttendantData({ ...attendantData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password & Phone with +91 attached */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={attendantData.password}
                      onChange={e => setAttendantData({ ...attendantData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 text-xs font-bold bg-white/[0.08] text-orange-400 rounded-l-xl border border-r-0 border-white/[0.1]">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98312 99881"
                        value={attendantData.phone}
                        onChange={e => setAttendantData({ ...attendantData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-r-xl glass-input placeholder-white/30 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* College / School in Kolkata */}
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    School or College Name (Kolkata)
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Xavier's College / Presidency Univ / Jadavpur Univ"
                      value={attendantData.college}
                      onChange={e => setAttendantData({ ...attendantData, college: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Residence address in Kolkata */}
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    Current Residence Address (Kolkata)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 3B, Ballygunge Circular Road, Kolkata - 700019"
                      value={attendantData.address}
                      onChange={e => setAttendantData({ ...attendantData, address: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Age & Gender & Mascot */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Age</label>
                    <input
                      type="number"
                      min={16}
                      max={28}
                      required
                      value={attendantData.age}
                      onChange={e => setAttendantData({ ...attendantData, age: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-input focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Gender</label>
                    <select
                      value={attendantData.gender}
                      onChange={e => setAttendantData({ ...attendantData, gender: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl glass-input bg-[#1C1A22] focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Mascot</label>
                    <select
                      value={attendantData.mascot}
                      onChange={e => setAttendantData({ ...attendantData, mascot: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl glass-input bg-[#1C1A22] focus:outline-none"
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
                  className="w-full py-3.5 px-5 btn-orange-glow font-bold text-sm rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
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
                    <label className="text-xs font-bold text-white/80 block mb-1">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rakib Hassan"
                      value={ownerData.name}
                      onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="rakib@cafe.in"
                      value={ownerData.email}
                      onChange={e => setOwnerData({ ...ownerData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={ownerData.password}
                      onChange={e => setOwnerData({ ...ownerData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 text-xs font-bold bg-white/[0.08] text-orange-400 rounded-l-xl border border-r-0 border-white/[0.1]">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98301 23456"
                        value={ownerData.phone}
                        onChange={e => setOwnerData({ ...ownerData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-r-xl glass-input placeholder-white/30 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cafe Details */}
                <div className="pt-2 border-t border-white/[0.08] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Cafe Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rakib's Cafe"
                        value={ownerData.cafeName}
                        onChange={e => setOwnerData({ ...ownerData, cafeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none font-semibold text-orange-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Kolkata Locality</label>
                      <select
                        value={ownerData.cafeArea}
                        onChange={e => setOwnerData({ ...ownerData, cafeArea: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-xl glass-input bg-[#1C1A22] focus:outline-none"
                      >
                        {CALCUTTA_AREAS.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Full Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 42A Park Street, Kolkata - 700016"
                      value={ownerData.cafeAddress}
                      onChange={e => setOwnerData({ ...ownerData, cafeAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder-white/30 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">
                        Base Hourly Wage (Min ₹100)
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 text-xs font-bold bg-white/[0.08] text-orange-400 rounded-l-xl border border-r-0 border-white/[0.1]">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={100}
                          step={5}
                          required
                          value={ownerData.minHourlyWage}
                          onChange={e => setOwnerData({ ...ownerData, minHourlyWage: e.target.value })}
                          className="w-full px-3 py-2.5 text-xs rounded-r-xl glass-input focus:outline-none font-bold text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Mascot</label>
                      <select
                        value={ownerData.cafeMascot}
                        onChange={e => setOwnerData({ ...ownerData, cafeMascot: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-xl glass-input bg-[#1C1A22] focus:outline-none"
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
                  className="w-full py-3.5 px-5 btn-orange-glow font-bold text-sm rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Register Cafe & Open Tab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

        {/* 2. PLATFORM INFO & WORK CULTURE SHOWCASE (PLACED AFTER SIGN / SIGNUP CARD) */}
        <div className="border-t border-white/[0.08] pt-12 sm:pt-16 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Western cafe work culture, now in Calcutta</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bubble font-bold text-white tracking-tight">
              Flexible cafe shifts for students in <span className="text-orange-400">Kolkata.</span>
            </h3>

            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              A win-win for cafes and students. Cafe owners handle high-energy rush hours with polite, enthusiastic students. Students earn hourly pocket money with shifts designed around college schedules.
            </p>
          </div>

          {/* 3 Value Proposition Cards in Dark Glass */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="glass-card rounded-3xl p-6 space-y-3 relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 text-base font-bold shadow-[0_4px_12px_rgba(255,107,0,0.2)]">
                ₹
              </div>
              <h4 className="text-base font-bold font-bubble text-white">
                Guaranteed Minimum ₹100/Hour
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Owners can increase pay based on rush hours (₹120, ₹140, ₹150+).
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 space-y-3 relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 text-base shadow-[0_4px_12px_rgba(255,107,0,0.2)]">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-base font-bold font-bubble text-white">
                Minimum 3-Hour Shifts
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Fair, predictable hours that fit right between classes or on weekends.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 space-y-3 relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 text-base shadow-[0_4px_12px_rgba(255,107,0,0.2)]">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-base font-bold font-bubble text-white">
                Instant Real-Time Shift Locking
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Once booked, shifts lock immediately. Owners reach out via Phone & WhatsApp.
              </p>
            </div>

          </div>

          {/* Verified Locations Bar in Glass */}
          <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Verified locations:</span>
            </span>
            <span className="glass-pill px-3 py-1 rounded-xl font-medium text-white">Park Street</span>
            <span className="text-white/20">·</span>
            <span className="glass-pill px-3 py-1 rounded-xl font-medium text-white">Southern Ave</span>
            <span className="text-white/20">·</span>
            <span className="glass-pill px-3 py-1 rounded-xl font-medium text-white">Salt Lake Sec 5</span>
            <span className="text-white/20">·</span>
            <span className="glass-pill px-3 py-1 rounded-xl font-medium text-white">Hindustan Park</span>
          </div>

        </div>

      </main>

      {/* Modern Dark Glass Footer */}
      <footer className="border-t border-white/[0.08] bg-[#121118]/80 backdrop-blur-md px-6 py-4 text-center text-xs text-white/40">
        Chai & Paws Calcutta · Verified student cafe staffing network · Minimum wage guaranteed
      </footer>
    </div>
  );
}
