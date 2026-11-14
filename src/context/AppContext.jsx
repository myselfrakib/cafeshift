import React, { createContext, useContext, useState, useEffect } from 'react';
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
  cancelShiftInFirebase,
  saveUserToFirebase,
  deleteShiftFromFirebase
} from '../services/firebaseService';
import confetti from 'canvas-confetti';
import { formatDateDDMMYYYY, formatTime12Hour, calculateEndTime12Hour } from '../utils/dateTime';

const AppContext = createContext();

const STORAGE_KEYS = {
  USERS: 'calcutta_cafe_prod_users',
  CAFES: 'calcutta_cafe_prod_cafes',
  SHIFTS: 'calcutta_cafe_prod_shifts',
  CURRENT_USER_ID: 'calcutta_cafe_prod_current_user',
};

// Clear legacy demo keys from prior prototyping
try {
  ['calcutta_cafe_users_v3', 'calcutta_cafe_cafes_v3', 'calcutta_cafe_shifts_v3', 'calcutta_cafe_current_user_v3', 'calcutta_cafe_users_v2', 'calcutta_cafe_cafes_v2', 'calcutta_cafe_shifts_v2'].forEach(k => {
    localStorage.removeItem(k);
  });
} catch (e) {}

export const sanitizePhotoUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  // Expired session blob URLs cause net::ERR_FILE_NOT_FOUND
  if (url.startsWith('blob:')) return '';
  return url;
};

