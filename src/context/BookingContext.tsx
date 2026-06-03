import React, { createContext, useContext, useEffect, useState } from 'react';
import { KEYS, storage } from '@/storage';
import { Appointment, AppointmentStatus } from '@/types';

interface BookingState {
  appointments: Appointment[];
  loading: boolean;
  addAppointment: (
    data: Omit<Appointment, 'id' | 'status' | 'createdAt'>
  ) => Promise<Appointment>;
  updateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  /** Verifică dacă un slot (frizer + dată + oră) este deja ocupat. */
  isSlotTaken: (barberId: string, date: string, time: string) => boolean;
}

const BookingContext = createContext<BookingState | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await storage.get<Appointment[]>(KEYS.appointments, []);
      setAppointments(saved);
      setLoading(false);
    })();
  }, []);

  async function persist(next: Appointment[]) {
    setAppointments(next);
    await storage.set(KEYS.appointments, next);
  }

  async function addAppointment(
    data: Omit<Appointment, 'id' | 'status' | 'createdAt'>
  ): Promise<Appointment> {
    const appt: Appointment = {
      ...data,
      id: `a-${Date.now()}`,
      status: 'confirmata',
      createdAt: Date.now(),
    };
    await persist([appt, ...appointments]);
    return appt;
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    const next = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    await persist(next);
  }

  function isSlotTaken(barberId: string, date: string, time: string) {
    return appointments.some(
      (a) =>
        a.barberId === barberId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'anulata'
    );
  }

  return (
    <BookingContext.Provider
      value={{ appointments, loading, addAppointment, updateStatus, isSlotTaken }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings trebuie folosit în interiorul BookingProvider');
  return ctx;
}
