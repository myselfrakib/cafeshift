import {
  auth,
  db,
  rtdb,
  storage
} from '../firebase';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

import {
  ref as rtdbRef,
  set as rtdbSet,
  update as rtdbUpdate,
  remove as rtdbRemove,
  onValue as rtdbOnValue,
  get as rtdbGet
} from 'firebase/database';

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';


// Storage fallback keys
const STORAGE_PREFIX = 'calcutta_cafe_';

/**
 * Upload an image to Firebase Storage (for cafe photos or student ID/avatar)
 */
export async function uploadImageToStorage(file, pathFolder = 'uploads') {
  try {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fileRef = storageRef(storage, `${pathFolder}/${fileName}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.warn('Firebase Storage upload notice (using persistent data URL fallback):', error);
    // Convert to persistent base64 Data URL so it never expires with ERR_FILE_NOT_FOUND
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Register a new user in Firebase Auth and Firestore / Realtime Database
 */
export async function registerFirebaseUser({ email, password = 'Password@123', role, profileData }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: profileData.name || 'Calcutta Cafe Member'
    });

    const userDoc = {
      uid: user.uid,
      email: user.email,
      role: role, // 'owner' | 'attendant'
      ...profileData,
      createdAt: new Date().toISOString()
    };

    // Save in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), userDoc);
    } catch (e) {
      console.warn('Firestore setDoc failed, saving to RTDB:', e);
      await rtdbSet(rtdbRef(rtdb, `users/${user.uid}`), userDoc);
    }

    return { user, profile: userDoc };
  } catch (error) {
    console.error('Firebase registration error:', error);
    throw error;
  }
}

/**
 * Sign in existing user with Firebase Auth
 */
export async function loginFirebaseUser(email, password = 'Password@123') {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user profile from Firestore or RTDB
    let profile = null;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        profile = snap.data();
      }
    } catch (e) {
      console.warn('Firestore getDoc failed, trying RTDB:', e);
    }

    if (!profile) {
      try {
        const snap = await rtdbGet(rtdbRef(rtdb, `users/${user.uid}`));
        if (snap.exists()) {
          profile = snap.val();
        }
      } catch (e) {
        console.warn('RTDB get failed:', e);
      }
    }

    return { user, profile };
  } catch (error) {
    console.error('Firebase login error:', error);
    throw error;
  }
}

/**
 * Logout
 */
export async function logoutFirebaseUser() {
  await signOut(auth);
}

/**
 * Recursively strip undefined values and sanitize objects/arrays
 * so Firestore & RTDB never reject writes with:
 * "Unsupported field value: undefined"
 */
export function sanitizeForFirebase(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirebase(item));
  }
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      clean[key] = ''; // Convert undefined to safe empty string
    } else if (value !== null && typeof value === 'object') {
      clean[key] = sanitizeForFirebase(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Save new cafe to Firestore / RTDB
 */
export async function saveCafeToFirebase(cafeData) {
  const payload = sanitizeForFirebase(cafeData);
  try {
    await setDoc(doc(db, 'cafes', payload.id), payload);
  } catch (e) {
    console.warn('Firestore cafe save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `cafes/${payload.id}`), payload);
  }
}

/**
 * Publish shift offer to Firestore & RTDB
 */
export async function publishShiftToFirebase(shiftData) {
  const payload = sanitizeForFirebase(shiftData);
  try {
    await setDoc(doc(db, 'shifts', payload.id), payload);
  } catch (e) {
    console.warn('Firestore shift save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `shifts/${payload.id}`), payload);
  }
}

/**
 * Apply for shift in Firebase
 * Updates status to 'booked' and saves applicant info
 */
export async function bookShiftInFirebase(shiftId, applicantInfo) {
  const safeApplicant = sanitizeForFirebase({
    userId: applicantInfo?.userId || '',
    name: applicantInfo?.name || 'Student Attendant',
    phone: applicantInfo?.phone || '',
    email: applicantInfo?.email || '',
    college: applicantInfo?.college || 'Kolkata Student',
    age: Number(applicantInfo?.age) || 19,
    gender: applicantInfo?.gender || 'Not specified',
    address: applicantInfo?.address || 'Kolkata',
    photoUrl: applicantInfo?.photoUrl || '',
    ...(applicantInfo || {})
  });

  const updatePayload = sanitizeForFirebase({
    status: 'booked',
    applicant: safeApplicant,
    appliedAt: new Date().toISOString()
  });

  try {
    await updateDoc(doc(db, 'shifts', shiftId), updatePayload);
  } catch (e) {
    console.warn('Firestore shift update failed, trying RTDB:', e);
    await rtdbUpdate(rtdbRef(rtdb, `shifts/${shiftId}`), updatePayload);
  }
}

/**
 * Cancel shift booking in Firebase
 */
export async function cancelShiftInFirebase(shiftId) {
  const updatePayload = sanitizeForFirebase({
    status: 'open',
    applicant: null,
    appliedAt: null
  });

  try {
    await updateDoc(doc(db, 'shifts', shiftId), updatePayload);
  } catch (e) {
    console.warn('Firestore shift cancel failed, trying RTDB:', e);
    await rtdbUpdate(rtdbRef(rtdb, `shifts/${shiftId}`), updatePayload);
  }
}

/**
 * Save / Update user profile in Firestore & RTDB
 */
export async function saveUserToFirebase(userData) {
  const payload = sanitizeForFirebase(userData);
  const userId = payload?.id || payload?.uid;
  if (!userId) return;

  try {
    await setDoc(doc(db, 'users', userId), payload, { merge: true });
  } catch (e) {
    console.warn('Firestore user save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `users/${userId}`), payload);
  }
}

/**
 * Permanently delete a shift offer from Firestore & RTDB
 */
export async function deleteShiftFromFirebase(shiftId) {
  try {
    await deleteDoc(doc(db, 'shifts', shiftId));
  } catch (e) {
    console.warn('Firestore shift delete failed, trying RTDB:', e);
  }

  try {
    await rtdbRemove(rtdbRef(rtdb, `shifts/${shiftId}`));
  } catch (e) {
    console.warn('RTDB shift delete notice:', e);
  }
}

/**
 * Publish job opportunity to Firestore & RTDB
 */
export async function publishJobToFirebase(jobData) {
  const payload = sanitizeForFirebase(jobData);
  try {
    await setDoc(doc(db, 'jobs', payload.id), payload);
  } catch (e) {
    console.warn('Firestore job save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `jobs/${payload.id}`), payload);
  }
}

/**
 * Apply for a job in Firebase (appends applicant to applicants list)
 */
export async function applyJobInFirebase(jobId, applicantData) {
  const safeApplicant = sanitizeForFirebase({
    userId: applicantData?.userId || '',
    name: applicantData?.name || 'Student Attendant',
    phone: applicantData?.phone || '',
    email: applicantData?.email || '',
    college: applicantData?.college || 'Kolkata Student',
    age: Number(applicantData?.age) || 19,
    gender: applicantData?.gender || 'Not specified',
    address: applicantData?.address || 'Kolkata',
    photoUrl: applicantData?.photoUrl || '',
    note: applicantData?.note || '',
    appliedAt: new Date().toISOString(),
    ...(applicantData || {})
  });

  try {
    const jobRef = doc(db, 'jobs', jobId);
    const snap = await getDoc(jobRef);
    if (snap.exists()) {
      const existing = snap.data();
      const applicants = existing.applicants || [];
      const updatedApplicants = [safeApplicant, ...applicants.filter(a => a.userId !== safeApplicant.userId)];
      await updateDoc(jobRef, sanitizeForFirebase({
        applicants: updatedApplicants,
        applicantCount: updatedApplicants.length,
        updatedAt: new Date().toISOString()
      }));
    }
  } catch (e) {
    console.warn('Firestore job application update failed, trying RTDB:', e);
    try {
      const snap = await rtdbGet(rtdbRef(rtdb, `jobs/${jobId}`));
      if (snap.exists()) {
        const existing = snap.val();
        const applicants = existing.applicants || [];
        const updatedApplicants = [safeApplicant, ...applicants.filter(a => a.userId !== safeApplicant.userId)];
        await rtdbUpdate(rtdbRef(rtdb, `jobs/${jobId}`), sanitizeForFirebase({
          applicants: updatedApplicants,
          applicantCount: updatedApplicants.length,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (rtdbErr) {
      console.warn('RTDB job application notice:', rtdbErr);
    }
  }
}

/**
 * Permanently delete a job opening from Firestore & RTDB
 */
export async function deleteJobFromFirebase(jobId) {
  try {
    await deleteDoc(doc(db, 'jobs', jobId));
  } catch (e) {
    console.warn('Firestore job delete failed, trying RTDB:', e);
  }

  try {
    await rtdbRemove(rtdbRef(rtdb, `jobs/${jobId}`));
  } catch (e) {
    console.warn('RTDB job delete notice:', e);
  }
}



