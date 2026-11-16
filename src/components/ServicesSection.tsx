import React, { useState } from 'react';
import { Clock, DollarSign, Sparkles, Check } from 'lucide-react';
import { ServiceItem } from '../types';

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 's1',
    name: "Director's Precision Fade & Styling",
    price: 45,
    duration: '45 mins',
    description: 'Custom skin fade, detailed scissor work over comb, and professional styling with top-tier pomade.',
    category: 'hair',
    popular: true,
  },
  {
    id: 's2',
    name: 'Red Carpet Hot Towel Shave',
    price: 40,
    duration: '30 mins',
    description: 'Traditional straight razor face shave accompanied by soothing eucalyptus hot towels and luxury aftershave balm.',
    category: 'luxury',
  },
  {
    id: 's3',
    name: 'Academy Beard Sculpting & Trim',
    price: 35,
    duration: '30 mins',
    description: 'Bespoke beard trimming, precise razor line-up, and nourishing organic conditioning oil treatment.',
    category: 'beard',
  },
  {
    id: 's4',
    name: 'Executive Combo: Cut & Beard',
    price: 75,
    duration: '60 mins',
    description: 'Our signature signature haircut paired with complete beard sculpture and hot lather neck cleanup.',
    category: 'combo',
    popular: true,
  },
  {
    id: 's5',
    name: 'Royal Gold Treatment',
    price: 110,
    duration: '75 mins',
    description: 'The ultimate grooming experience: haircut, beard trim, hot towel shave, facial clay mask, and scalp massage.',
    category: 'luxury',
  },
  {
    id: 's6',
    name: 'Junior Cinematic Cut (Under 12)',
    price: 30,
    duration: '30 mins',
    description: 'Clean, patient, and precision styling tailored for young gentlemen.',
    category: 'hair',
  },
];

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [filter, setFilter] = useState<'all' | 'hair' | 'beard' | 'luxury' | 'combo'>('all');

  const filteredServices = filter === 'all' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === filter);

  return (
    <section id="services" className="py-24 bg-[#090a0f] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Crafted Services</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Menu of Services & Pricing
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Transparent pricing for elite grooming. Every session includes a complimentary espresso and consultation.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {(['all', 'hair', 'beard', 'combo', 'luxury'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all capitalize ${
                  filter === cat
                    ? 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/20 font-semibold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`relative bg-zinc-900/50 backdrop-blur-sm border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900/80 group ${
                service.popular ? 'border-amber-500/40 shadow-xl shadow-amber-500/5' : 'border-zinc-800'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 right-6 bg-amber-400 text-zinc-950 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {service.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-amber-400 font-mono">${service.price}</span>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{service.duration}</span>
                </div>

                <button
                  onClick={() => onSelectService(service)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md"
                >
                  <span>Book This</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
