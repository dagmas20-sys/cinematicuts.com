import React from 'react';
import { Scissors, Calendar, Sparkles, ShieldCheck, Search } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenConsultant: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenLookup,
  onOpenConsultant,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
            <Scissors className="w-5 h-5" />
          </div>
          <span>Cinemati<span className="text-amber-400">Cuts</span></span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <a href="#experience-3d" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">3D Studio</a>
          <a href="#services" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">Services & Pricing</a>
          <a href="#barbers" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">Master Barbers</a>
          <a href="#gallery" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">Gallery</a>
          <a href="#contact" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">Location & Contact</a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenConsultant}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors whitespace-nowrap"
            title="AI Grooming Consultant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Consultant</span>
          </button>

          <button
            onClick={onOpenLookup}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/80 rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
            title="Manage My Booking"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Booking</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
            title="Secure Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-lg shadow-amber-400/20 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </header>
  );
};
