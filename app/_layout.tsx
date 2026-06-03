import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import { colors } from '@/theme/colors';

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const root = segments[0];
    const inAuth = root === '(auth)';

    if (!user) {
      if (!inAuth) router.replace('/login');
      return;
    }
    // Utilizator logat aflat încă pe ecranele de autentificare -> mergem acasă.
    if (inAuth) {
      router.replace(user.role === 'barber' ? '/(barber)' : '/(client)');
      return;
    }
    // Împiedicăm accesul încrucișat între rolurile client / frizer.
    if (user.role === 'client' && root === '(barber)') router.replace('/(client)');
    if (user.role === 'barber' && root === '(client)') router.replace('/(barber)');
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <BookingProvider>
          <RootNavigator />
        </BookingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
