import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'super-admin';
  name?: string;
}

// Sign in admin user
export const signInAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Check if user is admin in Firestore
  const adminDoc = await getDoc(doc(db, "admins", user.uid));
  
  if (!adminDoc.exists()) {
    await signOut(auth);
    throw new Error("You don't have admin access");
  }
  
  const adminData = adminDoc.data();
  return {
    uid: user.uid,
    email: user.email || email,
    role: adminData.role || 'admin',
    name: adminData.name
  };
};

// Sign out
export const signOutAdmin = async (): Promise<void> => {
  await signOut(auth);
};

// Password reset
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Auth state listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Check if current user is admin
export const checkAdminAccess = async (uid: string): Promise<AdminUser | null> => {
  try {
    const adminDoc = await getDoc(doc(db, "admins", uid));
    if (!adminDoc.exists()) return null;
    
    const adminData = adminDoc.data();
    const user = auth.currentUser;
    
    return {
      uid,
      email: user?.email || '',
      role: adminData.role || 'admin',
      name: adminData.name
    };
  } catch {
    return null;
  }
};
