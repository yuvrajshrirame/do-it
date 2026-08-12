import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7s8Cdd1a00UDfS-KdmowRDg6w7OZbNRo",
  authDomain: "habit-tracker-ffd0a.firebaseapp.com",
  projectId: "habit-tracker-ffd0a",
  storageBucket: "habit-tracker-ffd0a.firebasestorage.app",
  messagingSenderId: "13388020120",
  appId: "1:13388020120:web:eefe7d66dcf24e1a43d3ed",
  measurementId: "G-THY5Y1N00Z"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- CRITICAL: CENTRALIZED APP ID ---
export const appId = 'habit-tracker-master';
