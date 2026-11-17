import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

/**
 * Maps Firebase Auth error codes to user-friendly messages
 */
export function mapAuthError(error) {
  if (!error) return 'An unexpected authentication error occurred.';
  
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password. Please check your credentials.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact the administrator.';
    case 'auth/missing-password':
      return 'Password is required.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export const authService = {
  /**
   * Log in with email and password, then verify admin privileges in Firestore
   */
  async login(email, password) {
    try {
      const cleanEmail = email ? email.trim() : '';
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = credential.user;

      // Verify that document admins/{uid} exists in Firestore
      const adminDocRef = doc(db, 'admins', user.uid);
      let adminSnap;
      try {
        adminSnap = await getDoc(adminDocRef);
      } catch (firestoreErr) {
        console.error('Error verifying admin document:', firestoreErr);
        await signOut(auth);
        throw new Error('This account does not have admin access.');
      }

      if (!adminSnap.exists()) {
        await signOut(auth);
        throw new Error('This account does not have admin access.');
      }

      const adminData = adminSnap.data() || {};
      return {
        uid: user.uid,
        email: user.email,
        displayName: adminData.name || user.displayName || 'Admin',
        role: adminData.role || 'Administrator',
        avatar: adminData.avatar || user.photoURL || null,
        ...adminData
      };
    } catch (err) {
      if (err.message === 'This account does not have admin access.') {
        throw err;
      }
      throw new Error(mapAuthError(err));
    }
  },

  /**
   * Log out active user
   */
  async logout() {
    return signOut(auth);
  },

  /**
   * Send password reset email
   */
  async sendPasswordReset(email) {
    try {
      const cleanEmail = email ? email.trim() : '';
      await sendPasswordResetEmail(auth, cleanEmail);
      return true;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  },

  /**
   * Subscribe to auth state changes and verify admin status on reload
   */
  subscribeToAuth(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      try {
        const adminDocRef = doc(db, 'admins', firebaseUser.uid);
        const adminSnap = await getDoc(adminDocRef);

        if (!adminSnap.exists()) {
          console.warn(`User ${firebaseUser.uid} signed in but has no admins doc. Signing out.`);
          await signOut(auth);
          callback(null);
          return;
        }

        const adminData = adminSnap.data() || {};
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: adminData.name || firebaseUser.displayName || 'Admin',
          role: adminData.role || 'Administrator',
          avatar: adminData.avatar || firebaseUser.photoURL || null,
          ...adminData
        });
      } catch (err) {
        console.error('Error checking admin status in onAuthStateChanged:', err);
        callback(null);
      }
    });
  }
};
