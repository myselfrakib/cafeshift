import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CALCUTTA_AREAS } from '../data/seedData';
import { uploadImageToStorage } from '../services/firebaseService';
import {
  Coffee,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
  Clock,
  Zap,
  Camera,
  Upload,
  CheckCircle2,
  Store,
  ArrowLeft,
  UserCheck
} from 'lucide-react';

export default function AuthScreen() {
  const {
    loginUser,
    signupOwner,
    signupAttendant,
    isSyncing
  } = useApp();

  // Primary page navigation: 'login' | 'signup'
  const [authPage, setAuthPage] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#signup')) {
      return 'signup';
    }
    return 'login';
  });

  // Role inside signup page: 'attendant' | 'owner'
  const [signupRole, setSignupRole] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#signup-owner') {
      return 'owner';
    }
    return 'attendant';
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Attendant (Student) signup state
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

  // Owner signup state
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

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#signup-owner') {
        setAuthPage('signup');
        setSignupRole('owner');
        setError('');
      } else if (hash === '#signup' || hash === '#signup-attendant') {
        setAuthPage('signup');
        setSignupRole('attendant');
        setError('');
      } else if (hash === '#login') {
        setAuthPage('login');
        setError('');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const goToLogin = () => {
    if (typeof window !== 'undefined') window.location.hash = '#login';
    setAuthPage('login');
    setError('');
    setIsSubmitting(false);
    submittingRef.current = false;
  };

  const goToSignup = (role = 'attendant') => {
    if (typeof window !== 'undefined') {
      window.location.hash = role === 'owner' ? '#signup-owner' : '#signup-attendant';
    }
    setAuthPage('signup');
    setSignupRole(role);
    setError('');
    setIsSubmitting(false);
    submittingRef.current = false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting) return;
    setError('');

    if (!loginEmail.trim()) return setError('Please enter your email address');
    if (!loginPassword) return setError('Please enter your password');

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await loginUser(loginEmail.trim(), loginPassword);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleStudentSignup = async (e) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting) return;
    setError('');

    if (!attendantData.name.trim()) return setError('Please enter your full name');
    if (!attendantData.email.trim() || !attendantData.email.includes('@')) return setError('Please enter a valid email address');
    if (!attendantData.password || attendantData.password.length < 6) return setError('Password must be at least 6 characters');
    if (!attendantData.phone.trim() || attendantData.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid 10-digit mobile number for +91');
    }
    if (!attendantData.college.trim()) return setError('Please enter your school or college name in Kolkata');
    if (!attendantData.address.trim()) return setError('Please enter your current Kolkata residence address');

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await signupAttendant(attendantData);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleOwnerSignup = async (e) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting) return;
    setError('');

    if (!ownerData.name.trim()) return setError('Please enter your full name');
    if (!ownerData.email.trim() || !ownerData.email.includes('@')) return setError('Please enter a valid email address');
    if (!ownerData.password || ownerData.password.length < 6) return setError('Password must be at least 6 characters');
    if (!ownerData.phone.trim() || ownerData.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid 10-digit mobile number for +91');
    }
    if (!ownerData.cafeName.trim()) return setError('Please enter your cafe name');
    if (Number(ownerData.minHourlyWage) < 100) return setError('Hourly wage must be at least ₹100/hr (Kolkata student fair wage)');

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await signupOwner(ownerData);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between text-[#0A011C] selection:bg-[#FF0046] selection:text-white">
      
      {/* 1. TOP NAVBAR / BRAND HEADER */}
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div
            onClick={goToLogin}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-[3px] bg-[#FF0046] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-xs font-headline group-hover:scale-105 transition-transform">
              CCC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-[#0A011C] uppercase">
                  Calcutta Cafe Club
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[3px] bg-[#00DADC] text-black">
                  Kolkata
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Western cafe work culture · Fair hourly student staffing
              </p>
            </div>
          </div>

          {/* Top-Right Page Navigation Switcher Button */}
          <div className="flex items-center gap-2">
            {authPage === 'login' ? (
              <button
                type="button"
                onClick={() => goToSignup('attendant')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] bg-[#FF0046] hover:bg-[#E6003F] text-white text-xs font-bold uppercase tracking-wider font-headline transition-colors shadow-2xs"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={goToLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] bg-stone-100 hover:bg-stone-200 text-[#0A011C] border border-stone-300 text-xs font-bold uppercase tracking-wider font-headline transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* ======================================================== */}
        {/* PAGE 1: DEDICATED LOGIN PAGE                             */}
        {/* ======================================================== */}
        {authPage === 'login' && (
          <div className="space-y-8 animate-pop">
            
            {/* Login Hero Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-white border border-stone-200 text-[#0A011C] text-xs font-bold uppercase tracking-wider shadow-2xs font-headline">
                <Coffee className="w-3.5 h-3.5 text-[#FF0046]" />
                <span>Welcome to Calcutta Cafe Club</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-headline font-bold text-[#0A011C] tracking-tight uppercase">
                Sign In to Your Account
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                Sign in to manage your cafe shift roster or browse flexible student shifts across Kolkata.
              </p>
            </div>

            {/* Dedicated Sign In Card */}
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white rounded-[3px] p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
                
                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-[3px] bg-rose-50 border border-rose-200 text-[#FF0046] text-xs font-medium space-y-2">
                    <div className="flex items-start gap-2 font-bold">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Sign In Form */}
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
                        placeholder="e.g. ananya@stxaviers.edu.in or owner@cafe.in"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 font-headline">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your account password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Button with Instant Processing Feedback */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSyncing}
                    className={`relative w-full py-3.5 px-4 rounded-[3px] font-bold text-xs uppercase tracking-wider font-headline transition-all overflow-hidden flex items-center justify-center gap-2 shadow-sm ${
                      isSubmitting || isSyncing
                        ? 'bg-[#0A011C] text-white cursor-wait opacity-95 ring-2 ring-[#00DADC]/40'
                        : 'bg-[#FF0046] hover:bg-[#E6003F] text-white active:scale-[0.99] cursor-pointer'
                    }`}
                  >
                    {isSubmitting || isSyncing ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
                        <Loader2 className="w-4 h-4 animate-spin text-[#00DADC]" />
                        <span className="tracking-widest text-[#00DADC]">Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to CCC</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Signup Prompt */}
                <div className="pt-4 border-t border-stone-200/80 text-center">
                  <p className="text-xs text-stone-500 mb-2">
                    Don't have an account on Calcutta Cafe Club yet?
                  </p>
                  <button
                    type="button"
                    onClick={() => goToSignup('attendant')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF0046] hover:underline font-headline"
                  >
                    <span>Create a New Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* TWO ROLE ACTION CARDS TO START SIGN UP DIRECTLY */}
            <div className="max-w-xl mx-auto w-full pt-4">
              <div className="text-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-headline">
                  Or select your role to sign up:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Role Option 1: Student Attendant */}
                <div
                  onClick={() => goToSignup('attendant')}
                  className="group relative p-4 rounded-[3px] border border-stone-200 hover:border-[#FF0046] bg-white transition-all cursor-pointer shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-[3px] bg-[#FF0046]/10 text-[#FF0046] flex items-center justify-center font-bold">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-rose-100 text-[#FF0046] font-mono">
                        ₹100/hr Min
                      </span>
                    </div>
                    <h3 className="font-bold font-headline text-sm text-[#0A011C] uppercase group-hover:text-[#FF0046] transition-colors">
                      Sign Up as Attendant
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      Flexible cafe shifts around college lectures. Free meals, tip share & verified hourly pay.
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#FF0046] font-headline uppercase tracking-wider">
                    <span>Join as Student</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Role Option 2: Cafe Owner */}
                <div
                  onClick={() => goToSignup('owner')}
                  className="group relative p-4 rounded-[3px] border border-stone-200 hover:border-[#00DADC] bg-white transition-all cursor-pointer shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-[3px] bg-[#00DADC]/15 text-[#006062] flex items-center justify-center font-bold">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-cyan-100 text-[#006062] font-mono">
                        Rush Staffing
                      </span>
                    </div>
                    <h3 className="font-bold font-headline text-sm text-[#0A011C] uppercase group-hover:text-[#008b8d] transition-colors">
                      Sign Up as Owner
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      Publish open shifts in seconds and staff rush hours with energetic Kolkata college students.
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#006062] font-headline uppercase tracking-wider">
                    <span>Register Cafe</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: DEDICATED SIGNUP PAGE                            */}
        {/* ======================================================== */}
        {authPage === 'signup' && (
          <div className="space-y-8 animate-pop">
            
            {/* Signup Hero Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-white border border-stone-200 text-[#0A011C] text-xs font-bold uppercase tracking-wider shadow-2xs font-headline">
                <Sparkles className="w-3.5 h-3.5 text-[#FF0046]" />
                <span>New Member Registration</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-headline font-bold text-[#0A011C] tracking-tight uppercase">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                Choose your role to get started with Calcutta Cafe Club.
              </p>
            </div>

            {/* Dedicated Sign Up Card */}
            <div className="max-w-xl mx-auto w-full">
              <div className="bg-white rounded-[3px] p-5 sm:p-8 border border-stone-200 shadow-md space-y-6">
                
                {/* DEDICATED 2-ROLE SELECTOR TABS AT TOP OF SIGNUP */}
                <div className="grid grid-cols-2 p-1 rounded-[3px] bg-stone-100 text-xs font-bold uppercase tracking-wider text-stone-600 border border-stone-200 font-headline">
                  <button
                    type="button"
                    onClick={() => { setSignupRole('attendant'); setError(''); }}
                    className={`py-2.5 rounded-[3px] transition-all flex items-center justify-center gap-2 ${
                      signupRole === 'attendant'
                        ? 'bg-[#FF0046] text-white shadow-xs'
                        : 'hover:text-[#0A011C] hover:bg-stone-200/50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Attendant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSignupRole('owner'); setError(''); }}
                    className={`py-2.5 rounded-[3px] transition-all flex items-center justify-center gap-2 ${
                      signupRole === 'owner'
                        ? 'bg-[#0A011C] text-white shadow-xs'
                        : 'hover:text-[#0A011C] hover:bg-stone-200/50'
                    }`}
                  >
                    <Coffee className="w-4 h-4 text-[#00DADC]" />
                    <span>Cafe Owner</span>
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-[3px] bg-rose-50 border border-rose-200 text-[#FF0046] text-xs font-medium space-y-2">
                    <div className="flex items-start gap-2 font-bold">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SUB-FORM 1: STUDENT ATTENDANT SIGNUP                */}
                {/* ---------------------------------------------------- */}
                {signupRole === 'attendant' && (
                  <div className="space-y-5">
                    
                    {/* Role Highlight Banner */}
                    <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#FF0046] text-white font-headline">
                          Student Role
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs font-bold text-stone-700">Kolkata Fair Student Work</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Work shifts around college lectures, earn guaranteed ₹100/hr, and get free cafe snacks & coffee.
                      </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleStudentSignup} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Mukherjee"
                            value={attendantData.name}
                            onChange={e => setAttendantData({ ...attendantData, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="ananya@stxaviers.edu.in"
                            value={attendantData.email}
                            onChange={e => setAttendantData({ ...attendantData, email: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-medium"
                          />
                        </div>
                      </div>

                      {/* Password & Phone with +91 attached */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Password (Min 6 chars) *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="Choose password"
                              value={attendantData.password}
                              onChange={e => setAttendantData({ ...attendantData, password: e.target.value })}
                              className="w-full px-3 pr-8 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Mobile Number (+91) *
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
                          School or College Name (Kolkata) *
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
                          Current Residence Address (Kolkata) *
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
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Age *</label>
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
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">Gender *</label>
                          <select
                            value={attendantData.gender}
                            onChange={e => setAttendantData({ ...attendantData, gender: e.target.value })}
                            className="w-full px-2 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046] font-medium"
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
                          Student Profile Photo (Optional)
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
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-stone-100 text-stone-700 rounded-[3px] border border-stone-200 transition-colors shadow-2xs">
                              {uploadingPhoto ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF0046]" />
                              ) : (
                                <Upload className="w-3.5 h-3.5 text-[#FF0046]" />
                              )}
                              <span>{attendantData.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingPhoto}
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
                            <p className="text-[10px] text-stone-400 mt-1">Shown to cafe owners when your shift is booked.</p>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || isSyncing}
                        className={`relative w-full py-3.5 px-4 rounded-[3px] font-bold text-xs uppercase tracking-wider font-headline transition-all overflow-hidden flex items-center justify-center gap-2 shadow-sm ${
                          isSubmitting || isSyncing
                            ? 'bg-[#0A011C] text-white cursor-wait opacity-95 ring-2 ring-[#00DADC]/40'
                            : 'bg-[#FF0046] hover:bg-[#E6003F] text-white active:scale-[0.99] cursor-pointer'
                        }`}
                      >
                        {isSubmitting || isSyncing ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
                            <Loader2 className="w-4 h-4 animate-spin text-[#00DADC]" />
                            <span className="tracking-widest text-[#00DADC]">Creating Student Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Student Account</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SUB-FORM 2: CAFE OWNER SIGNUP                       */}
                {/* ---------------------------------------------------- */}
                {signupRole === 'owner' && (
                  <div className="space-y-5">
                    
                    {/* Role Highlight Banner */}
                    <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#0A011C] text-[#00DADC] font-headline">
                          Cafe Owner Role
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs font-bold text-stone-700">Kolkata Rush Staffing</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Post shift offers, staff high-energy rush hours, and manage multiple cafe branches across Kolkata.
                      </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleOwnerSignup} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Owner Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rakib Hassan"
                            value={ownerData.name}
                            onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="rakib@cafe.in"
                            value={ownerData.email}
                            onChange={e => setOwnerData({ ...ownerData, email: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Password (Min 6 chars) *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="Choose password"
                              value={ownerData.password}
                              onChange={e => setOwnerData({ ...ownerData, password: e.target.value })}
                              className="w-full px-3 pr-8 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Mobile Number (+91) *
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

                      {/* Cafe Outlet Details */}
                      <div className="pt-2 border-t border-stone-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                              Cafe Outlet Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rio & Timmy / Cafe Mezzuna"
                              value={ownerData.cafeName}
                              onChange={e => setOwnerData({ ...ownerData, cafeName: e.target.value })}
                              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046] font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                              Kolkata Locality *
                            </label>
                            <select
                              value={ownerData.cafeArea}
                              onChange={e => setOwnerData({ ...ownerData, cafeArea: e.target.value })}
                              className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046] font-medium"
                            >
                              {CALCUTTA_AREAS.map(area => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Full Street Address *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 42A Park Street, near Allen Park, Kolkata - 700016"
                            value={ownerData.cafeAddress}
                            onChange={e => setOwnerData({ ...ownerData, cafeAddress: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-[3px] border border-stone-200 bg-stone-50 text-[#0A011C] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#FF0046]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1 font-headline">
                            Base Starting Hourly Wage (Min ₹100/hr) *
                          </label>
                          <div className="flex items-center">
                            <span className="px-3 py-2 text-xs font-bold bg-stone-200 text-stone-800 rounded-l-[3px] border border-r-0 border-stone-200 font-mono">
                              ₹
                            </span>
                            <input
                              type="number"
                              min={100}
                              step={5}
                              required
                              value={ownerData.minHourlyWage}
                              onChange={e => setOwnerData({ ...ownerData, minHourlyWage: e.target.value })}
                              className="w-full px-3 py-2 text-xs rounded-r-[3px] border border-stone-200 bg-stone-50 font-bold text-[#0A011C] focus:bg-white focus:outline-none focus:border-[#FF0046] font-mono"
                            />
                          </div>
                          <p className="text-[10px] text-stone-400 mt-1">Guarantees Kolkata student fair work standards.</p>
                        </div>

                        {/* Cafe Logo / Storefront Photo Upload */}
                        <div className="p-3 bg-stone-50 rounded-[3px] border border-stone-200">
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5 font-headline">
                            Cafe Logo or Storefront Photo (Optional)
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-[3px] bg-white border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                              {ownerData.photoUrl ? (
                                <img src={ownerData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <Store className="w-5 h-5 text-stone-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-stone-100 text-stone-700 rounded-[3px] border border-stone-200 transition-colors shadow-2xs">
                                {uploadingPhoto ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF0046]" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5 text-[#FF0046]" />
                                )}
                                <span>{ownerData.photoUrl ? 'Change Logo' : 'Upload Cafe Logo'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingPhoto}
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
                              <p className="text-[10px] text-stone-400 mt-1">Shown to students on your shift offer cards.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || isSyncing}
                        className={`relative w-full py-3.5 px-4 rounded-[3px] font-bold text-xs uppercase tracking-wider font-headline transition-all overflow-hidden flex items-center justify-center gap-2 shadow-sm ${
                          isSubmitting || isSyncing
                            ? 'bg-[#0A011C] text-white cursor-wait opacity-95 ring-2 ring-[#00DADC]/40'
                            : 'bg-[#FF0046] hover:bg-[#E6003F] text-white active:scale-[0.99] cursor-pointer'
                        }`}
                      >
                        {isSubmitting || isSyncing ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
                            <Loader2 className="w-4 h-4 animate-spin text-[#00DADC]" />
                            <span className="tracking-widest text-[#00DADC]">Registering Cafe Outlet...</span>
                          </>
                        ) : (
                          <>
                            <span>Register Cafe & Open Roster</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Back to Sign In Link */}
                <div className="pt-4 border-t border-stone-200/80 text-center">
                  <p className="text-xs text-stone-500 mb-1">
                    Already have an account on Calcutta Cafe Club?
                  </p>
                  <button
                    type="button"
                    onClick={goToLogin}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF0046] hover:underline font-headline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sign In to Your Existing Account</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 3. PLATFORM FEATURES & VALUE PILLARS (SHARED FOOTPRINT) */}
        <div className="border-t border-stone-200 pt-10 sm:pt-14 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-headline font-bold text-[#0A011C] tracking-tight uppercase">
              How Calcutta Cafe Club Works
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Designed specifically for Kolkata's growing cafe culture and college students seeking respectable, fair hourly work.
            </p>
          </div>

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-[#FF0046] shadow-xs transition-colors space-y-2.5">
              <div className="w-9 h-9 rounded-[3px] bg-rose-50 text-[#FF0046] flex items-center justify-center border border-rose-200 text-sm font-bold font-headline font-mono">
                ₹
              </div>
              <h4 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Guaranteed Min ₹100/Hour
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Fair student wage floor. Cafe owners can offer higher rush-hour rates (₹120, ₹140, ₹160+).
              </p>
            </div>

            <div className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-[#00DADC] shadow-xs transition-colors space-y-2.5">
              <div className="w-9 h-9 rounded-[3px] bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-200 text-sm">
                <Clock className="w-4 h-4 text-cyan-700" />
              </div>
              <h4 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Flexible 3+ Hour Shifts
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Standardized shifts that fit comfortably around college lectures, exams, and weekends.
              </p>
            </div>

            <div className="bg-white rounded-[3px] p-5 border border-stone-200 hover:border-[#FE9900] shadow-xs transition-colors space-y-2.5">
              <div className="w-9 h-9 rounded-[3px] bg-amber-50 text-[#FE9900] flex items-center justify-center border border-amber-200 text-sm">
                <Zap className="w-4 h-4 text-[#FE9900]" />
              </div>
              <h4 className="text-base font-bold font-headline text-[#0A011C] uppercase tracking-tight">
                Instant Real-Time Shift Lock
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Shifts lock the instant a student applies. Real-time Firebase sync notifies both parties right away.
              </p>
            </div>

          </div>

          {/* Verified Locations Bar */}
          <div className="bg-white rounded-[3px] p-4 border border-stone-200 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 shadow-2xs">
            <span className="font-bold text-[#0A011C] uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <MapPin className="w-3.5 h-3.5 text-[#FF0046]" />
              <span>Active Kolkata Hubs:</span>
            </span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Park Street</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Southern Ave</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Salt Lake Sec 5</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Hindustan Park</span>
            <span className="text-stone-300">·</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-[3px] text-stone-900 border border-stone-200 font-medium">Ballygunge</span>
          </div>

        </div>

      </main>

      {/* 4. MINIMAL FOOTER */}
      <footer className="border-t border-stone-200 bg-white px-6 py-4 text-center text-xs text-stone-500">
        Calcutta Cafe Club · Kolkata's Student Cafe Work Platform · Minimum ₹100/hr Fair Wage Guaranteed
      </footer>
    </div>
  );
}
