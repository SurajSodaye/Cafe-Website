export function getCafeSchema(cafeInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": cafeInfo?.name || "Brew & Bloom Café",
    "alternateName": "Brew and Bloom Cafe Pune",
    "image": [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
    ],
    "@id": "https://brewandbloom.example/#cafe",
    "url": "https://brewandbloom.example",
    "telephone": cafeInfo?.phone || "+91 98765 43210",
    "priceRange": "₹₹",
    "servesCuisine": [
      "Artisanal Specialty Coffee",
      "Pour-over",
      "Whole Leaf Tea",
      "Sourdough Sandwiches",
      "Bakery & Pastries"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "12, Garden Lane",
      "addressLocality": "Koregaon Park, Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "411001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5362,
      "longitude": 73.8940
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "23:59"
      }
    ]
  };
}
