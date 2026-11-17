import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';

export function MapEmbed({ cafeInfo }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-espresso-100 shadow-warm-sm flex flex-col">
      <div className="p-4 sm:p-5 flex items-center justify-between bg-cream-50 border-b border-espresso-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-terracotta-500" />
          <span className="text-sm font-semibold text-espresso-900">
            Koregaon Park, Pune
          </span>
        </div>
        <Button
          href={cafeInfo?.googleMapsDirectionsUrl || 'https://maps.google.com'}
          variant="outlineTerracotta"
          size="sm"
          icon={Navigation}
          className="text-xs py-1.5 px-3"
        >
          Open in Maps
        </Button>
      </div>

      <div className="relative w-full h-[320px] sm:h-[380px] bg-espresso-100">
        <iframe
          title="Google Maps Location of Brew & Bloom Café in Koregaon Park, Pune"
          src={cafeInfo?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15132.327663737213!2d73.88939!3d18.53621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f64c676451%3A0x6b9d62888ff436e2!2sKoregaon%20Park%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>

      <div className="p-4 bg-white text-xs text-espresso-600 flex items-center justify-between border-t border-espresso-100">
        <span>12, Garden Lane, Koregaon Park</span>
        <span className="text-espresso-400">Valet & bicycle parking available</span>
      </div>
    </div>
  );
}
