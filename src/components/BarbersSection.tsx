import React from 'react';
import { Star, Award, Scissors, Calendar } from 'lucide-react';
import { BarberItem } from '../types';

const BARBERS_DATA: BarberItem[] = [
  {
    id: 'b1',
    name: 'Alex "Director" Cruz',
    role: 'Master Barber & Founder',
    specialty: 'Precision Skin Fades & Scissor Architecture',
    experience: '14 Years Experience',
    rating: 5.0,
    imageKey: 'alex',
  },
  {
    id: 'b2',
    name: 'Marcus "Cinematic" Vance',
    role: 'Senior Grooming Specialist',
    specialty: 'Hot Towel Shaves & Beard Sculpting',
    experience: '10 Years Experience',
    rating: 4.9,
    imageKey: 'marcus',
  },
  {
    id: 'b3',
    name: 'Sofia "Prime" Laurent',
    role: 'Master Stylist & Colorist',
    specialty: 'Texture Styling & Modern Executive Crops',
    experience: '9 Years Experience',
    rating: 5.0,
    imageKey: 'sofia',
  },
];

interface BarbersSectionProps {
  onSelectBarber: (barber: BarberItem) => void;
}

export const BarbersSection: React.FC<BarbersSectionProps> = ({ onSelectBarber }) => {
  return (
    <section id="barbers" className="py-24 bg-gradient-to-b from-[#090a0f] via-[#10121a] to-[#090a0f] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Elite Artisans</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet Our Master Barbers
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Seasoned professionals dedicated to absolute perfection, precision craftsmanship, and personalized client styling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BARBERS_DATA.map((barber) => (
            <div
              key={barber.id}
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl group-hover:scale-105 transition-transform">
                    <Scissors className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{barber.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{barber.role}</p>
                  <p className="text-sm text-zinc-300 font-medium pt-2">{barber.specialty}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{barber.experience}</span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectBarber(barber)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book with {barber.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
