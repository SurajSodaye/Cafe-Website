import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Lock, Mail, Coffee, ArrowLeft, KeyRound } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const { login, sendPasswordReset } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      await login(email, password);
      showToast("Signed in successfully!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ auth: err.message });
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError("Please enter a valid email address.");
      return;
    }

    try {
      setIsResetting(true);
      setResetError("");
      await sendPasswordReset(resetEmail);
      showToast("Password reset link has been sent to your email.", "success");
      setIsResetOpen(false);
      setResetEmail("");
    } catch (err) {
      setResetError(err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-espresso text-cream flex items-center justify-center shadow-warm">
            <Coffee className="w-7 h-7 text-terracotta" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-espresso tracking-tight">
            Brew & Bloom Café
          </h1>
          <p className="text-sm font-sans font-medium text-espresso/60">
            Admin Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xs p-6 sm:p-8 rounded-2xl shadow-warm border border-espresso/10 space-y-6">
          {errors.auth && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errors.auth}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="admin@brewandbloom.com"
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="••••••••"
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
                required
              />

              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetError("");
                    setIsResetOpen(true);
                  }}
                  className="text-xs font-semibold text-terracotta hover:text-terracotta-dark transition-colors focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In to Dashboard
            </Button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="http://localhost:5173"
            className="text-xs font-medium text-espresso/60 hover:text-espresso transition-colors"
          >
            ← Return to Public Cafe Website
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title="Reset Admin Password"
        subtitle="Enter your admin account email to receive a secure password reset link."
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <Input
            label="Admin Email Address"
            type="email"
            value={resetEmail}
            onChange={(e) => {
              setResetEmail(e.target.value);
              setResetError("");
            }}
            placeholder="admin@brewandbloom.com"
            error={resetError}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="pt-3 border-t border-espresso/10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetOpen(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isResetting}
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
