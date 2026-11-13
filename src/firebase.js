// Firebase configuration provided by user
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTB7d1-tjzU3DG0tvmkh1lWiZcmba10XI",
  authDomain: "hungrybites-c7930.firebaseapp.com",
  databaseURL: "https://hungrybites-c7930-default-rtdb.firebaseio.com",
  projectId: "hungrybites-c7930",
  storageBucket: "hungrybites-c7930.firebasestorage.app",
  messagingSenderId: "346758544945",
  appId: "1:346758544945:web:4bcad30016540d18e79f10",
  measurementId: "G-B5GP5SYMRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Prevent uncaught securetoken rejection loops in the browser
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event?.reason?.message?.includes("securetoken") ||
      event?.reason?.message?.includes("blocked")
    ) {
      console.warn("Silenced blocked securetoken token-refresh rejection.");
      event.preventDefault();
    }
  });
}

export default app;

