import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory data stores with realistic initial seed
interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  status: 'SUCCESS' | 'BLOCKED' | 'WARNING';
  details: string;
}

let appointments: Appointment[] = [
  {
    id: 'CC-8492',
    clientName: 'Carlos Mendoza',
    phone: '+1 786-555-0192',
    email: 'carlos@example.com',
    serviceId: 's1',
    serviceName: "Director's Precision Fade & Styling",
    barberId: 'b1',
    barberName: 'Alex Cruz',
    date: '2026-03-20',
    time: '10:00 AM',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'CC-3921',
    clientName: 'Julian Rivera',
    phone: '+1 786-555-8841',
    email: 'julian@example.com',
    serviceId: 's2',
    serviceName: 'Red Carpet Hot Towel Shave',
    barberId: 'b2',
    barberName: 'Marcus Vance',
    date: '2026-03-20',
    time: '11:30 AM',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

let auditLogs: AuditLog[] = [
  {
    id: 'LOG-101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: 'SECURITY_INIT',
    ip: '127.0.0.1',
    status: 'SUCCESS',
    details: 'WAF rules, HTTPS enforcement, and rate limiting initialized.'
  },
  {
    id: 'LOG-102',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'ADMIN_AUTH_SUCCESS',
    ip: '192.168.1.45',
    status: 'SUCCESS',
    details: 'Administrator successfully authenticated with MFA verification.'
  },
  {
    id: 'LOG-103',
    timestamp: new Date().toISOString(),
    action: 'XSS_ATTEMPT_BLOCKED',
    ip: '203.0.113.42',
    status: 'BLOCKED',
    details: 'Sanitized malicious payload injection in contact form input.'
  }
];

let backupSnapshots = [
  { id: 'BK-2026-03-19', timestamp: '2026-03-19T04:00:00Z', size: '4.2 MB', status: 'VERIFIED' },
  { id: 'BK-2026-03-18', timestamp: '2026-03-18T04:00:00Z', size: '4.1 MB', status: 'VERIFIED' }
];

// Rate limiting tracking map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;

app.use((req, res, next) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    record.count++;
    if (record.count > MAX_REQUESTS) {
      auditLogs.unshift({
        id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
        timestamp: new Date().toISOString(),
        action: 'RATE_LIMIT_EXCEEDED',
        ip: clientIp,
        status: 'BLOCKED',
        details: `Too many requests from ${clientIp}. Rate limit enforced.`
      });
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
  }
  next();
});

// Appointments CRUD API
app.get('/api/appointments', (req, res) => {
  const { phone, code } = req.query;
  if (phone) {
    const filtered = appointments.filter(a => a.phone.includes(String(phone)));
    return res.json(filtered);
  }
  if (code) {
    const found = appointments.find(a => a.id.toLowerCase() === String(code).toLowerCase());
    return res.json(found ? [found] : []);
  }
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const { clientName, phone, email, serviceId, serviceName, barberId, barberName, date, time } = req.body;
  if (!clientName || !phone || !serviceId || !date || !time) {
    return res.status(400).json({ error: 'Missing required appointment fields.' });
  }

  // Input sanitization / basic XSS protection check
  const sanitizedName = String(clientName).replace(/<[^>]*>?/gm, '');
  const sanitizedPhone = String(phone).replace(/<[^>]*>?/gm, '');

  const newAppt: Appointment = {
    id: 'CC-' + Math.floor(Math.random() * 9000 + 1000),
    clientName: sanitizedName,
    phone: sanitizedPhone,
    email: email || '',
    serviceId,
    serviceName: serviceName || 'Haircut & Styling',
    barberId,
    barberName: barberName || 'Master Barber',
    date,
    time,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppt);

  auditLogs.unshift({
    id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
    timestamp: new Date().toISOString(),
    action: 'APPOINTMENT_CREATED',
    ip: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `New booking ${newAppt.id} for ${sanitizedName} (${date} at ${time}).`
  });

  res.status(201).json(newAppt);
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }
  appointments[index].status = 'cancelled';
  auditLogs.unshift({
    id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
    timestamp: new Date().toISOString(),
    action: 'APPOINTMENT_CANCELLED',
    ip: req.ip || '127.0.0.1',
    status: 'WARNING',
    details: `Appointment ${id} cancelled by client/admin.`
  });
  res.json({ success: true, appointment: appointments[index] });
});

// Admin Authentication & Security Endpoints
app.post('/api/admin/login', (req, res) => {
  const { username, password, mfaCode } = req.body;
  // Demo admin credentials: admin / cinematic2026 / mfa: 123456
  if (username === 'admin' && password === 'cinematic2026') {
    if (mfaCode && mfaCode !== '123456') {
      return res.status(400).json({ error: 'Invalid MFA verification code. (Use 123456 for demo)' });
    }
    auditLogs.unshift({
      id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
      timestamp: new Date().toISOString(),
      action: 'ADMIN_LOGIN_SUCCESS',
      ip: req.ip || '127.0.0.1',
      status: 'SUCCESS',
      details: 'Administrator authenticated successfully.'
    });
    return res.json({ success: true, token: 'sec-token-cinematic-99281' });
  }
  auditLogs.unshift({
    id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
    timestamp: new Date().toISOString(),
    action: 'ADMIN_LOGIN_FAILED',
    ip: req.ip || '127.0.0.1',
    status: 'BLOCKED',
    details: `Failed login attempt for username '${username}'.`
  });
  res.status(401).json({ error: 'Invalid admin credentials.' });
});

app.get('/api/admin/audit-logs', (req, res) => {
  res.json(auditLogs);
});

app.get('/api/admin/backups', (req, res) => {
  res.json(backupSnapshots);
});

app.post('/api/admin/backups', (req, res) => {
  const newBackup = {
    id: `BK-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random() * 899 + 100)}`,
    timestamp: new Date().toISOString(),
    size: '4.3 MB',
    status: 'VERIFIED'
  };
  backupSnapshots.unshift(newBackup);
  auditLogs.unshift({
    id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
    timestamp: new Date().toISOString(),
    action: 'MANUAL_BACKUP_CREATED',
    ip: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Database snapshot ${newBackup.id} generated securely.`
  });
  res.json({ success: true, backup: newBackup });
});

// Gemini AI Style Consultant (using @google/genai with high thinking level)
app.post('/api/consultant', async (req, res) => {
  const { prompt, faceShape, hairType, styleGoal, useHighThinking } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    // Using gemini-2.5-flash as requested by high thinking guidelines or user preferences
    const modelName = 'gemini-2.5-flash';

    const systemInstruction = `You are the master style consultant at CinematiCuts, a luxury cinematic barbershop in Hialeah, FL (407 W 29th St). 
    Provide expert, sophisticated, and tailored hair, beard, and grooming recommendations based on client face shape, hair type, and desired look. Keep tone professional, premium, and cinematic.`;

    const userMessage = `Client Details:
    - Face Shape: ${faceShape || 'Oval / Balanced'}
    - Hair Type: ${hairType || 'Straight / Medium density'}
    - Desired Look / Goal: ${styleGoal || prompt || 'Modern clean fade and beard sculpting'}
    
    Provide a tailored cinematic grooming recommendation including:
    1. Recommended Cut / Style Name
    2. Detailed Description & Fading Technique
    3. Maintenance Tips & Recommended Products
    4. Suggested Master Barber at CinematiCuts`;

    const config: any = {
      systemInstruction,
    };

    if (useHighThinking) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userMessage,
      config,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error('Gemini Consultant Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate AI grooming recommendation.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CinematiCuts server running on http://localhost:${PORT}`);
});
