import React, { useState } from 'react';
import { X, Search, Calendar, Phone, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentLookupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentLookup: React.FC<AppointmentLookupProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'code'>('code');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');

    try {
      const url = searchType === 'code' 
        ? `/api/appointments?code=${encodeURIComponent(searchTerm)}`
        : `/api/appointments?phone=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch appointments.');
      setAppointments(data);
      if (data.length === 0) {
        setError('No appointments found matching your search.');
      }
    } catch (err: any) {
      setError(err.message || 'Error searching appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm(`Are you sure you want to cancel appointment ${id}?`)) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
      }
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Search className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Find or Manage Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSearchType('code')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  searchType === 'code' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                By Confirmation Code (e.g. CC-8492)
              </button>
              <button
                type="button"
                onClick={() => setSearchType('phone')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  searchType === 'phone' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                By Phone Number
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder={searchType === 'code' ? 'Enter code (e.g. CC-8492)' : 'Enter phone number'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors shadow-md"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Results List */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">{appt.id}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                      appt.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block">Client:</span>
                    <span className="font-semibold text-white">{appt.clientName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Service:</span>
                    <span className="font-semibold text-white">{appt.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Barber:</span>
                    <span className="font-semibold text-white">{appt.barberName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Date & Time:</span>
                    <span className="font-semibold text-amber-400">{appt.date} at {appt.time}</span>
                  </div>
                </div>

                {appt.status === 'confirmed' && (
                  <div className="pt-2 border-t border-zinc-800 flex justify-end">
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Appointment</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
