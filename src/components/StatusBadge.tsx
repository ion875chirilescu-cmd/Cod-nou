import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { AppointmentStatus } from '@/types';

const LABELS: Record<AppointmentStatus, string> = {
  confirmata: 'Confirmată',
  finalizata: 'Finalizată',
  anulata: 'Anulată',
};

const COLORS: Record<AppointmentStatus, string> = {
  confirmata: colors.success,
  finalizata: colors.textMuted,
  anulata: colors.danger,
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <View style={[styles.badge, { borderColor: COLORS[status] }]}>
      <View style={[styles.dot, { backgroundColor: COLORS[status] }]} />
      <Text style={[styles.text, { color: COLORS[status] }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '600' },
});
