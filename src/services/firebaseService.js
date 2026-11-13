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
    console.warn('Firebase Storage upload failed (or rules restricted). Using local blob preview URL:', error);
    // Return temporary object URL as seamless fallback so UI never fails
    return URL.createObjectURL(file);
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
 * Save new cafe to Firestore / RTDB
 */
export async function saveCafeToFirebase(cafeData) {
  try {
    await setDoc(doc(db, 'cafes', cafeData.id), cafeData);
  } catch (e) {
    console.warn('Firestore cafe save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `cafes/${cafeData.id}`), cafeData);
  }
}

/**
 * Publish shift offer to Firestore & RTDB
 */
export async function publishShiftToFirebase(shiftData) {
  try {
    await setDoc(doc(db, 'shifts', shiftData.id), shiftData);
  } catch (e) {
    console.warn('Firestore shift save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `shifts/${shiftData.id}`), shiftData);
  }
}

/**
 * Apply for shift in Firebase
 * Updates status to 'booked' and saves applicant info
 */
export async function bookShiftInFirebase(shiftId, applicantInfo) {
  const updatePayload = {
    status: 'booked',
    applicant: applicantInfo,
    appliedAt: new Date().toISOString()
  };

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
  const updatePayload = {
    status: 'open',
    applicant: null,
    appliedAt: null
  };

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
  const userId = userData.id || userData.uid;
  if (!userId) return;

  try {
    await setDoc(doc(db, 'users', userId), userData, { merge: true });
  } catch (e) {
    console.warn('Firestore user save failed, saving to RTDB:', e);
    await rtdbSet(rtdbRef(rtdb, `users/${userId}`), userData);
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