export const getShiftTimestamp = (s) => {
  if (!s) return 0;
  if (s.createdAt) {
    const t = new Date(s.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (s.id && typeof s.id === 'string' && s.id.startsWith('shift-')) {
    const t = parseInt(s.id.replace('shift-', ''));
    if (!isNaN(t)) return t;
  }
  return 0;
};

export const sortShiftsDescending = (shiftList) => {
  if (!Array.isArray(shiftList)) return [];
  return [...shiftList].sort((a, b) => getShiftTimestamp(b) - getShiftTimestamp(a));
};

export const AppProvider = ({ children }) => {
  // Initialize data (Production: empty defaults)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(u => ({ ...u, photoUrl: sanitizePhotoUrl(u.photoUrl) })) : [];
    } catch {
      return [];
    }
  });

  const [cafes, setCafes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAFES);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(c => ({ ...c, photoUrl: sanitizePhotoUrl(c.photoUrl) })) : [];
    } catch {
      return [];
    }
  });

  const [shifts, setShifts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? sortShiftsDescending(parsed.map(s => ({ ...s, cafePhotoUrl: sanitizePhotoUrl(s.cafePhotoUrl) }))) : [];
    } catch {
      return [];
    }
  });

  // WITHOUT AUTH: Defaults to null so user MUST log in or sign up first!
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || null;
    } catch {
      return null;
    }
  });

  // Firebase connection status
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const savedCurrentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (savedUsers && savedCurrentUserId) {
        const uList = JSON.parse(savedUsers);
        const u = uList.find(x => x.id === savedCurrentUserId);
        if (u?.role === 'owner') return 'my-cafe';
      }
    } catch {}
    return 'browse';
  });
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [createShiftModalOpen, setCreateShiftModalOpen] = useState(false);
  const [isEditingCafe, setIsEditingCafe] = useState(false);
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
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  // REALTIME FIREBASE SUBSCRIPTION FOR SHIFTS & CAFES
  useEffect(() => {
    let unsubscribeFirestore = null;
    let unsubscribeCafes = null;

    try {
      const shiftsCol = collection(db, 'shifts');
      unsubscribeFirestore = onSnapshot(shiftsCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteShifts = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteShifts.push({
              id: docSnap.id,
              ...data,
              cafePhotoUrl: sanitizePhotoUrl(data.cafePhotoUrl)
            });
          });
          if (remoteShifts.length > 0) {
            setShifts(prev => {
              const map = new Map();
              remoteShifts.forEach(s => map.set(s.id, s));
              const now = Date.now();
              // Retain local shifts only if created very recently (<10s) and not yet committed to remote
              prev.forEach(s => {
                if (!map.has(s.id)) {
                  const shiftTime = parseInt(s.id.replace('shift-', '')) || 0;
                  if (now - shiftTime < 10000) {
                    map.set(s.id, s);
                  }
                }
              });
              return sortShiftsDescending(Array.from(map.values()));
            });
            setFirebaseConnected(true);
          } else {
            setShifts([]);
          }
        }
      }, (error) => {
        console.warn('Firestore onSnapshot notice:', error.message);
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
          unsubscribeFirestore = null;
        }
        subscribeToRTDB();
      });

      // Cafes subscription
      const cafesCol = collection(db, 'cafes');
      unsubscribeCafes = onSnapshot(cafesCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteCafes = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteCafes.push({
              id: docSnap.id,
              ...data,
              photoUrl: sanitizePhotoUrl(data.photoUrl)
            });
          });
          if (remoteCafes.length > 0) {
            setCafes(prev => {
              const mergedMap = new Map();
              prev.forEach(c => mergedMap.set(c.id, c));
              remoteCafes.forEach(c => mergedMap.set(c.id, c));
              return Array.from(mergedMap.values());
            });
          }
        }
      }, (error) => {
        console.warn('Firestore cafes notice:', error.message);
        if (unsubscribeCafes) {
          unsubscribeCafes();
          unsubscribeCafes = null;
        }
      });
    } catch (err) {
      console.warn('Firestore setup notice:', err);
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
                const map = new Map();
                remoteShifts.forEach(s => map.set(s.id, s));
                const now = Date.now();
                prev.forEach(s => {
                  if (!map.has(s.id)) {
                    const shiftTime = parseInt(s.id.replace('shift-', '')) || 0;
                    if (now - shiftTime < 10000) {
                      map.set(s.id, s);
                    }
                  }
                });
                return sortShiftsDescending(Array.from(map.values()));
              });
              setFirebaseConnected(true);
            } else {
              setShifts([]);
            }
          }
        }, (err) => {
          console.warn('RTDB listener notice:', err.message);
        });
      } catch (e) {
        console.warn('RTDB setup notice:', e);
      }
    }

    // Firebase Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Probe token validation to catch blocked API restrictions
          await user.getIdToken();
          setFirebaseUser(user);
          setFirebaseConnected(true);
        } catch (tokenErr) {
          if (
            tokenErr?.message?.includes('securetoken') ||
            tokenErr?.message?.includes('blocked') ||
            tokenErr?.code === 'auth/internal-error'
          ) {
            console.warn('Firebase Auth token blocked by Google Cloud API key restrictions. Signing out stale session to stop retry loop.');
            await signOut(auth).catch(() => {});
            setFirebaseUser(null);
            return;
          }
        }
        setFirebaseUser(user);
        setFirebaseConnected(true);
        setUsers(prev => {
          const exists = prev.find(u => u.id === user.uid || u.email === user.email);
          if (!exists) {
            const newUser = {
              id: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              phone: user.phoneNumber ? user.phoneNumber.replace(/^\+91/, '') : '',
              photoUrl: user.photoURL || '',
              role: 'attendant'
            };
            return [newUser, ...prev];
          }
          return prev;
        });
      } else {
        setFirebaseUser(null);
      }
    });

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (unsubscribeCafes) unsubscribeCafes();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Current active user (strictly null if not authenticated)
  const currentUser = currentUserId ? users.find(u => u.id === currentUserId) || null : null;
  const isOwner = currentUser?.role === 'owner';
  const isAttendant = Boolean(currentUser) && (currentUser.role === 'attendant' || currentUser.role === 'student' || !isOwner);

  const ownerCafes = isOwner ? cafes.filter(c => c.ownerId === currentUser?.id) : [];
  const activeCafe = ownerCafes.find(c => c.id === selectedCafeId) || ownerCafes[0] || null;

  // Ensure owner is never routed to browse shifts
  useEffect(() => {
    if (isOwner && activeTab === 'browse') {
      setActiveTab('my-cafe');
    }
  }, [isOwner, activeTab]);

  const showToast = (message, type = 'info', emoji = '✨') => {
    setToast({ id: Date.now(), message, type, emoji });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D97706', '#92400E', '#F59E0B', '#10B981', '#78350F']
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
        setActiveTab('my-cafe');
      } else {
        setActiveTab('browse');
      }
      showToast(`Logged in as ${user.name} (${user.role === 'owner' ? 'Cafe Owner' : 'Student Attendant'})`, 'success', user.role === 'owner' ? '☕' : '👋');
    }
  };

  // Sign up Owner
  const signupOwner = async ({
    name,
    email,
    password = 'Password@123',
    phone,
    cafeName,
    cafeArea,
    cafeAddress,
    photoUrl = '',
    cafePhotoUrl = '',
    cafeDescription = '',
    minHourlyWage = 100
  }) => {
    setIsSyncing(true);
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '');
    let uid = 'owner-' + Date.now();
    const newCafeId = 'cafe-' + Date.now();
    const finalPhoto = photoUrl || cafePhotoUrl || '';

    try {
      const res = await registerFirebaseUser({
        email,
        password,
        role: 'owner',
        profileData: {
          name,
          phone: cleanPhone,
          photoUrl: finalPhoto,
          cafeId: newCafeId
        }
      });
      if (res?.user?.uid) {
        uid = res.user.uid;
      }
      setFirebaseConnected(true);
    } catch (err) {
      console.warn('Firebase Auth fallback:', err.message);
    }

    const newCafe = {
      id: newCafeId,
      ownerId: uid,
      name: cafeName || "My Cafe",
      tagline: 'Specialty Coffee & Student Shifts ☕',
      area: cafeArea || 'Park Street',
      address: cafeAddress || `${cafeArea}, Kolkata`,
      photoUrl: finalPhoto,
      coverGradient: 'from-stone-900 to-amber-950',
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
      photoUrl: finalPhoto,
      bio: `Owner of ${cafeName} in ${cafeArea}. Supporting student education with flexible hourly jobs!`,
      cafes: [newCafeId]
    };

    saveCafeToFirebase(newCafe).catch(() => {});

    setUsers(prev => [newUser, ...prev]);
    setCafes(prev => [newCafe, ...prev]);
    setCurrentUserId(uid);
    setSelectedCafeId(newCafeId);
    setActiveTab('my-cafe');
    setIsSyncing(false);

    triggerConfetti();
    showToast(`Welcome ${name}! "${cafeName}" is live on Calcutta Cafe Club.`, 'success', '☕');
    return uid;
  };

  // Sign up Student Attendant
  const signupAttendant = async ({
    name,
    email,
    password = 'Password@123',
    phone,
    gender,
    age,
    address,
    college,
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
          photoUrl
        }
      });
      if (res?.user?.uid) {
        uid = res.user.uid;
      }
      setFirebaseConnected(true);
    } catch (err) {
      console.warn('Firebase Auth fallback:', err.message);
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
      college: college || 'College Student in Kolkata',
      photoUrl: photoUrl || '',
      bio: bio || 'Ready for flexible shifts at Kolkata cafes.'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(uid);
    setActiveTab('browse');
    setIsSyncing(false);

    triggerConfetti();
    showToast(`Welcome ${name}! Your student profile is active.`, 'success', '👋');
    return uid;
  };

  // Login
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
          setActiveTab(existing.role === 'owner' ? 'my-cafe' : 'browse');
        } else if (profile) {
          const newUser = { id: user.uid, ...profile };
          setUsers(prev => [newUser, ...prev]);
          setCurrentUserId(user.uid);
          setActiveTab(newUser.role === 'owner' ? 'my-cafe' : 'browse');
        } else {
          setCurrentUserId(user.uid);
          setActiveTab('browse');
        }
        showToast(`Signed in successfully as ${user.displayName || email}`, 'success', '👋');
        return;
      }
    } catch (error) {
      // Check local registered users if offline / local session
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        switchUser(matchedUser.id);
        return;
      }
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Sign out / Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setFirebaseUser(null);
    setCurrentUserId(null);
    setSelectedCafeId(null);
    setActiveTab('browse');
    showToast('Signed out of your account', 'info', '👋');
  };

  const isCreatingShiftRef = React.useRef(false);

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
    if (isCreatingShiftRef.current) {
      console.warn('Shift creation already in progress, ignoring duplicate call');
      return;
    }
    isCreatingShiftRef.current = true;
    setIsSyncing(true);

    try {
      const cafe = cafes.find(c => c.id === cafeId) || activeCafe;
      const finalWage = Math.max(100, Number(hourlyWage) || 100);
      const finalDuration = Math.max(3, Number(durationHours) || 3);

      const finalDate = formatDateDDMMYYYY(date);
      const finalStartTime = formatTime12Hour(startTime);
      const finalEndTime = calculateEndTime12Hour(startTime, finalDuration);

      const newShift = {
        id: 'shift-' + Date.now(),
        cafeId: cafe.id,
        ownerId: currentUser.id,
        cafeName: cafe.name,
        cafeArea: cafe.area,
        cafePhotoUrl: cafe.photoUrl || '',
        roleName: roleName || 'Cafe Floor & Table Attendant',
        date: finalDate,
        startTime: finalStartTime,
        endTime: finalEndTime,
        durationHours: finalDuration,
        hourlyWage: finalWage,
        totalEarnings: finalWage * finalDuration,
        perks: perks.length > 0 ? perks : ['Free Cafe Drink', 'Warm Snack', 'Student Tip Share'],
        dressCode,
        notes: notes || 'Punctual and friendly during rush hours.',
        status: 'open',
        applicant: null,
        appliedAt: null,
        createdAt: new Date().toISOString()
      };

      try {
        await publishShiftToFirebase(newShift);
      } catch (e) {
        console.warn('Firebase publish notice:', e);
      }

      setShifts(prev => {
        // Prevent duplicate insertion if onSnapshot already merged it
        if (prev.some(s => s.id === newShift.id)) return sortShiftsDescending(prev);
        return sortShiftsDescending([newShift, ...prev]);
      });

      setCreateShiftModalOpen(false);
      triggerConfetti();
      showToast(`New shift published at ₹${finalWage}/hr (Total ₹${finalWage * finalDuration})`, 'success', '✨');
    } finally {
      isCreatingShiftRef.current = false;
      setIsSyncing(false);
    }
  };

  // Apply For Shift
  const applyForShift = async (shiftId) => {
    if (!currentUser || !isAttendant) {
      showToast('Please sign in as a student attendant to apply!', 'info', '🎒');
      return;
    }

    const applicantInfo = {
      userId: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone,
      email: currentUser.email,
      college: currentUser.college || 'Kolkata Student',
      age: currentUser.age || 19,
      gender: currentUser.gender || 'Not specified',
      address: currentUser.address || 'Kolkata',
      photoUrl: currentUser.photoUrl || ''
    };

    try {
      await bookShiftInFirebase(shiftId, applicantInfo);
    } catch (e) {
      console.warn('Firebase booking notice:', e);
    }

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
    showToast(`Shift booked! Owner can now contact you on +91 ${applicantInfo.phone}.`, 'success', '🎉');
  };

  // Cancel shift application
  const cancelShiftApplication = async (shiftId) => {
    try {
      await cancelShiftInFirebase(shiftId);
    } catch (e) {
      console.warn('Firebase cancel notice:', e);
    }

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
    showToast('Shift booking cancelled. Re-opened for students.', 'info', '↩️');
  };

  // Delete shift offer (Owner action: permanently remove an open or booked shift)
  const deleteShift = async (shiftId) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));

    try {
      await deleteShiftFromFirebase(shiftId);
    } catch (e) {
      console.warn('Firebase delete notice:', e);
    }

    showToast('Shift removed successfully.', 'info', '🗑️');
  };

  // Add owner cafe
  const addOwnerCafe = async ({ name, area, address, description, minHourlyWage, photoUrl }) => {
    const newCafeId = 'cafe-' + Date.now();
    const newCafe = {
      id: newCafeId,
      ownerId: currentUser.id,
      name,
      tagline: 'Specialty Sips in Calcutta ☕',
      area,
      address,
      photoUrl: photoUrl || '',
      coverGradient: 'from-stone-900 to-amber-950',
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
    showToast(`Added "${name}" to your cafes!`, 'success', '☕');
  };

  // Update owner cafe details
  const updateOwnerCafe = async (cafeId, updatedFields) => {
    setCafes(prev => prev.map(c => {
      if (c.id === cafeId) {
        const updated = { ...c, ...updatedFields, updatedAt: new Date().toISOString() };
        saveCafeToFirebase(updated).catch(() => {});
        return updated;
      }
      return c;
    }));

    // Cascade cafe branding / photo updates to active shifts of this cafe
    if (updatedFields.photoUrl !== undefined || updatedFields.name !== undefined || updatedFields.area !== undefined) {
      setShifts(prev => prev.map(s => {
        if (s.cafeId === cafeId) {
          const updatedShift = {
            ...s,
            ...(updatedFields.photoUrl !== undefined ? { cafePhotoUrl: updatedFields.photoUrl } : {}),
            ...(updatedFields.name !== undefined ? { cafeName: updatedFields.name } : {}),
            ...(updatedFields.area !== undefined ? { cafeArea: updatedFields.area } : {})
          };
          publishShiftToFirebase(updatedShift).catch(() => {});
          return updatedShift;
        }
        return s;
      }));
    }

    showToast('Cafe details updated successfully.', 'success', '✓');
  };

  // Update student / user profile details
  const updateUserProfile = async (updatedFields) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));
    saveUserToFirebase(updatedUser).catch(() => {});
    showToast('Profile updated successfully!', 'success', '✨');
    return updatedUser;
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
        deleteShift,
        addOwnerCafe,
        updateOwnerCafe,
        updateUserProfile,
        uploadImage: uploadImageToStorage,
        isEditingCafe,
        setIsEditingCafe,
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
