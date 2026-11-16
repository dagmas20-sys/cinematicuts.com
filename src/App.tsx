import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ThreeDBarbershopScene } from './components/ThreeDBarbershopScene';
import { ServicesSection } from './components/ServicesSection';
import { BarbersSection } from './components/BarbersSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AppointmentLookup } from './components/AppointmentLookup';
import { AIConsultantModal } from './components/AIConsultantModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ServiceItem, BarberItem, Appointment } from './types';
import { MapPin, Phone, Star, Shield, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<BarberItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenBooking = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleSelectBarber = (barber: BarberItem) => {
    setSelectedBarber(barber);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (appt: Appointment) => {
    setToastMessage(`Appointment ${appt.id} successfully confirmed for ${appt.clientName}!`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-zinc-900 border border-amber-500/40 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onOpenBooking={handleOpenBooking}
        onOpenConsultant={() => setIsConsultantOpen(true)}
      />

      {/* Interactive Three.js 3D Barbershop Master Studio */}
      <ThreeDBarbershopScene />

      {/* Services & Pricing */}
      <ServicesSection onSelectService={handleSelectService} />

      {/* Master Barbers */}
      <BarbersSection onSelectBarber={handleSelectBarber} />

      {/* Visual Portfolio Gallery */}
      <GallerySection />

      {/* Location & Contact Info Strip */}
      <section className="py-20 bg-[#0c0e15] border-t border-zinc-800 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Visit Our Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CinematiCuts Hialeah Location
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Conveniently situated at <span className="text-amber-400 font-semibold">407 W 29th St, Hialeah, FL 33012</span>. Walk-ins are always welcomed with a complimentary artisanal espresso or beverage.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Direct Telephone Inquiries</p>
                  <a href="tel:+17862476698" className="text-base font-bold text-amber-400 hover:underline">+1 786-247-6698</a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Security & Web Guarantee</p>
                  <p className="text-sm font-semibold text-white">Full HTTPS encryption, data protection, and secure SSL appointments.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 h-[400px] flex items-center justify-center p-8 text-center">
            <div className="space-y-4 max-w-md">
              <MapPin className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">407 W 29th St, Hialeah, FL 33012</h3>
              <p className="text-xs text-zinc-400">
                Ample parking available on-site. Minutes from major highways in Hialeah.
              </p>
              <button
                onClick={handleOpenBooking}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition-colors shadow-lg"
              >
                Schedule Your Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedService={selectedService}
        selectedBarber={selectedBarber}
        onBookingSuccess={handleBookingSuccess}
      />

      <AppointmentLookup
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      <AIConsultantModal
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
