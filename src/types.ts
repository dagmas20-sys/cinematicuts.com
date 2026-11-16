export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: 'hair' | 'beard' | 'combo' | 'luxury';
  popular?: boolean;
}

export interface BarberItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  rating: number;
  imageKey: string;
}

export interface Appointment {
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

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  status: 'SUCCESS' | 'BLOCKED' | 'WARNING';
  details: string;
}
