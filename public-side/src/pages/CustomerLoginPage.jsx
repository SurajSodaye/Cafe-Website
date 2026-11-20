import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Coffee, Lock, Mail, User, Phone, ArrowLeft, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/layout/SEO';

export default function CustomerLoginPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, resetPassword, user } = useCustomerAuth();

  const redirectTarget = searchParams.get('redirect') || location.state?.from || '/menu';

  // Toggle between 'signin' and 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // If already logged in, redirect
  if (user) {
    navigate(redirectTarget, { replace: true });
    return null;
  }

  const validate = () => {
    const errs = {};
    if (authMode === 'signup' && !name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'signup' && phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
      if (cleanPhone.length < 10) {
        errs.phone = 'Please enter a valid 10-digit mobile number';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (authMode === 'signin') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone });
      }
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);

    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword(resetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } catch (err) {
      setResetError(err.message || 'Could not send reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <SEO
        title={authMode === 'signin' ? 'Sign In to Order' : 'Create Customer Account'}
        description="Sign in or register for your Brew & Bloom customer account to order online, choose takeaway or delivery, and enjoy specialty coffees."
      />

      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="w-full max-w-md space-y-6">
          {/* Brand header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-12 h-12 rounded-2xl bg-espresso-600 text-cream-100 flex items-center justify-center shadow-warm-sm group-hover:bg-terracotta-600 transition-colors">
                <Coffee className="w-6 h-6 text-cream-50" />
              </div>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-espresso-900 tracking-tight">
              Brew & Bloom Café
            </h1>
            <p className="text-sm text-espresso-600">
              {authMode === 'signin'
                ? 'Sign in to access your order tray and checkout'
                : 'Join our café community for online ordering'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/95 backdrop-blur-xs p-6 sm:p-8 rounded-3xl shadow-warm-md border border-espresso-100 space-y-5">
            {/* Tab switch */}
            <div className="grid grid-cols-2 p-1 bg-cream-100 rounded-2xl border border-espresso-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setFormError('');
                  setErrors({});
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-espresso-900 shadow-xs'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setFormError('');
                  setErrors({});
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-espresso-900 shadow-xs'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed animate-fade-in">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-1">
                    Full Name <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Deshmukh"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-300 bg-red-50/20 focus:ring-red-400'
                          : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-1">
                  Email Address <span className="text-terracotta-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 bg-red-50/20 focus:ring-red-400'
                        : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-1">
                    Mobile Phone (For Order Notifications)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-300 bg-red-50/20 focus:ring-red-400'
                          : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700">
                    Password <span className="text-terracotta-600">*</span>
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-300 bg-red-50/20 focus:ring-red-400'
                        : 'border-espresso-200 bg-cream-50/50 focus:bg-white focus:ring-terracotta-500'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full justify-center shadow-warm-sm"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : authMode === 'signin'
                    ? 'Sign In & Continue'
                    : 'Create Account & Continue'}
                </Button>
              </div>
            </form>
          </div>

          {/* Return link */}
          <div className="text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso-600 hover:text-espresso-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-espresso-950/60 backdrop-blur-xs"
            onClick={() => setShowForgotModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full z-10 shadow-warm-lg space-y-4">
            <h3 className="font-serif text-lg font-bold text-espresso-900">
              Reset Your Password
            </h3>
            <p className="text-xs text-espresso-600 leading-relaxed">
              Enter your email address and we will send you a link to reset your account password.
            </p>

            {resetSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset link sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                {resetError && (
                  <p className="text-xs text-red-600">{resetError}</p>
                )}
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-espresso-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-espresso-600 hover:bg-espresso-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isResetting}
                  >
                    {isResetting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
