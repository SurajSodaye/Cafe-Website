import React, { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export const TopBar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      showToast("Logged out successfully.", "info");
    } catch (err) {
      showToast("Logout failed.", "error");
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-espresso/10 bg-cream/90 backdrop-blur-md px-4 sm:px-8">
      {/* Left: Mobile Toggle & Status */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-espresso hover:bg-espresso/5 focus:outline-none focus:ring-2 focus:ring-terracotta"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sage/20 text-espresso border border-sage/30">
          <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
          Admin System Online
        </span>
      </div>

      {/* Right: User Profile & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName || "Admin"}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-terracotta/20"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-espresso text-cream flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-espresso leading-tight">
              {user?.displayName || "Admin User"}
            </span>
            <span className="block text-[11px] text-espresso/60">
              {user?.role || "Manager"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-espresso/70 hover:text-red-600 hover:bg-red-50 transition-colors border border-espresso/10 focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Sign out of Admin Dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of the Brew & Bloom admin dashboard?"
        confirmLabel="Sign Out"
        variant="warning"
        isLoading={loggingOut}
      />
    </header>
  );
};
