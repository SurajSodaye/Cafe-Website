import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerAuthService } from '../services/customerAuthService';
import { customerProfileService } from '../services/customerProfileService';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Synchronize customer profile from Firestore whenever user changes
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async (uid) => {
      if (!uid) {
        if (isMounted) {
          setCustomerProfile(null);
          setProfileLoading(false);
        }
        return;
      }
      setProfileLoading(true);
      try {
        const profile = await customerProfileService.getCustomerProfile(uid);
        if (isMounted) {
          setCustomerProfile(profile);
        }
      } catch (err) {
        console.warn('Failed to load customer profile:', err);
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    const unsubscribe = customerAuthService.subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadProfile(currentUser.uid);
      } else {
        setCustomerProfile(null);
        setProfileLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const loggedInUser = await customerAuthService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async ({ name, email, password, phone }) => {
    setAuthLoading(true);
    try {
      const registeredUser = await customerAuthService.register({ name, email, password, phone });
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await customerAuthService.logout();
      setUser(null);
      setCustomerProfile(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email) => {
    return customerAuthService.resetPassword(email);
  };

  const updateCustomerProfile = async (data) => {
    if (!user) return;
    await customerProfileService.saveCustomerProfile(user.uid, data);
    setCustomerProfile((prev) => ({ ...(prev || {}), ...data }));
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: authLoading,
    authLoading,
    customerProfile,
    profileLoading,
    updateCustomerProfile,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
