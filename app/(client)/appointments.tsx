import React, { useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { getBarber } from '@/data/mockData';
import { Appointment } from '@/types';
import { formatDateLong } from '@/utils/dates';
import { colors, radius, spacing } from '@/theme/colors';

export default function ClientAppointments() {
  const { user } = useAuth();
  const { appointments, updateStatus } = useBookings();

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.clientId === user?.id)
        .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1)),
    [appointments, user?.id]
  );

  function confirmCancel(appt: Appointment) {
    Alert.alert('Anulează programarea', 'Sigur vrei să anulezi această programare?', [
      { text: 'Nu', style: 'cancel' },
      {
        text: 'Da, anulează',
        style: 'destructive',
        onPress: () => updateStatus(appt.id, 'anulata'),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Programările mele</Text>
      <FlatList
        data={mine}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, flexGrow: 1 }}
        ListEmptyComponent={<Empty />}
        renderItem={({ item }) => {
          const barber = getBarber(item.barberId);
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 24 }}>{barber?.emoji ?? '💈'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.service}>{item.serviceName}</Text>
                  <Text style={styles.barber}>cu {item.barberName}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.metaRow}>
                <Meta icon="calendar-outline" text={formatDateLong(item.date)} />
                <Meta icon="time-outline" text={item.time} />
                <Meta icon="pricetag-outline" text={`${item.price} lei`} />
              </View>

              {item.status === 'confirmata' && (
                <TouchableOpacity style={styles.cancelBtn} onPress={() => confirmCancel(item)}>
                  <Ionicons name="close-circle-outline" size={18} color={colors.danger} />
                  <Text style={styles.cancelText}>Anulează</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function Meta({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={15} color={colors.textMuted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function Empty() {
  return (
    <View style={styles.empty}>
      <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>Nicio programare încă</Text>
      <Text style={styles.emptyText}>Alege un frizer din tab-ul Acasă și rezervă o programare.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    padding: spacing.lg,
    paddingBottom: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  service: { color: colors.text, fontSize: 16, fontWeight: '700' },
  barber: { color: colors.textMuted, fontSize: 13 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: colors.textMuted, fontSize: 13 },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  cancelText: { color: colors.danger, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
