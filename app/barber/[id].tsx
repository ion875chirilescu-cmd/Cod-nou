import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { getBarber, SERVICES } from '@/data/mockData';
import { colors, radius, spacing } from '@/theme/colors';

export default function BarberDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const barber = getBarber(id);

  if (!barber) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Frizerul nu a fost găsit.</Text>
      </SafeAreaView>
    );
  }

  const services = SERVICES.filter((s) => barber.serviceIds.includes(s.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profil frizer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 48 }}>{barber.emoji}</Text>
          </View>
          <Text style={styles.name}>{barber.name}</Text>
          <Text style={styles.specialty}>{barber.specialty}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.primary} />
            <Text style={styles.rating}>{barber.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>· {barber.reviews} recenzii</Text>
          </View>
        </View>

        <View style={styles.bioBox}>
          <Text style={styles.bio}>{barber.bio}</Text>
        </View>

        <Text style={styles.sectionTitle}>Servicii oferite</Text>
        <View style={{ gap: spacing.sm }}>
          {services.map((s) => (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.85}
              style={styles.serviceRow}
              onPress={() => router.push(`/booking?barberId=${barber.id}&serviceId=${s.id}`)}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name={s.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceDuration}>{s.duration} min</Text>
              </View>
              <Text style={styles.servicePrice}>{s.price} lei</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Rezervă o programare"
          onPress={() => router.push(`/booking?barberId=${barber.id}`)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  notFound: { color: colors.text, textAlign: 'center', marginTop: spacing.xl },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  topTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: { color: colors.text, fontSize: 24, fontWeight: '800' },
  specialty: { color: colors.textMuted, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  rating: { color: colors.text, fontWeight: '700' },
  reviews: { color: colors.textMuted },
  bioBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  bio: { color: colors.textMuted, lineHeight: 21 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.sm },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: { color: colors.text, fontWeight: '600', fontSize: 15 },
  serviceDuration: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  servicePrice: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
