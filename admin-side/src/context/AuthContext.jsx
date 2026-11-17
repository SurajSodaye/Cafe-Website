import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = authService.subscribeToAuth((verifiedAdminUser) => {
      setUser(verifiedAdminUser);
      setAuthLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const loggedInAdmin = await authService.login(email, password);
      setUser(loggedInAdmin);
      return loggedInAdmin;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const sendPasswordReset = async (email) => {
    return authService.sendPasswordReset(email);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: authLoading,
    authLoading,
    login,
    logout,
    sendPasswordReset
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
