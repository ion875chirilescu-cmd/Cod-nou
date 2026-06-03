import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { Appointment, AppointmentStatus } from '@/types';
import { formatDateLong } from '@/utils/dates';
import { colors, radius, spacing } from '@/theme/colors';

type Filter = 'confirmata' | 'finalizata' | 'anulata';

export default function BarberDashboard() {
  const { user } = useAuth();
  const { appointments, updateStatus } = useBookings();
  const [filter, setFilter] = useState<Filter>('confirmata');

  const mine = useMemo(
    () => appointments.filter((a) => a.barberId === user?.barberId),
    [appointments, user?.barberId]
  );

  const filtered = useMemo(
    () =>
      mine
        .filter((a) => a.status === filter)
        .sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1)),
    [mine, filter]
  );

  const counts = useMemo(
    () => ({
      confirmata: mine.filter((a) => a.status === 'confirmata').length,
      finalizata: mine.filter((a) => a.status === 'finalizata').length,
      anulata: mine.filter((a) => a.status === 'anulata').length,
    }),
    [mine]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Bună ziua,</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <Text style={{ fontSize: 32 }}>💈</Text>
      </View>

      <View style={styles.tabs}>
        <FilterTab label="Active" value="confirmata" count={counts.confirmata} active={filter} onPress={setFilter} />
        <FilterTab label="Finalizate" value="finalizata" count={counts.finalizata} active={filter} onPress={setFilter} />
        <FilterTab label="Anulate" value="anulata" count={counts.anulata} active={filter} onPress={setFilter} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, flexGrow: 1 }}
        ListEmptyComponent={<Empty filter={filter} />}
        renderItem={({ item }) => (
          <ApptCard item={item} onUpdate={updateStatus} />
        )}
      />
    </SafeAreaView>
  );
}

function FilterTab({
  label,
  value,
  count,
  active,
  onPress,
}: {
  label: string;
  value: Filter;
  count: number;
  active: Filter;
  onPress: (f: Filter) => void;
}) {
  const isActive = active === value;
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.tabActive]}
      onPress={() => onPress(value)}
      activeOpacity={0.85}
    >
      <Text style={[styles.tabText, isActive && { color: colors.background }]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

function ApptCard({
  item,
  onUpdate,
}: {
  item: Appointment;
  onUpdate: (id: string, status: AppointmentStatus) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.client}>{item.clientName}</Text>
          <Text style={styles.service}>{item.serviceName} · {item.price} lei</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
          <Text style={styles.metaText}>{formatDateLong(item.date)}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={15} color={colors.textMuted} />
          <Text style={styles.metaText}>{item.time}</Text>
        </View>
      </View>

      {item.status === 'confirmata' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.doneBtn]}
            onPress={() => onUpdate(item.id, 'finalizata')}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Finalizează</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => onUpdate(item.id, 'anulata')}
          >
            <Ionicons name="close-circle-outline" size={18} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Anulează</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Empty({ filter }: { filter: Filter }) {
  const text =
    filter === 'confirmata'
      ? 'Nu ai programări active momentan.'
      : filter === 'finalizata'
      ? 'Nicio programare finalizată încă.'
      : 'Nicio programare anulată.';
  return (
    <View style={styles.empty}>
      <Ionicons name="cafe-outline" size={48} color={colors.textMuted} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  hello: { color: colors.textMuted, fontSize: 15 },
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  tabs: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
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
  client: { color: colors.text, fontSize: 16, fontWeight: '700' },
  service: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: spacing.lg },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: colors.textMuted, fontSize: 13 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  doneBtn: { borderColor: colors.success },
  cancelBtn: { borderColor: colors.danger },
  actionText: { fontWeight: '700', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl },
  emptyText: { color: colors.textMuted, textAlign: 'center' },
});
