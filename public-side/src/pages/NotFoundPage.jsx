import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/layout/SEO';
import { Coffee, Home, Utensils } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found (404)"
        description="The page you are looking for does not exist at Brew & Bloom Café."
      />

      <section className="min-h-[75vh] flex items-center justify-center py-20 px-4 bg-cream-50">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-espresso-100 shadow-warm-md">
          <div className="w-20 h-20 rounded-3xl bg-cream-100 text-terracotta-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Coffee className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Error 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 mt-1 mb-3">
            Spilled Coffee!
          </h1>
          <p className="text-sm text-espresso-600 mb-8 leading-relaxed">
            It looks like this cup was knocked over or the link doesn't exist anymore. Let’s get you back to the warmth of our cafe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/"
              variant="primary"
              size="md"
              icon={Home}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
            <Button
              to="/menu"
              variant="outline"
              size="md"
              icon={Utensils}
              className="w-full sm:w-auto"
            >
              Browse Menu
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
