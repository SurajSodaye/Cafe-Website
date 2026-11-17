import React from 'react';
import { SEO } from '../components/layout/SEO';
import { Hero } from '../components/home/Hero';
import { PopularSection } from '../components/home/PopularSection';
import { AboutTeaser } from '../components/home/AboutTeaser';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { HomeCTA } from '../components/home/HomeCTA';
import { useCafeInfo } from '../hooks/useCafeInfo';
import { getCafeSchema } from '../utils/seoSchemas';

export default function HomePage() {
  const { data: cafeInfo } = useCafeInfo();
  const schema = getCafeSchema(cafeInfo);

  return (
    <>
      <SEO
        title="Brew & Bloom Café | Slow Coffee & Artisanal Bakes | Koregaon Park, Pune"
        description="Brew & Bloom Café in Koregaon Park, Pune. Specialty slow coffee, single origin pour-overs, artisan sourdough, and peaceful garden courtyard."
        schemaJson={schema}
      />
      <div className="space-y-0">
        <Hero cafeInfo={cafeInfo} />
        <PopularSection />
        <AboutTeaser cafeInfo={cafeInfo} />
        <GalleryPreview />
        <HomeCTA cafeInfo={cafeInfo} />
      </div>
    </>
  );
}
