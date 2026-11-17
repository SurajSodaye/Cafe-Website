import React from 'react';
import { MapPin, Phone, Navigation, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export function HomeCTA({ cafeInfo }) {
  return (
    <section className="py-16 sm:py-20 bg-cream-100">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-espresso-800 text-cream-50 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-warm-lg">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-terracotta-300">
                Come Say Hello
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-cream-50">
                Your quiet table in Koregaon Park awaits.
              </h2>
              <p className="text-cream-200 text-sm sm:text-base max-w-xl leading-relaxed">
                Whether it's your early morning flat white or an evening conversation under the fairy lights, our doors are open every day of the week.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-cream-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terracotta-400" />
                  {cafeInfo?.address || '12, Garden Lane, Koregaon Park, Pune 411001'}
                </span>
                <span className="text-espresso-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-terracotta-400" />
                  Mon-Fri 8am-11pm, Weekends till midnight
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Button
                href={cafeInfo?.googleMapsDirectionsUrl || 'https://maps.google.com'}
                variant="primary"
                size="lg"
                icon={Navigation}
                className="w-full justify-center shadow-lg"
              >
                Get Driving Directions
              </Button>
              <Button
                href={`tel:${cafeInfo?.phoneRaw || '+919876543210'}`}
                variant="outline"
                size="lg"
                icon={Phone}
                className="w-full justify-center border-cream-200 text-cream-50 hover:bg-cream-50 hover:text-espresso-900"
              >
                Call {cafeInfo?.phone || '+91 98765 43210'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
