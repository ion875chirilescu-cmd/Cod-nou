import React, { useMemo } from 'react';
import { ProfileView } from '@/components/ProfileView';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';

export default function ClientProfile() {
  const { user } = useAuth();
  const { appointments } = useBookings();

  const stats = useMemo(() => {
    const mine = appointments.filter((a) => a.clientId === user?.id);
    const active = mine.filter((a) => a.status === 'confirmata').length;
    const done = mine.filter((a) => a.status === 'finalizata').length;
    return [
      { label: 'Total', value: mine.length },
      { label: 'Active', value: active },
      { label: 'Finalizate', value: done },
    ];
  }, [appointments, user?.id]);

  return <ProfileView stats={stats} />;
}
