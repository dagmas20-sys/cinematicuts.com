import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="py-24 bg-[#090a0f] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The CinematiCuts Experience
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            A glimpse into our state-of-the-art studio in Hialeah, precision artistry, and meticulous craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group h-[380px]">
            <img
              src="/src/assets/images/hero_barbershop_interior_1794852516109.jpg"
              alt="CinematiCuts Interior Showcase"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Studio Sanctuary</span>
              <h3 className="text-lg font-bold text-white">The Interior & Ambiance</h3>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group h-[380px]">
            <img
              src="/src/assets/images/service_fade_cut_1794852516722.jpg"
              alt="Precision Hair Fade"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Precision Technique</span>
              <h3 className="text-lg font-bold text-white">Director's Fade & Taper</h3>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group h-[380px]">
            <img
              src="/src/assets/images/barber_craftsman_1794852516623.jpg"
              alt="Beard Sculpting & Shave"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Traditional Craft</span>
              <h3 className="text-lg font-bold text-white">Hot Towel & Straight Razor</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
