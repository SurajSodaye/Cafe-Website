import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { OpenBadge } from './OpenBadge';

export function Hero({ cafeInfo }) {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-24 bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100">
      {/* Decorative botanical background blurs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-terracotta-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 right-10 w-[400px] h-[300px] bg-sage-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Live Open / Closed Badge */}
            <div className="flex justify-center lg:justify-start">
              <OpenBadge schedule={cafeInfo?.weeklySchedule} />
            </div>

            {/* Title & Tagline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-terracotta-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Koregaon Park's Garden Sanctuary</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso-900 tracking-tight leading-[1.12]">
                Brew & Bloom <span className="text-terracotta-500 italic font-serif">Café</span>
              </h1>
              <p className="font-serif italic text-2xl sm:text-3xl text-espresso-700 font-normal">
                "{cafeInfo?.tagline || 'Slow coffee. Good company.'}"
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-espresso-700/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Unwind in Pune's peaceful courtyard café. Savor slow-poured micro-lot coffees, artisan sourdough bakes, and lush tropical greenery crafted for thoughtful conversations.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4">
              <Button
                to="/menu"
                variant="primary"
                size="lg"
                icon={Utensils}
                className="w-full sm:w-auto shadow-warm-md"
              >
                View Menu
              </Button>
              <Button
                to="/contact"
                variant="outline"
                size="lg"
                icon={MapPin}
                className="w-full sm:w-auto"
              >
                Find Us
              </Button>
            </div>

            {/* Location & Quick Meta */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-espresso-600">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
                12, Garden Lane, Koregaon Park
              </span>
              <span className="text-espresso-300">•</span>
              <span>Mon-Fri 8am-11pm, Sat-Sun till midnight</span>
            </div>
          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer frame styling with warm accent shadow */}
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white bg-espresso-100">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
                  alt="Brew & Bloom Café garden courtyard with warm sunlight and lush plants"
                  width="1000"
                  height="1250"
                  fetchpriority="high"
                  referrerPolicy="no-referrer"
                  className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating pill over image */}
                <div className="absolute bottom-4 left-4 right-4 bg-espresso-900/85 backdrop-blur-md p-3.5 rounded-2xl text-cream-100 border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-300">
                        Today's Batch
                      </p>
                      <p className="font-serif text-sm sm:text-base font-medium">
                        Attikan Estate Honey Sun-dried Pour-Over
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-terracotta-500/30 text-terracotta-200 border border-terracotta-400/30 rounded-full font-semibold">
                      Freshly Brewed
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative stamp badge */}
              <div className="absolute -top-4 -right-4 bg-terracotta-500 text-cream-50 w-20 h-20 rounded-full flex flex-col items-center justify-center p-2 text-center shadow-warm-md transform rotate-6 border-2 border-white">
                <span className="text-[10px] uppercase font-bold tracking-tight">Artisan</span>
                <span className="text-xs font-serif font-black">100%</span>
                <span className="text-[9px] uppercase tracking-tighter">Arabica</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
