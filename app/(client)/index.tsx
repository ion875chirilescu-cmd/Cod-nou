import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { BARBERS, SERVICES } from '@/data/mockData';
import { Barber, Service } from '@/types';
import { colors, radius, spacing } from '@/theme/colors';

export default function ClientHome() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Salut,</Text>
            <Text style={styles.name}>{user?.name} 👋</Text>
          </View>
          <Text style={styles.logo}>💈</Text>
        </View>

        <Text style={styles.sectionTitle}>Servicii</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesRow}
        >
          {SERVICES.map((s) => (
            <ServiceChip key={s.id} service={s} />
          ))}
        </ScrollView>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Frizerii noștri</Text>
          <Text style={styles.count}>{BARBERS.length} disponibili</Text>
        </View>

        <FlatList
          data={BARBERS}
          scrollEnabled={false}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          renderItem={({ item }) => (
            <BarberCard barber={item} onPress={() => router.push(`/barber/${item.id}`)} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ServiceChip({ service }: { service: Service }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={service.icon as any} size={22} color={colors.primary} />
      <Text style={styles.chipName}>{service.name}</Text>
      <Text style={styles.chipPrice}>{service.price} lei</Text>
    </View>
  );
}

function BarberCard({ barber, onPress }: { barber: Barber; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={{ fontSize: 30 }}>{barber.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{barber.name}</Text>
        <Text style={styles.cardSpecialty}>{barber.specialty}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.primary} />
          <Text style={styles.rating}>{barber.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({barber.reviews} recenzii)</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  hello: { color: colors.textMuted, fontSize: 16 },
  name: { color: colors.text, fontSize: 24, fontWeight: '800' },
  logo: { fontSize: 36 },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingRight: spacing.lg,
  },
  count: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  servicesRow: { paddingHorizontal: spacing.lg, gap: spacing.md, paddingVertical: spacing.xs },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    width: 120,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  chipName: { color: colors.text, fontWeight: '600', fontSize: 14 },
  chipPrice: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardSpecialty: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  rating: { color: colors.text, fontWeight: '700', fontSize: 13 },
  reviews: { color: colors.textMuted, fontSize: 12 },
});
