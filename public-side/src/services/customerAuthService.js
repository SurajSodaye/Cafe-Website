import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { customerProfileService } from './customerProfileService';

/**
 * Maps Firebase Auth error codes to user-friendly messages for customers
 */
export function mapCustomerAuthError(error) {
  if (!error) return 'An unexpected authentication error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password. Please verify your details.';
    case 'auth/user-not-found':
      return 'No customer account found with this email. Please register.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a few minutes or reset your password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error.message || 'Authentication error. Please try again.';
  }
}

export const customerAuthService = {
  /**
   * Log in with email and password
   */
  async login(email, password) {
    try {
      const cleanEmail = (email || '').trim();
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      return userCredential.user;
    } catch (err) {
      throw new Error(mapCustomerAuthError(err));
    }
  },

  /**
   * Register a new customer account
   */
  async register({ name, email, password, phone = '' }) {
    try {
      const cleanEmail = (email || '').trim();
      const cleanName = (name || '').trim();
      const cleanPhone = (phone || '').trim();
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      
      if (cleanName) {
        await updateProfile(userCredential.user, {
          displayName: cleanName
        });
      }

      // Persist customer profile data in Firestore
      try {
        await customerProfileService.saveCustomerProfile(userCredential.user.uid, {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone
        });
      } catch (profileErr) {
        console.warn('Initial profile creation warning:', profileErr);
      }

      return userCredential.user;
    } catch (err) {
      throw new Error(mapCustomerAuthError(err));
    }
  },

  /**
   * Log out active customer session
   */
  async logout() {
    return signOut(auth);
  },

  /**
   * Request password reset email
   */
  async resetPassword(email) {
    try {
      const cleanEmail = (email || '').trim();
      await sendPasswordResetEmail(auth, cleanEmail);
      return true;
    } catch (err) {
      throw new Error(mapCustomerAuthError(err));
    }
  },

  /**
   * Listen to active auth state changes
   */
  subscribeToAuth(callback) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  }
};
