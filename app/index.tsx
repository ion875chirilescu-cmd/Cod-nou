import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

/** Ecran de intrare: redirecționează în funcție de starea de autentificare. */
export default function Index() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <Redirect href={user.role === 'barber' ? '/(barber)' : '/(client)'} />;
}
