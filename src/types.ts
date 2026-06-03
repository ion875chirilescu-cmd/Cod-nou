export type Role = 'client' | 'barber';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  /** Pentru utilizatorii cu rol de frizer: id-ul profilului de frizer asociat. */
  barberId?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number; // în lei
  duration: number; // în minute
  icon: string; // nume icon Ionicons
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  emoji: string; // avatar simplu
  bio: string;
  serviceIds: string[];
}

export type AppointmentStatus = 'confirmata' | 'finalizata' | 'anulata';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  status: AppointmentStatus;
  createdAt: number;
}
