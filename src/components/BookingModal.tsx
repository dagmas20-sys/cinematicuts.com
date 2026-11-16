import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, Scissors, Shield } from 'lucide-react';
import { ServiceItem, BarberItem, Appointment } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: ServiceItem | null;
  selectedBarber?: BarberItem | null;
  onBookingSuccess: (appt: Appointment) => void;
}

const AVAILABLE_SERVICES: ServiceItem[] = [
  { id: 's1', name: "Director's Precision Fade & Styling", price: 45, duration: '45 mins', description: '', category: 'hair' },
  { id: 's2', name: 'Red Carpet Hot Towel Shave', price: 40, duration: '30 mins', description: '', category: 'luxury' },
  { id: 's3', name: 'Academy Beard Sculpting & Trim', price: 35, duration: '30 mins', description: '', category: 'beard' },
  { id: 's4', name: 'Executive Combo: Cut & Beard', price: 75, duration: '60 mins', description: '', category: 'combo' },
  { id: 's5', name: 'Royal Gold Treatment', price: 110, duration: '75 mins', description: '', category: 'luxury' },
  { id: 's6', name: 'Junior Cinematic Cut (Under 12)', price: 30, duration: '30 mins', description: '', category: 'hair' },
];

const AVAILABLE_BARBERS: BarberItem[] = [
  { id: 'b1', name: 'Alex "Director" Cruz', role: 'Master Barber', specialty: '', experience: '', rating: 5.0, imageKey: '' },
  { id: 'b2', name: 'Marcus "Cinematic" Vance', role: 'Senior Grooming Specialist', specialty: '', experience: '', rating: 4.9, imageKey: '' },
  { id: 'b3', name: 'Sofia "Prime" Laurent', role: 'Master Stylist', specialty: '', experience: '', rating: 5.0, imageKey: '' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:15 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  selectedBarber,
  onBookingSuccess,
}) => {
  const [serviceId, setServiceId] = useState(selectedService?.id || 's1');
  const [barberId, setBarberId] = useState(selectedBarber?.id || 'b1');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00 AM');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone) {
      setError('Please provide your name and phone number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const sItem = AVAILABLE_SERVICES.find(s => s.id === serviceId) || AVAILABLE_SERVICES[0];
      const bItem = AVAILABLE_BARBERS.find(b => b.id === barberId) || AVAILABLE_BARBERS[0];

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          phone,
          email,
          serviceId: sItem.id,
          serviceName: sItem.name,
          barberId: bItem.id,
          barberName: bItem.name,
          date,
          time,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create appointment.');
      }

      setConfirmedAppt(data);
      onBookingSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Error scheduling appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Book Your CinematiCuts Session</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedAppt ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Appointment Confirmed!</h3>
              <p className="text-sm text-zinc-300">
                Confirmation Code: <span className="text-amber-400 font-mono font-bold">{confirmedAppt.id}</span>
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-left space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Service:</span>
                <span className="font-semibold text-white">{confirmedAppt.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Master Barber:</span>
                <span className="font-semibold text-white">{confirmedAppt.barberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date & Time:</span>
                <span className="font-semibold text-amber-400">{confirmedAppt.date} at {confirmedAppt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Location:</span>
                <span className="font-semibold text-white">407 W 29th St, Hialeah, FL</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold rounded-xl transition-colors shadow-lg"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Select Service</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {AVAILABLE_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.price} - {s.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Barber Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Master Barber</label>
              <select
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {AVAILABLE_BARBERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Time Slot</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Details */}
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Your Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Carlos Mendoza"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (786) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      placeholder="carlos@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing Secure Booking...' : 'Confirm Appointment'}
            </button>

            <p className="text-[11px] text-center text-zinc-500 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Secure SSL Encryption · Pay at the Shop
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
