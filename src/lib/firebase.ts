import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtp00h5REuTKAmZ7QUobYRBfJ-A2SEVs4",
  authDomain: "housessadda.firebaseapp.com",
  projectId: "housessadda",
  storageBucket: "housessadda.firebasestorage.app",
  messagingSenderId: "613217906782",
  appId: "1:613217906782:web:b72758b003e843a02144cf",
  measurementId: "G-58YFYGMQKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
