import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS, ANIMAL_MASCOTS } from '../data/seedData';
import { Coffee, GraduationCap, Lock, Mail, Phone, User, MapPin, Building, Eye, EyeOff, Sparkles, Check, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function AuthScreen() {
  const {
    loginUser,
    signupOwner,
    signupAttendant,
    users,
    switchUser,
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
      setError(err.message || 'Invalid email or password. You can also use the 1-click demo accounts below.');
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
      <header className="border-b border-stone-200/80 bg-white/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center font-bold text-lg shadow-sm">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble text-xl font-bold tracking-tight text-stone-900">
                  Chai & Paws
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  Kolkata
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Calcutta's student cafe shift network · Min ₹100/hr fair wage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100/80 px-3 py-1 rounded-full border border-stone-200/60">
              <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              <span>Firebase Auth & Realtime</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Split Desktop / Clean Mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Modern Editorial Card (Desktop/Tablet) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Western cafe work culture, now in Calcutta</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bubble font-bold text-stone-950 tracking-tight leading-[1.15]">
              Flexible cafe shifts for students in Kolkata.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg">
              A win-win for cafes and students. Cafe owners handle high-energy rush hours with polite, enthusiastic students. Students earn hourly pocket money with shifts designed around college schedules.
            </p>

            {/* Feature list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Guaranteed Minimum ₹100/Hour</p>
                  <p className="text-[11px] text-stone-500">Owners can increase pay based on rush hours (₹120, ₹140, ₹150+).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Minimum 3-Hour Shifts</p>
                  <p className="text-[11px] text-stone-500">Fair, predictable hours that fit right between classes or on weekends.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Instant Real-Time Shift Locking</p>
                  <p className="text-[11px] text-stone-500">Once booked, shifts lock immediately. Owners reach out via Phone & WhatsApp.</p>
                </div>
              </div>
            </div>

            {/* Calcutta Hubs preview */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Verified locations:</span>
              <span>Park Street</span>
              <span>·</span>
              <span>Southern Ave</span>
              <span>·</span>
              <span>Salt Lake Sec 5</span>
              <span>·</span>
              <span>Hindustan Park</span>
            </div>
          </div>

          {/* Right Column: Modern Authentication Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-xl mx-auto">
              
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

              {/* 1. SIGN IN FORM */}
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
                      <span className="text-[11px] text-stone-400">Default: Password@123</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
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
                    <span>Sign In to Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 2. SIGN UP AS ATTENDANT (STUDENT) */}
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

              {/* 3. SIGN UP AS OWNER (CAFE) */}
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

              {/* 1-Click Fast Demo Testing Bar */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <p className="text-[11px] font-semibold text-stone-500 mb-2.5 text-center">
                  Instant Test Accounts (1-Click Login):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => switchUser('user-rakib')}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900 text-left transition-colors flex items-center gap-2.5 group"
                  >
                    <span className="text-lg">☕</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">Rakib Hassan</div>
                      <div className="text-[10px] text-stone-500 truncate">Owner (Rakib's Cafe)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchUser('user-ananya')}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900 text-left transition-colors flex items-center gap-2.5 group"
                  >
                    <span className="text-lg">🎒</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">Ananya Mukherjee</div>
                      <div className="text-[10px] text-stone-500 truncate">Student (St. Xavier's)</div>
                    </div>
                  </button>
                </div>
              </div>

            </div>
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
