import React from 'react';
import { Calendar, MapPin, Phone, Star, Sparkles, Shield } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenConsultant: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenConsultant }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#090a0f] via-[#12141c] to-[#090a0f] px-6 py-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cinematic Grooming & Master Barbering</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
            Where Every Cut is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Masterpiece.</span>
          </h1>

          <p className="text-lg text-zinc-300 max-w-2xl leading-relaxed">
            Welcome to CinematiCuts. Located in the heart of Hialeah, FL. We deliver precision fades, razor-sharp beard sculpting, and luxury hot towel treatments in an upscale cinematic atmosphere.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xl shadow-amber-400/20 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>

            <button
              onClick={onOpenConsultant}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Style Consultant</span>
            </button>
          </div>

          {/* Published Contact Quick Strip */}
          <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Location</p>
                <p className="text-xs text-zinc-400">407 W 29th St, Hialeah, FL 33012</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Direct Phone</p>
                <a href="tel:+17862476698" className="text-xs text-amber-400 hover:underline">+1 786-247-6698</a>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card / Showcase */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl group">
            <img
              src="/src/assets/images/hero_barbershop_interior_1794852516109.jpg"
              alt="CinematiCuts Interior"
              className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-white ml-2">5.0 / 500+ Verified Reviews</span>
              </div>
              <p className="text-sm text-zinc-200 font-medium">Hialeah's Premier Destination for Executive Grooming & Cinematic Styling.</p>
              
              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium"><Shield className="w-3.5 h-3.5" /> Secure Booking</span>
                <span>·</span>
                <span>Walk-ins Welcome</span>
                <span>·</span>
                <span>Complimentary Espresso</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
