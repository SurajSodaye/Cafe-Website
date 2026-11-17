import React from 'react';
import { ArrowRight, Leaf, HeartHandshake, Coffee, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function AboutTeaser({ cafeInfo }) {
  const highlights = [
    {
      icon: Coffee,
      title: "Direct-Trade Micro-lots",
      desc: "Ethically procured shade-grown Arabica from Chikmagalur estates.",
    },
    {
      icon: Leaf,
      title: "Verdant Green Oasis",
      desc: "Open garden courtyard with over 120 curated botanical species.",
    },
    {
      icon: HeartHandshake,
      title: "Slow Hospitality",
      desc: "No rush, no timers. Spaces curated for reading, meetings, and calm.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-cream-100 overflow-hidden">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80"
                  alt="Cozy interior seating with plants and warm natural daylight at Brew & Bloom"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  width="900"
                  height="675"
                  className="w-full h-[320px] sm:h-[400px] object-cover"
                />
              </div>

              {/* Overlapping smaller photo */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-56 h-56 rounded-2xl overflow-hidden border-4 border-white shadow-warm-lg">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80"
                  alt="Barista brewing single origin pour-over"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  width="500"
                  height="500"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating quote badge */}
              <div className="absolute top-6 left-6 bg-cream-50/90 backdrop-blur-sm p-4 rounded-2xl shadow-warm-md border border-espresso-100 max-w-[220px]">
                <p className="font-serif italic text-xs text-espresso-800">
                  "A breath of fresh mountain air right here in Koregaon Park."
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 mt-1">
                  — Pune Food Review
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-espresso-900 leading-tight">
              Slow coffee brewed for fast-paced minds.
            </h2>

            <p className="text-base text-espresso-700 leading-relaxed">
              We started Brew & Bloom with a quiet belief: the world has enough fast-food counters, but not enough places to pause. Here, espresso is poured with mindful intent, pastries are kneaded by hand before sunrise, and sunlight filters through leafy banyans.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="bg-white/80 p-4 rounded-2xl border border-espresso-100">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 text-sage-700 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-semibold text-sm text-espresso-900 mb-1">
                      {h.title}
                    </h3>
                    <p className="text-xs text-espresso-600 leading-normal">
                      {h.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button
                to="/about"
                variant="secondary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
              >
                Read Our Story & Values
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
