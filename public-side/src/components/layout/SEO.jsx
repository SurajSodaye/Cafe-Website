import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEO({
  title,
  description = 'Brew & Bloom Café — Specialty slow coffee, artisanal bakes, and peaceful botanical garden courtyard in Koregaon Park, Pune.',
  image = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  url = 'https://brewandbloom.example',
  schemaJson,
}) {
  const fullTitle = title
    ? `${title} | Brew & Bloom Café | Koregaon Park, Pune`
    : 'Brew & Bloom Café | Slow Coffee & Artisanal Bakes | Koregaon Park, Pune';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Brew & Bloom Café" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data JSON-LD */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}
