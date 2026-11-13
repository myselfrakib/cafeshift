import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_CAFES, INITIAL_SHIFTS } from '../data/seedData';
import {
  auth,
  db,
  rtdb,
  storage
} from '../firebase';
import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import {
  ref as rtdbRef,
  onValue as rtdbOnValue,
  set as rtdbSet,
  update as rtdbUpdate
} from 'firebase/database';
import {
  registerFirebaseUser,
  loginFirebaseUser,
  uploadImageToStorage,
  saveCafeToFirebase,
  publishShiftToFirebase,
  bookShiftInFirebase,
  cancelShiftInFirebase
} from '../services/firebaseService';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const STORAGE_KEYS = {
  USERS: 'calcutta_cafe_users_v2',
  CAFES: 'calcutta_cafe_cafes_v2',
  SHIFTS: 'calcutta_cafe_shifts_v2',
  CURRENT_USER_ID: 'calcutta_cafe_current_user_v2',
};

export const AppProvider = ({ children }) => {
  // Local cache initialization
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [cafes, setCafes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAFES);
      return saved ? JSON.parse(saved) : INITIAL_CAFES;
    } catch {
      return INITIAL_CAFES;
    }
  });

  const [shifts, setShifts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
      return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
    } catch {
      return INITIAL_SHIFTS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || 'user-rakib';
    } catch {
      return 'user-rakib';
    }
  });

  // Firebase connection status
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-cafe' | 'my-applications' | 'profile'
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('signup-owner');
  const [createShiftModalOpen, setCreateShiftModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));
    } catch (e) {
      console.error(e);
    }
  }, [cafes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    } catch (e) {
      console.error(e);
    }
  }, [shifts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  // REALTIME FIREBASE SUBSCRIPTION FOR SHIFTS
  useEffect(() => {
    let unsubscribeFirestore = null;

    try {
      // 1. Listen to Firestore shifts collection
      const shiftsCol = collection(db, 'shifts');
      unsubscribeFirestore = onSnapshot(shiftsCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteShifts = [];
          snapshot.forEach((docSnap) => {
            remoteShifts.push({ id: docSnap.id, ...docSnap.data() });
          });
          if (remoteShifts.length > 0) {
            setShifts(prev => {
              const mergedMap = new Map();
              prev.forEach(s => mergedMap.set(s.id, s));
              remoteShifts.forEach(s => mergedMap.set(s.id, s));
              return Array.from(mergedMap.values());
            });
            setFirebaseConnected(true);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot listener notice (rules or offline):', error.message);
        subscribeToRTDB();
      });
    } catch (err) {
      console.warn('Error setting up Firestore listener, trying RTDB:', err);
      subscribeToRTDB();
    }

    function subscribeToRTDB() {
      try {
        const shiftsRef = rtdbRef(rtdb, 'shifts');
        rtdbOnValue(shiftsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const remoteShifts = Object.keys(data).map(k => ({ id: k, ...data[k] }));
            if (remoteShifts.length > 0) {
              setShifts(prev => {
                const mergedMap = new Map();
                prev.forEach(s => mergedMap.set(s.id, s));
                remoteShifts.forEach(s => mergedMap.set(s.id, s));
                return Array.from(mergedMap.values());
              });
              setFirebaseConnected(true);
            }
          }
        }, (err) => {
          console.warn('RTDB listener notice:', err.message);
        });
      } catch (e) {
        console.warn('RTDB setup notice:', e);
      }
    }

    // 2. Firebase Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setFirebaseConnected(true);
        setUsers(prev => {
          const exists = prev.find(u => u.id === user.uid || u.email === user.email);
          if (!exists) {
            const newUser = {
              id: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              phone: '9830123456',
              role: 'attendant',
              mascot: '🐱'
            };
            return [newUser, ...prev];
          }
          return prev;
        });
      }
    });

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const isOwner = currentUser?.role === 'owner';
  const isAttendant = currentUser?.role === 'attendant';

  const ownerCafes = cafes.filter(c => c.ownerId === currentUser?.id);
  const activeCafe = cafes.find(c => c.id === (selectedCafeId || ownerCafes[0]?.id)) || ownerCafes[0] || cafes[0];

  const showToast = (message, type = 'info', emoji = '🐾') => {
    setToast({ id: Date.now(), message, type, emoji });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9DCC4', '#FEC89A', '#B7804C']
      });
    } catch (e) {}
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      if (user.role === 'owner') {
        const userCafes = cafes.filter(c => c.ownerId === user.id);
        if (userCafes.length > 0) {
          setSelectedCafeId(userCafes[0].id);
        }
      }
      showToast(`Switched to ${user.name} (${user.role === 'owner' ? 'Cafe Owner ☕' : 'Student Attendant 🎒'})`, 'success', user.mascot || '🐾');
    }
  };

  // Sign up Owner with Firebase Auth & Storage photo support
  const signupOwner = async ({
    name,
    email,
    password = 'Password@123',
    phone,
    cafeName,
    cafeArea,
    cafeAddress,
    cafeMascot = '🐱',
    cafePhotoUrl = '',
    cafeDescription = '',
    minHourlyWage = 100
  }) => {
    setIsSyncing(true);
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '');
    let uid = 'owner-' + Date.now();
    const newCafeId = 'cafe-' + Date.now();

    try {
      const res = await registerFirebaseUser({
        email,
        password,
        role: 'owner',
        profileData: {
          name,
          phone: cleanPhone,
          mascot: cafeMascot,
          cafeId: newCafeId
        }
      });
      if (res?.user?.uid) {
        uid = res.user.uid;
      }
      setFirebaseConnected(true);
    } catch (err) {
      console.warn('Firebase Auth notice (using seamless fallback):', err.message);
    }

    const newCafe = {
      id: newCafeId,
      ownerId: uid,
      name: cafeName || "My Cute Cafe",
      tagline: 'Cozy Sips & Calcutta Smiles ☕',
      area: cafeArea || 'Park Street',
      address: cafeAddress || `${cafeArea}, Kolkata`,
      mascot: cafeMascot,
      photoUrl: cafePhotoUrl || '',
      coverGradient: 'from-amber-400 via-orange-300 to-rose-300',
      minHourlyWage: Math.max(100, Number(minHourlyWage) || 100),
      description: cafeDescription || 'A welcoming cafe offering flexible part-time shifts for energetic students!',
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    };

    const newUser = {
      id: uid,
      role: 'owner',
      name,
      email,
      phone: cleanPhone,
      mascot: cafeMascot,
      bio: `Owner of ${cafeName} in ${cafeArea}. Supporting student education with flexible hourly jobs!`,
      cafes: [newCafeId]
    };

    saveCafeToFirebase(newCafe).catch(() => {});

    setUsers(prev => [newUser, ...prev]);
    setCafes(prev => [newCafe, ...prev]);
    setCurrentUserId(uid);
    setSelectedCafeId(newCafeId);
    setActiveTab('my-cafe');
    setAuthModalOpen(false);
    setIsSyncing(false);

    triggerConfetti();
    showToast(`Welcome ${name}! "${cafeName}" registered in Firebase! 🎉`, 'success', '☕');
    return uid;
  };

  // Sign up Student Attendant with Firebase Auth & Storage photo support
  const signupAttendant = async ({
    name,
    email,
    password = 'Password@123',
    phone,
    gender,
    age,
    address,
    college,
    mascot = '🐼',
    photoUrl = '',
    bio = ''
  }) => {
    setIsSyncing(true);
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '');
    let uid = 'attendant-' + Date.now();

    try {
      const res = await registerFirebaseUser({
        email,
        password,
        role: 'attendant',
        profileData: {
          name,
          phone: cleanPhone,
          gender,
          age: Number(age) || 19,
          address,
          college,
          mascot,
          photoUrl
        }
      });
      if (res?.user?.uid) {
        uid = res.user.uid;
      }
      setFirebaseConnected(true);
    } catch (err) {
      console.warn('Firebase Auth notice (using seamless fallback):', err.message);
    }

    const newUser = {
      id: uid,
      role: 'attendant',
      name,
      email,
      phone: cleanPhone,
      gender: gender || 'Not specified',
      age: Number(age) || 19,
      address: address || 'Kolkata, West Bengal',
      college: college || 'College / School Student in Kolkata',
      mascot: mascot,
      photoUrl: photoUrl || '',
      bio: bio || 'Excited to work flexible shifts at Calcutta cafes, learn barista skills & earn hourly pocket money!'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(uid);
    setActiveTab('browse');
    setAuthModalOpen(false);
    setIsSyncing(false);

    triggerConfetti();
    showToast(`Welcome aboard, ${name}! Your student profile is live in Firebase! 🎒✨`, 'success', mascot);
    return uid;
  };

  // Login with Firebase Auth
  const loginUser = async (email, password = 'Password@123') => {
    setIsSyncing(true);
    try {
      const { user, profile } = await loginFirebaseUser(email, password);
      if (user) {
        setFirebaseUser(user);
        setFirebaseConnected(true);
        const existing = users.find(u => u.id === user.uid || u.email === user.email);
        if (existing) {
          setCurrentUserId(existing.id);
        } else if (profile) {
          const newUser = { id: user.uid, ...profile };
          setUsers(prev => [newUser, ...prev]);
          setCurrentUserId(user.uid);
        }
        setAuthModalOpen(false);
        showToast(`Welcome back, ${user.displayName || email}! 🐾`, 'success', '🔑');
      }
    } catch (error) {
      const demoUser = users.find(u => u.email === email);
      if (demoUser) {
        switchUser(demoUser.id);
        setAuthModalOpen(false);
        showToast(`Logged into demo profile: ${demoUser.name}`, 'info', demoUser.mascot || '🐾');
      } else {
        throw error;
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setFirebaseUser(null);
    showToast('Signed out of Firebase account', 'info', '👋');
  };

  // Create Shift Offer (Owner only, Min 3 hrs duration, Min ₹100/hr)
  const createShift = async ({
    cafeId,
    roleName,
    date,
    startTime,
    durationHours,
    hourlyWage,
    perks = [],
    dressCode = 'Comfortable casuals & sneakers (apron provided)',
    notes = ''
  }) => {
    const cafe = cafes.find(c => c.id === cafeId) || activeCafe;
    const finalWage = Math.max(100, Number(hourlyWage) || 100);
    const finalDuration = Math.max(3, Number(durationHours) || 3);

    const [hours, minutes] = startTime.split(':').map(Number);
    const endH = (hours + finalDuration) % 24;
    const endTime = `${String(endH).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const newShift = {
      id: 'shift-' + Date.now(),
      cafeId: cafe.id,
      ownerId: currentUser.id,
      cafeName: cafe.name,
      cafeArea: cafe.area,
      cafeMascot: cafe.mascot || '☕',
      cafePhotoUrl: cafe.photoUrl || '',
      roleName: roleName || 'Cafe Floor & Table Attendant 🐾',
      date,
      startTime,
      endTime,
      durationHours: finalDuration,
      hourlyWage: finalWage,
      totalEarnings: finalWage * finalDuration,
      perks: perks.length > 0 ? perks : ['Free Cafe Drink ☕', 'Warm Meal / Snack 🥪', 'Student Tip Share 💸'],
      dressCode,
      notes: notes || 'Punctual, friendly, and excited to help during rush hours!',
      status: 'open',
      applicant: null,
      appliedAt: null,
      createdAt: new Date().toISOString()
    };

    publishShiftToFirebase(newShift).catch(() => {});

    setShifts(prev => [newShift, ...prev]);
    setCreateShiftModalOpen(false);
    triggerConfetti();
    showToast(`Shift for "${cafe.name}" published to Firebase! (₹${finalWage}/hr · ₹${finalWage * finalDuration} total)`, 'success', '✨');
  };

  // Apply For Shift (Real-time Firebase Booking)
  const applyForShift = async (shiftId) => {
    if (!isAttendant) {
      const student = users.find(u => u.role === 'attendant');
      if (student) {
        switchUser(student.id);
        showToast(`Switched to student profile "${student.name}" to apply!`, 'info', '🎒');
      } else {
        setAuthInitialMode('signup-attendant');
        setAuthModalOpen(true);
        showToast('Please sign up or switch to a Student Attendant account to apply!', 'info', '🐾');
        return;
      }
    }

    const studentUser = users.find(u => u.id === currentUserId) || users.find(u => u.role === 'attendant');

    const applicantInfo = {
      userId: studentUser.id,
      name: studentUser.name,
      phone: studentUser.phone,
      email: studentUser.email,
      college: studentUser.college || 'Kolkata Student',
      age: studentUser.age || 19,
      gender: studentUser.gender || 'Not specified',
      address: studentUser.address || 'Kolkata',
      mascot: studentUser.mascot || '🐼',
      photoUrl: studentUser.photoUrl || ''
    };

    bookShiftInFirebase(shiftId, applicantInfo).catch(() => {});

    setShifts(prev => prev.map(shift => {
      if (shift.id === shiftId) {
        return {
          ...shift,
          status: 'booked',
          applicant: applicantInfo,
          appliedAt: new Date().toISOString()
        };
      }
      return shift;
    }));

    triggerConfetti();
    showToast(`Yay! Shift booked & removed from public feed. ${studentUser.name}'s contact (+91 ${applicantInfo.phone}) sent to cafe owner! 🎉`, 'success', '🐾');
  };

  // Cancel shift application
  const cancelShiftApplication = async (shiftId) => {
    cancelShiftInFirebase(shiftId).catch(() => {});

    setShifts(prev => prev.map(shift => {
      if (shift.id === shiftId) {
        return {
          ...shift,
          status: 'open',
          applicant: null,
          appliedAt: null
        };
      }
      return shift;
    }));
    showToast('Shift reservation cancelled. It is back in public listings.', 'info', '↩️');
  };

  // Add owner cafe
  const addOwnerCafe = async ({ name, area, address, mascot, description, minHourlyWage, photoUrl }) => {
    const newCafeId = 'cafe-' + Date.now();
    const newCafe = {
      id: newCafeId,
      ownerId: currentUser.id,
      name,
      tagline: 'Cozy Spot in Calcutta ☕',
      area,
      address,
      mascot: mascot || '🐱',
      photoUrl: photoUrl || '',
      coverGradient: 'from-amber-300 via-orange-200 to-rose-200',
      minHourlyWage: Math.max(100, Number(minHourlyWage) || 100),
      description: description || 'Proudly serving Calcutta coffee and hiring students.',
      rating: 5.0,
      reviewsCount: 0
    };

    saveCafeToFirebase(newCafe).catch(() => {});

    setCafes(prev => [...prev, newCafe]);
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, cafes: [...(u.cafes || []), newCafeId] };
      }
      return u;
    }));
    setSelectedCafeId(newCafeId);
    showToast(`Added "${name}" to your cafes!`, 'success', mascot || '☕');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        cafes,
        shifts,
        currentUser,
        isOwner,
        isAttendant,
        activeTab,
        setActiveTab,
        selectedCafeId,
        setSelectedCafeId,
        activeCafe,
        ownerCafes,
        authModalOpen,
        setAuthModalOpen,
        authInitialMode,
        setAuthInitialMode,
        createShiftModalOpen,
        setCreateShiftModalOpen,
        toast,
        showToast,
        triggerConfetti,
        switchUser,
        signupOwner,
        signupAttendant,
        loginUser,
        handleLogout,
        createShift,
        applyForShift,
        cancelShiftApplication,
        addOwnerCafe,
        uploadImage: uploadImageToStorage,
        firebaseConnected,
        firebaseUser,
        isSyncing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
