import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Use environment variables when set (Vite: VITE_*). Fallback to defaults for existing deployments.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyCtp00h5REuTKAmZ7QUobYRBfJ-A2SEVs4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "housessadda.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "housessadda",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "housessadda.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "613217906782",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:613217906782:web:b72758b003e843a02144cf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-58YFYGMQKP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
