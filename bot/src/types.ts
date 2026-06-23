/** Tipuri de date pentru SELECT BOT. Aliniate cu aplicația mobilă Select Barber. */

export type AppointmentStatus = 'confirmata' | 'finalizata' | 'anulata';

export interface Appointment {
  id: string;
  clientName: string;
  phone?: string;
  service: string;
  barber: string;
  price: number; // lei
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  status: AppointmentStatus;
  createdAt: number;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  visits: number;
  totalSpent: number; // lei
  createdAt: number;
}

export type StudentStatus = 'activ' | 'absolvit' | 'retras';

export interface Student {
  id: string;
  name: string;
  phone?: string;
  course: string;
  totalFee: number; // taxa totală a cursului, lei
  paid: number; // cât a achitat până acum, lei
  status: StudentStatus;
  enrolledAt: number;
}

export interface Course {
  id: string;
  name: string;
  price: number; // lei
  durationWeeks: number;
}

export interface Service {
  id: string;
  name: string;
  price: number; // lei
  duration: number; // minute
}

/** Un canal Telegram legat de o funcție/departament. */
export interface ChannelLink {
  chatId: number;
  title: string;
}

/** O rubrică (topic) dintr-un grup-forum, legată de o funcție. */
export interface TopicLink {
  chatId: number;
  threadId: number;
  name: string;
}

export interface Database {
  appointments: Appointment[];
  clients: Client[];
  students: Student[];
  courses: Course[];
  services: Service[];
  barbers: string[];
  /** Canalele legate, pe id de funcție (departament). */
  channels: Record<string, ChannelLink>;
  /** Rubricile (topics) din grup, pe id de funcție. */
  topics: Record<string, TopicLink>;
}
