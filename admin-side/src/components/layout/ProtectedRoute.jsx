import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
        <p className="text-sm font-medium text-espresso/70">
          Loading Admin Portal...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
        <p className="text-sm font-medium text-espresso/70">
          Verifying session...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
