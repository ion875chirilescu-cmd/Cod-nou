import React, { useMemo } from 'react';
import { ProfileView } from '@/components/ProfileView';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';

export default function BarberProfile() {
  const { user } = useAuth();
  const { appointments } = useBookings();

  const stats = useMemo(() => {
    const mine = appointments.filter((a) => a.barberId === user?.barberId);
    const active = mine.filter((a) => a.status === 'confirmata').length;
    const done = mine.filter((a) => a.status === 'finalizata').length;
    const revenue = mine
      .filter((a) => a.status === 'finalizata')
      .reduce((sum, a) => sum + a.price, 0);
    return [
      { label: 'Active', value: active },
      { label: 'Finalizate', value: done },
      { label: 'Încasări (lei)', value: revenue },
    ];
  }, [appointments, user?.barberId]);

  return <ProfileView stats={stats} />;
}
