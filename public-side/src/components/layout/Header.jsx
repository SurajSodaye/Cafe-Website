import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Coffee, Menu as MenuIcon, X, MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSecretClicks } from '../../hooks/useSecretClicks';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll position for header shadow / backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const adminLoginUrl = import.meta.env.VITE_ADMIN_URL || '/admin/login';
  const handleLogoClick = useSecretClicks({
    clicks: 5,
    windowMs: 3000,
    onTrigger: () => {
      window.location.assign(adminLoginUrl);
    },
  });

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Skip to Content Link (WCAG AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-terracotta-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-400"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-cream-100/95 backdrop-blur-md shadow-warm-sm border-b border-espresso-100/80 py-3'
            : 'bg-cream-100 border-b border-espresso-100/50 py-4'
        }`}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-lg p-1 -ml-1"
              aria-label="Brew & Bloom Café Home"
            >
              <div className="w-10 h-10 rounded-xl bg-espresso-600 text-cream-100 flex items-center justify-center shadow-warm-sm group-hover:bg-terracotta-600 transition-colors">
                <Coffee className="w-5 h-5 text-cream-50" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-espresso-900 leading-tight">
                  Brew & Bloom
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-espresso-500 -mt-0.5">
                  Café · Pune
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                      isActive
                        ? 'text-terracotta-600 font-semibold bg-terracotta-50/80'
                        : 'text-espresso-700 hover:text-espresso-900 hover:bg-espresso-50/60'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <Button
                  to="/menu"
                  variant="primary"
                  size="sm"
                  className="font-medium"
                >
                  View Menu
                </Button>
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-espresso-700 hover:bg-espresso-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-espresso-800" />
                ) : (
                  <MenuIcon className="w-6 h-6 text-espresso-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden bg-cream-50 border-b border-espresso-200/80 px-4 pt-3 pb-6 space-y-3 shadow-warm-md animate-in slide-in-from-top-2 duration-200"
            role="dialog"
            aria-label="Mobile Navigation"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-terracotta-500 text-white font-semibold'
                        : 'text-espresso-800 hover:bg-espresso-100/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-3 border-t border-espresso-100 flex flex-col gap-2.5">
              <Button to="/menu" variant="primary" size="md" className="w-full justify-center">
                Explore Full Menu
              </Button>
              <div className="flex items-center justify-around pt-2 text-xs text-espresso-600">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-1.5 py-1 px-2 hover:text-terracotta-600"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Us
                </a>
                <span className="text-espresso-300">|</span>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 py-1 px-2 hover:text-terracotta-600"
                >
                  <MapPin className="w-3.5 h-3.5" /> Koregaon Park
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
