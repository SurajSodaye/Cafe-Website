import React from 'react';
import { SEO } from '../components/layout/SEO';
import { Leaf, Coffee, Sun, Heart, Sparkles, Award, ShieldCheck, Smile } from 'lucide-react';
import { useCafeInfo } from '../hooks/useCafeInfo';
import { Button } from '../components/ui/Button';

const iconMap = {
  Leaf,
  Coffee,
  Sun,
  Heart,
};

export default function AboutPage() {
  const { data: cafeInfo } = useCafeInfo();

  const differentiators = [
    {
      title: "100% Indian Shade-Grown Arabica",
      desc: "We exclusively source our beans from small-holder regenerative farms in Chikmagalur and Coorg, roasted in small batches to preserve distinctive origin terroir.",
      icon: Coffee,
    },
    {
      title: "Natural Sourdough Fermentation",
      desc: "Our breads undergo a slow 24-hour natural wild yeast fermentation. No commercial dough conditioners, artificial colors, or refined shortcuts.",
      icon: Award,
    },
    {
      title: "Living Courtyard Ecosystem",
      desc: "With 120+ potted tropical varieties, ancient banyans overhead, and natural stone tables, our courtyard is engineered for calm and mental recharge.",
      icon: Leaf,
    },
    {
      title: "Pet & People Friendly",
      desc: "Well-behaved dogs and cats are always welcome in our garden veranda. Complimentary water bowls and homemade oat treats are ready at the counter.",
      icon: Smile,
    },
  ];

  return (
    <>
      <SEO
        title="Our Story, Values & Team — Specialty Coffee in Koregaon Park"
        description="Learn about Brew & Bloom Café's journey in Pune. Our direct-trade coffee sourcing, artisan kitchen philosophy, garden sanctuary, and the passionate team behind every cup."
      />

      {/* Hero Header */}
      <section className="bg-cream-100 pt-12 pb-16 border-b border-espresso-100 relative overflow-hidden">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-terracotta-600 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Founded in Koregaon Park, 2021</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Crafting mindful coffee moments amidst Pune’s garden canopy.
          </h1>
          <p className="text-base sm:text-lg text-espresso-600 max-w-2xl mx-auto mt-4 leading-relaxed">
            A quiet sanctuary dedicated to the craft of slow-poured coffee, sourdough baking, and heartfelt neighborhood connection.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
            {cafeInfo?.stats?.map((stat, i) => (
              <div key={i} className="bg-white/80 p-4 rounded-2xl border border-espresso-100 shadow-warm-sm">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-terracotta-600">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-espresso-600 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-16 sm:py-24 bg-cream-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
                The Origins
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 leading-tight">
                {cafeInfo?.story?.heroHeading || "A botanical sanctuary in the heart of Pune"}
              </h2>
              <p className="text-base text-espresso-700 leading-relaxed">
                {cafeInfo?.story?.paragraph1}
              </p>
              <p className="text-base text-espresso-700 leading-relaxed">
                {cafeInfo?.story?.paragraph2}
              </p>
              <div className="p-5 rounded-2xl bg-cream-100 border-l-4 border-terracotta-500 text-espresso-800 italic font-serif text-base">
                "We don't serve fast coffee to go; we brew slow coffee to stay."
              </div>
            </div>

            {/* Story Photos */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
                  alt="Brew & Bloom tranquil courtyard"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  width="900"
                  height="1100"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-cream-100 border-t border-espresso-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
              Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 mt-1">
              Our Core Values
            </h2>
            <p className="text-sm text-espresso-600 mt-2">
              Every detail — from the temperature of our espresso water to the soil in our terracotta planters — reflects these four pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cafeInfo?.values?.map((val, idx) => {
              const IconComp = iconMap[val.icon] || Leaf;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-espresso-100 shadow-warm-sm flex flex-col justify-between hover:border-terracotta-300 transition-colors"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cream-100 text-terracotta-600 flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-espresso-900 mb-2">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-espresso-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 sm:py-20 bg-espresso-900 text-cream-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-300">
              The Bloom Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-1">
              What Makes Us Different
            </h2>
            <p className="text-sm text-cream-300 mt-2">
              We hold ourselves to rigorous standards because thoughtful food and drink makes for a happier community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((diff, i) => {
              const DiffIcon = diff.icon;
              return (
                <div
                  key={i}
                  className="bg-espresso-800/80 p-6 sm:p-8 rounded-3xl border border-espresso-700/80 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-espresso-700 text-terracotta-300 flex items-center justify-center shrink-0">
                    <DiffIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50 mb-2">
                      {diff.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed">
                      {diff.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-24 bg-cream-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
              The People Behind the Cups
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 mt-1">
              Meet Our Team
            </h2>
            <p className="text-sm text-espresso-600 mt-2">
              Roasters, sourdough artisans, and sensory explorers dedicated to your comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cafeInfo?.team?.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-espresso-100 shadow-warm-sm group"
              >
                <div className="aspect-[4/3] overflow-hidden bg-espresso-100">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    width="600"
                    height="450"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
                    {member.role}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-espresso-900 mt-1 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Join Us Note */}
          <div className="mt-14 p-8 rounded-3xl bg-cream-100 border border-espresso-200/80 text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-xl font-bold text-espresso-900 mb-2">
              Want to brew with us?
            </h3>
            <p className="text-xs sm:text-sm text-espresso-600 mb-4">
              We are continually looking for passionate apprentice baristas and bakers who appreciate specialty origin coffees.
            </p>
            <Button
              href={`mailto:${cafeInfo?.email || 'hello@brewandbloom.example'}?subject=Career%20Inquiry`}
              variant="outlineTerracotta"
              size="sm"
            >
              Get in Touch with Rohan & Aanya
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
