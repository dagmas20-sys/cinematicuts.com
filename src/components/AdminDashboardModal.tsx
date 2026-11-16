import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Users, FileText, Database, Shield, AlertTriangle, CheckCircle, RefreshCw, Key } from 'lucide-react';
import { Appointment, AuditLog } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('cinematic2026');
  const [mfaCode, setMfaCode] = useState('123456');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'appointments' | 'audit' | 'backups' | 'security'>('appointments');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, mfaCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');

      setIsAuthenticated(true);
      fetchAllData();
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials or MFA.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [apptsRes, logsRes, backupsRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/backups'),
      ]);
      const apptsData = await apptsRes.json();
      const logsData = await logsRes.json();
      const backupsData = await backupsRes.json();

      setAppointments(apptsData);
      setAuditLogs(logsData);
      setBackups(backupsData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  const handleTriggerBackup = async () => {
    try {
      const res = await fetch('/api/admin/backups', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBackups([data.backup, ...backups]);
        fetchAllData();
      }
    } catch (err) {
      alert('Failed to generate backup.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CinematiCuts Secure Admin & Infrastructure Console</h2>
              <p className="text-xs text-zinc-400">ISO 27001 Standard · WAF Active · Rate Limiting · End-to-End Encryption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <form onSubmit={handleLogin} className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Administrator Access</h3>
                <p className="text-xs text-zinc-400">Protected by Multi-Factor Authentication (MFA)</p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">MFA Code (Demo: 123456)</label>
                  <input
                    type="text"
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Authenticate Securely'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 px-6 py-3 bg-zinc-900/50 border-b border-zinc-800 shrink-0">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  activeTab === 'appointments' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-400 hover:text-white bg-zinc-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  activeTab === 'audit' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-400 hover:text-white bg-zinc-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Audit Logs ({auditLogs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('backups')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  activeTab === 'backups' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-400 hover:text-white bg-zinc-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Backups & Snapshots</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  activeTab === 'security' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-400 hover:text-white bg-zinc-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security & WAF Status</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Client Appointments Management</h3>
                    <button
                      onClick={fetchAllData}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh List
                    </button>
                  </div>

                  <div className="border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-zinc-900 text-zinc-400 uppercase font-semibold">
                        <tr>
                          <th className="p-4">ID</th>
                          <th className="p-4">Client</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Service</th>
                          <th className="p-4">Barber</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {appointments.map((a) => (
                          <tr key={a.id} className="hover:bg-zinc-900/50">
                            <td className="p-4 font-mono font-bold text-amber-400">{a.id}</td>
                            <td className="p-4 font-semibold text-white">{a.clientName}</td>
                            <td className="p-4">{a.phone}</td>
                            <td className="p-4">{a.serviceName}</td>
                            <td className="p-4">{a.barberName}</td>
                            <td className="p-4 text-amber-400">{a.date} ({a.time})</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                a.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Security Audit & Firewall Logs</h3>
                  <div className="border border-zinc-800 rounded-2xl overflow-hidden font-mono text-xs">
                    <table className="w-full text-left text-zinc-300">
                      <thead className="bg-zinc-900 text-zinc-400 uppercase font-semibold">
                        <tr>
                          <th className="p-4">Timestamp</th>
                          <th className="p-4">Action</th>
                          <th className="p-4">Client IP</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-zinc-900/50">
                            <td className="p-4 text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td className="p-4 font-bold text-amber-400">{log.action}</td>
                            <td className="p-4">{log.ip}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' :
                                log.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-400">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'backups' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Automated Database Backups & Snapshots</h3>
                      <p className="text-xs text-zinc-400">Daily incremental snapshots with cryptographic integrity verification.</p>
                    </div>
                    <button
                      onClick={handleTriggerBackup}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs rounded-xl transition-colors shadow"
                    >
                      Trigger Instant Backup
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {backups.map((bk) => (
                      <div key={bk.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-400 text-sm">{bk.id}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                            {bk.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 space-y-1">
                          <p>Timestamp: {new Date(bk.timestamp).toLocaleString()}</p>
                          <p>Archive Size: {bk.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-white">Security & Firewall Architecture</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">HTTPS & SSL/TLS Enforced</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        All client communications are secured with TLS 1.3 encryption and HSTS headers.
                      </p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">WAF & XSS / CSRF Defense</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Input sanitization middleware inspects payloads for script injection and cross-site request forgery.
                      </p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        <Key className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">Secure Secrets Management</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Environment variables and API keys (Gemini API) are isolated in server runtime memory and never exposed client-side.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
