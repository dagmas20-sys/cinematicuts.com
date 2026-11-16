import React from 'react';
import { Scissors, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#06070a] border-t border-zinc-800 text-zinc-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1: Brand & Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-xl font-bold text-white">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scissors className="w-5 h-5" />
            </div>
            <span>Cinemati<span className="text-amber-400">Cuts</span></span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Hialeah's premier cinematic barbershop delivering precision fades, executive grooming, and master craftsmanship.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>HTTPS Secured & Verified WAF Protection</span>
          </div>
        </div>

        {/* Col 2: Location */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Location & Address</h4>
          <div className="flex items-start gap-3 text-sm text-zinc-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-white">CinematiCuts Barbershop</p>
              <p className="text-zinc-400">407 W 29th St</p>
              <p className="text-zinc-400">Hialeah, FL 33012</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-300 pt-2">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <a href="tel:+17862476698" className="text-amber-400 hover:underline font-semibold">+1 786-247-6698</a>
          </div>
        </div>

        {/* Col 3: Hours */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Working Hours</h4>
          <div className="space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Tuesday – Saturday: 9:00 AM – 8:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Sunday: 10:00 AM – 5:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Monday: Closed (Rest & Prep)</span>
            </div>
          </div>
        </div>

        {/* Col 4: Quick Navigation */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><a href="#experience-3d" className="hover:text-amber-400 transition-colors">3D Master Studio</a></li>
            <li><a href="#services" className="hover:text-amber-400 transition-colors">Services & Pricing</a></li>
            <li><a href="#barbers" className="hover:text-amber-400 transition-colors">Master Barbers</a></li>
            <li><a href="#gallery" className="hover:text-amber-400 transition-colors">Visual Portfolio</a></li>
            <li><a href="#contact" className="hover:text-amber-400 transition-colors">Location & Map</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} CinematiCuts Barbershop. All rights reserved. 407 W 29th St, Hialeah, FL.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Security Compliance</a>
        </div>
      </div>
    </footer>
  );
};
