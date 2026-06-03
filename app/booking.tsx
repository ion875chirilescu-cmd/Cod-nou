import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { getBarber, SERVICES } from '@/data/mockData';
import { nextDays, timeSlots } from '@/utils/dates';
import { colors, radius, spacing } from '@/theme/colors';

export default function Booking() {
  const { barberId, serviceId } = useLocalSearchParams<{
    barberId: string;
    serviceId?: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addAppointment, isSlotTaken } = useBookings();

  const barber = getBarber(barberId);
  const services = useMemo(
    () => SERVICES.filter((s) => barber?.serviceIds.includes(s.id)),
    [barber]
  );
  const days = useMemo(() => nextDays(14), []);
  const slots = useMemo(() => timeSlots(), []);

  const [selectedService, setSelectedService] = useState<string | undefined>(serviceId);
  const [selectedDay, setSelectedDay] = useState(days[0]?.iso);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  if (!barber) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Frizerul nu a fost găsit.</Text>
      </SafeAreaView>
    );
  }

  const service = services.find((s) => s.id === selectedService);
  const canConfirm = selectedService && selectedDay && selectedTime;

  async function onConfirm() {
    if (!canConfirm || !service || !user || !barber) return;
    if (isSlotTaken(barber.id, selectedDay!, selectedTime!)) {
      Alert.alert('Slot ocupat', 'Acest interval este deja rezervat. Alege altul.');
      return;
    }
    setSaving(true);
    await addAppointment({
      clientId: user.id,
      clientName: user.name,
      barberId: barber.id,
      barberName: barber.name,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      date: selectedDay!,
      time: selectedTime!,
    });
    setSaving(false);
    Alert.alert('Programare confirmată! ✅', `${service.name} cu ${barber.name}`, [
      { text: 'Vezi programările', onPress: () => router.replace('/(client)/appointments') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Rezervare</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        <View style={styles.barberRow}>
          <Text style={{ fontSize: 28 }}>{barber.emoji}</Text>
          <View>
            <Text style={styles.barberName}>{barber.name}</Text>
            <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
          </View>
        </View>

        {/* Pas 1: serviciu */}
        <Text style={styles.step}>1. Alege serviciul</Text>
        <View style={{ gap: spacing.sm }}>
          {services.map((s) => {
            const active = s.id === selectedService;
            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.85}
                style={[styles.serviceRow, active && styles.activeBorder]}
                onPress={() => setSelectedService(s.id)}
              >
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={active ? colors.primary : colors.textMuted}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceDuration}>{s.duration} min</Text>
                </View>
                <Text style={styles.servicePrice}>{s.price} lei</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pas 2: ziua */}
        <Text style={styles.step}>2. Alege ziua</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {days.map((d) => {
            const active = d.iso === selectedDay;
            return (
              <TouchableOpacity
                key={d.iso}
                activeOpacity={0.85}
                style={[styles.dayCard, active && styles.dayCardActive]}
                onPress={() => {
                  setSelectedDay(d.iso);
                  setSelectedTime(undefined);
                }}
              >
                <Text style={[styles.dayWeekday, active && { color: colors.background }]}>
                  {d.isToday ? 'Azi' : d.weekday}
                </Text>
                <Text style={[styles.dayNum, active && { color: colors.background }]}>{d.day}</Text>
                <Text style={[styles.dayMonth, active && { color: colors.background }]}>{d.month}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Pas 3: ora */}
        <Text style={styles.step}>3. Alege ora</Text>
        <View style={styles.slotGrid}>
          {slots.map((t) => {
            const taken = isSlotTaken(barber.id, selectedDay!, t);
            const active = t === selectedTime;
            return (
              <TouchableOpacity
                key={t}
                activeOpacity={0.85}
                disabled={taken}
                style={[
                  styles.slot,
                  active && styles.slotActive,
                  taken && styles.slotTaken,
                ]}
                onPress={() => setSelectedTime(t)}
              >
                <Text
                  style={[
                    styles.slotText,
                    active && { color: colors.background },
                    taken && { color: colors.textMuted, textDecorationLine: 'line-through' },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {service && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>{service.name}</Text>
            <Text style={styles.summaryPrice}>{service.price} lei</Text>
          </View>
        )}
        <Button
          title={canConfirm ? 'Confirmă programarea' : 'Completează pașii'}
          onPress={onConfirm}
          loading={saving}
          disabled={!canConfirm}
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
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barberName: { color: colors.text, fontWeight: '700', fontSize: 16 },
  barberSpecialty: { color: colors.textMuted, fontSize: 13 },
  step: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  activeBorder: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  serviceName: { color: colors.text, fontWeight: '600', fontSize: 15 },
  serviceDuration: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  servicePrice: { color: colors.primary, fontWeight: '700' },
  dayCard: {
    width: 64,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 2,
  },
  dayCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayWeekday: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  dayNum: { color: colors.text, fontSize: 20, fontWeight: '800' },
  dayMonth: { color: colors.textMuted, fontSize: 11 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotTaken: { backgroundColor: colors.background, opacity: 0.5 },
  slotText: { color: colors.text, fontWeight: '600', fontSize: 14 },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { color: colors.textMuted },
  summaryPrice: { color: colors.text, fontWeight: '800', fontSize: 18 },
});
