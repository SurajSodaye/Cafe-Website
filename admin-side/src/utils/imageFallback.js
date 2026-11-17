/**
 * Self-contained SVG fallback image data URI.
 * Renders an elegant Brew & Bloom coffee cup illustration on warm cream background.
 * Works 100% offline, requires zero external CDN requests, and cannot be blocked by ad-blockers.
 */
export const SVG_FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 375" width="600" height="375">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F6EFE6"/>
      <stop offset="50%" stop-color="#EFE4D6"/>
      <stop offset="100%" stop-color="#E2D4C3"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <g transform="translate(300, 165)" text-anchor="middle">
    <!-- Steam -->
    <path d="M-14 -40 Q -8 -60 -12 -80" stroke="#C8643B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M0 -45 Q 6 -65 2 -88" stroke="#C8643B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M14 -40 Q 20 -60 16 -80" stroke="#C8643B" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
    <!-- Cup body -->
    <path d="M-36 -30 L 36 -30 L 28 22 Q 26 36 0 36 Q -26 36 -28 22 Z" fill="#3B2A20"/>
    <!-- Cup handle -->
    <path d="M32 -20 C 52 -20 52 14 30 16" stroke="#3B2A20" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Saucer -->
    <path d="M-48 42 Q 0 48 48 42" stroke="#C8643B" stroke-width="5" stroke-linecap="round" fill="none"/>
    <!-- Text -->
    <text y="78" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#3B2A20" letter-spacing="1">BREW &amp; BLOOM</text>
    <text y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#786052" letter-spacing="2">SLOW COFFEE • GOOD COMPANY</text>
  </g>
</svg>
`)}`;

export const PRIMARY_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80";
