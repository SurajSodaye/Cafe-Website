import React from 'react';
import { SEO } from '../components/layout/SEO';
import { MapPin, Phone, MessageCircle, Instagram, Mail, Clock, ExternalLink } from 'lucide-react';
import { HoursTable } from '../components/contact/HoursTable';
import { MapEmbed } from '../components/contact/MapEmbed';
import { ContactForm } from '../components/contact/ContactForm';
import { useCafeInfo } from '../hooks/useCafeInfo';
import { Button } from '../components/ui/Button';

export default function ContactPage() {
  const { data: cafeInfo } = useCafeInfo();

  return (
    <>
      <SEO
        title="Find & Contact Us — Hours, Location, WhatsApp & Directions"
        description="Visit Brew & Bloom Café at 12 Garden Lane, Koregaon Park, Pune. View opening hours, Google Maps directions, phone, WhatsApp, and reservation form."
      />

      {/* Hero Header */}
      <section className="bg-cream-100 pt-10 pb-8 border-b border-espresso-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
            Visit & Connect
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 mt-1 mb-3">
            Find Us in Koregaon Park
          </h1>
          <p className="text-sm sm:text-base text-espresso-600 max-w-2xl leading-relaxed">
            Conveniently located off North Main Road, surrounded by quiet banyans and lush greenery. Walk-ins are always welcomed warmly.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-10 sm:py-16 bg-cream-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Contact Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {/* Phone */}
            <div className="bg-white p-5 rounded-2xl border border-espresso-100 shadow-warm-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-espresso-900 mb-1">
                  Call the Brew Bar
                </h4>
                <p className="text-xs text-espresso-600 mb-3">
                  Quick inquiries & table availability
                </p>
              </div>
              <a
                href={`tel:${cafeInfo?.phoneRaw || '+919876543210'}`}
                className="text-sm font-bold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4"
              >
                {cafeInfo?.phone || '+91 98765 43210'}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white p-5 rounded-2xl border border-espresso-100 shadow-warm-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-espresso-900 mb-1">
                  Chat on WhatsApp
                </h4>
                <p className="text-xs text-espresso-600 mb-3">
                  Pre-orders, menus & fast replies
                </p>
              </div>
              <a
                href={cafeInfo?.whatsappUrl || 'https://wa.me/919876543210'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
              >
                Start WhatsApp Chat <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Instagram */}
            <div className="bg-white p-5 rounded-2xl border border-espresso-100 shadow-warm-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                  <Instagram className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-espresso-900 mb-1">
                  Follow on Instagram
                </h4>
                <p className="text-xs text-espresso-600 mb-3">
                  Daily specials, roasts & community
                </p>
              </div>
              <a
                href={cafeInfo?.instagramUrl || 'https://instagram.com/brewandbloom'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 underline underline-offset-4"
              >
                {cafeInfo?.instagram || '@brewandbloom'} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-2xl border border-espresso-100 shadow-warm-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-espresso-100 text-espresso-700 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-espresso-900 mb-1">
                  Direct Email
                </h4>
                <p className="text-xs text-espresso-600 mb-3">
                  Partnerships, press & bulk beans
                </p>
              </div>
              <a
                href={`mailto:${cafeInfo?.email || 'hello@brewandbloom.example'}`}
                className="text-sm font-bold text-espresso-700 hover:text-espresso-900 underline underline-offset-4"
              >
                {cafeInfo?.email || 'hello@brewandbloom.example'}
              </a>
            </div>
          </div>

          {/* Form and Hours/Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right: Hours Table and Map Embed */}
            <div className="lg:col-span-5 space-y-8">
              <HoursTable weeklySchedule={cafeInfo?.weeklySchedule} />
              <MapEmbed cafeInfo={cafeInfo} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
