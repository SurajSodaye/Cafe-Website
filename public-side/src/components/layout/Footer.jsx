import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Instagram, MessageCircle, Clock, ArrowUpRight } from 'lucide-react';

export function Footer({ cafeInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-espresso-900 text-cream-100 pt-16 pb-24 md:pb-14 border-t border-espresso-800">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-cream-50 flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">
                  Brew & Bloom
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-cream-300">
                  Café · Pune
                </span>
              </div>
            </Link>
            <p className="font-serif italic text-terracotta-200 text-base">
              "{cafeInfo?.tagline || 'Slow coffee. Good company.'}"
            </p>
            <p className="text-sm text-cream-300/80 leading-relaxed">
              Nestled beneath the tree canopies of Koregaon Park, we are Pune's botanical retreat for mindful single-origin coffee and comforting artisan bakes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={cafeInfo?.whatsappUrl || 'https://wa.me/919876543210'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-espresso-800 hover:bg-emerald-700 text-cream-100 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={cafeInfo?.instagramUrl || 'https://instagram.com/brewandbloom'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-espresso-800 hover:bg-terracotta-500 text-cream-100 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${cafeInfo?.email || 'hello@brewandbloom.example'}`}
                className="w-9 h-9 rounded-full bg-espresso-800 hover:bg-espresso-700 text-cream-100 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cream-400"
                aria-label="Send us an email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream-50 mb-4 border-b border-espresso-800 pb-2">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-cream-300/90">
              <li>
                <Link to="/" className="hover:text-terracotta-300 transition-colors inline-flex items-center gap-1.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-terracotta-300 transition-colors inline-flex items-center gap-1.5">
                  Our Menu (Coffee, Tea & Food)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-terracotta-300 transition-colors inline-flex items-center gap-1.5">
                  Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-terracotta-300 transition-colors inline-flex items-center gap-1.5">
                  Courtyard & Space Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-terracotta-300 transition-colors inline-flex items-center gap-1.5">
                  Find Us & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream-50 mb-4 border-b border-espresso-800 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta-400" /> Opening Hours
            </h3>
            <div className="space-y-3 text-sm text-cream-300/90">
              <div>
                <p className="font-medium text-cream-100">Monday – Friday</p>
                <p className="text-xs text-cream-300/80">8:00 AM – 11:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-cream-100">Saturday – Sunday</p>
                <p className="text-xs text-cream-300/80">8:00 AM – 12:00 AM (Midnight)</p>
              </div>
              <p className="text-xs text-sage-300 pt-1">
                Fresh bakes out of the oven at 8:30 AM and 4:00 PM daily.
              </p>
            </div>
          </div>

          {/* Col 4: Address & Visit */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream-50 mb-4 border-b border-espresso-800 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-400" /> Visit Our Oasis
            </h3>
            <address className="not-italic space-y-3 text-sm text-cream-300/90">
              <p>
                {cafeInfo?.address || '12, Garden Lane, Koregaon Park, Pune 411001'}
              </p>
              <p className="text-xs text-cream-300/70">
                {cafeInfo?.landmark || 'Near North Main Road, Next to Osho Garden Gate 2'}
              </p>
              <div className="pt-1">
                <a
                  href={`tel:${cafeInfo?.phoneRaw || '+919876543210'}`}
                  className="hover:text-terracotta-300 transition-colors flex items-center gap-2 text-sm text-cream-200"
                >
                  <Phone className="w-4 h-4 text-terracotta-400 shrink-0" />
                  <span>{cafeInfo?.phone || '+91 98765 43210'}</span>
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={cafeInfo?.googleMapsDirectionsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-300 hover:text-terracotta-200 underline underline-offset-4"
                >
                  Get Google Maps Directions <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-espresso-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>
            © {currentYear} Brew & Bloom Café. Handcrafted with care in Pune, India.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-cream-400/80">Demo Prototype Frontend</span>
            <span className="text-cream-500">•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
