import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS, ANIMAL_MASCOTS } from '../data/seedData';
import { Coffee, GraduationCap, Lock, Mail, Phone, User, MapPin, Building, Eye, EyeOff, Sparkles, Check, ArrowRight, ShieldCheck, Loader2, Clock, IndianRupee, Zap } from 'lucide-react';

export default function AuthScreen() {
  const {
    loginUser,
    signupOwner,
    signupAttendant,
    isSyncing,
    firebaseConnected
  } = useApp();

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
      setError(err.message || 'Invalid email or password.');
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
    <div className="min-h-screen bg-ambient-espresso text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* Top Glass Header */}
      <header className="border-b border-white/10 bg-[#120B07]/80 backdrop-blur-xl px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl orange-gradient-btn flex items-center justify-center font-bold text-lg shadow-lg">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-xl font-bold tracking-tight text-white">
                  Chai & Paws
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-orange-400 border border-orange-500/30">
                  Calcutta
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70 bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/10">
            <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>Firebase Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        
        {/* 1. SIGN IN / SIGN UP CARD (FROSTED GLASS PANEL) */}
        <div className="max-w-md mx-auto w-full">
          <div className="glass-panel rounded-[36px] p-6 sm:p-8 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-bubble text-white tracking-tight">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup-attendant' && 'Join as Student Attendant'}
                {mode === 'signup-owner' && 'Register Cafe as Owner'}
              </h2>
              <p className="text-xs text-white/60 mt-1">
                {mode === 'login' && 'Sign in to access your shifts & cafe orders'}
                {mode === 'signup-attendant' && 'Earn hourly pocket money (Min ₹100/hr) with flexible shifts'}
                {mode === 'signup-owner' && 'Staff your rush hours with verified students'}
              </p>
            </div>

            {/* Segmented Control Pill Tabs */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-white/[0.07] border border-white/10 mb-6 text-xs font-semibold text-white/70">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2 rounded-xl transition-all text-center ${
                  mode === 'login'
                    ? 'orange-gradient-btn text-white font-bold shadow-md'
                    : 'hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-attendant'); setError(''); }}
                className={`py-2 rounded-xl transition-all text-center ${
                  mode === 'signup-attendant'
                    ? 'orange-gradient-btn text-white font-bold shadow-md'
                    : 'hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-owner'); setError(''); }}
                className={`py-2 rounded-xl transition-all text-center ${
                  mode === 'signup-owner'
                    ? 'orange-gradient-btn text-white font-bold shadow-md'
                    : 'hover:text-white'
                }`}
              >
                Owner
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
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
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rakib@rakibscafe.in"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 orange-gradient-btn text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2 active:scale-95"
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
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
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
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
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
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Mobile Number (+91)</label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 text-xs font-bold bg-white/10 text-white/80 rounded-l-xl border border-r-0 border-white/15">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98312 99881"
                        value={attendantData.phone}
                        onChange={e => setAttendantData({ ...attendantData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 text-xs rounded-r-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* College / School in Kolkata */}
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">College or School (Kolkata)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier's College / Presidency Univ"
                    value={attendantData.college}
                    onChange={e => setAttendantData({ ...attendantData, college: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Residence address in Kolkata */}
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">Current Kolkata Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ballygunge Circular Road, Kolkata"
                    value={attendantData.address}
                    onChange={e => setAttendantData({ ...attendantData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 orange-gradient-btn text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2 active:scale-95"
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
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
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
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
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
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Mobile Number (+91)</label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 text-xs font-bold bg-white/10 text-white/80 rounded-l-xl border border-r-0 border-white/15">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98301 23456"
                        value={ownerData.phone}
                        onChange={e => setOwnerData({ ...ownerData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 text-xs rounded-r-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cafe Details */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Cafe Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rakib's Cafe"
                        value={ownerData.cafeName}
                        onChange={e => setOwnerData({ ...ownerData, cafeName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Kolkata Locality</label>
                      <select
                        value={ownerData.cafeArea}
                        onChange={e => setOwnerData({ ...ownerData, cafeArea: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white focus:outline-none focus:border-orange-500 bg-[#1A120D]"
                      >
                        {CALCUTTA_AREAS.map(area => (
                          <option key={area} value={area} className="bg-[#1A120D] text-white">{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Full Cafe Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 42A Park Street, Kolkata - 700016"
                      value={ownerData.cafeAddress}
                      onChange={e => setOwnerData({ ...ownerData, cafeAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-panel-subtle border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 orange-gradient-btn text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2 active:scale-95"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Register Cafe & Open Tab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

        {/* 2. PLATFORM WORK CULTURE & VALUE PROPOSITION */}
        <div className="border-t border-white/10 pt-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Western cafe work culture, now in Calcutta</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bubble font-bold text-white tracking-tight">
              Flexible cafe shifts for students in Kolkata.
            </h3>

            <p className="text-xs text-white/60 leading-relaxed">
              A win-win for cafes and students. Cafe owners handle high-energy rush hours with polite, enthusiastic students. Students earn hourly pocket money with shifts designed around college schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FFA234] flex items-center justify-center font-bold text-sm">
                ₹
              </div>
              <h4 className="text-xs font-bold text-white font-bubble">
                Guaranteed Minimum ₹100/Hour
              </h4>
              <p className="text-[11px] text-white/60">
                Owners can increase pay based on rush hours (₹120, ₹140, ₹150+).
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FFA234] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#FFA234]" />
              </div>
              <h4 className="text-xs font-bold text-white font-bubble">
                Minimum 3-Hour Shifts
              </h4>
              <p className="text-[11px] text-white/60">
                Fair, predictable hours that fit right between classes or on weekends.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FFA234] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#FFA234]" />
              </div>
              <h4 className="text-xs font-bold text-white font-bubble">
                Instant Real-Time Shift Locking
              </h4>
              <p className="text-[11px] text-white/60">
                Once booked, shifts lock immediately. Owners reach out via Phone & WhatsApp.
              </p>
            </div>
          </div>

          {/* Verified Locations Bar */}
          <div className="glass-panel-subtle rounded-2xl p-3 border border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Verified locations:</span>
            </span>
            <span className="glass-pill px-2.5 py-0.5 rounded-lg text-white font-medium">Park Street</span>
            <span className="text-white/30">·</span>
            <span className="glass-pill px-2.5 py-0.5 rounded-lg text-white font-medium">Southern Ave</span>
            <span className="text-white/30">·</span>
            <span className="glass-pill px-2.5 py-0.5 rounded-lg text-white font-medium">Salt Lake Sec 5</span>
            <span className="text-white/30">·</span>
            <span className="glass-pill px-2.5 py-0.5 rounded-lg text-white font-medium">Hindustan Park</span>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/10 bg-[#120B07]/80 backdrop-blur-xl py-4 px-6 text-center text-xs text-white/40">
        Chai & Paws Calcutta · Dark Frosted Glassmorphic Architecture
      </footer>

    </div>
  );
}
