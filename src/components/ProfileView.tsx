import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme/colors';

interface Stat {
  label: string;
  value: string | number;
}

export function ProfileView({ stats }: { stats: Stat[] }) {
  const { user, logout } = useAuth();

  function confirmLogout() {
    Alert.alert('Deconectare', 'Sigur vrei să ieși din cont?', [
      { text: 'Anulează', style: 'cancel' },
      { text: 'Ieși', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.head}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 40 }}>{user?.role === 'barber' ? '💈' : '🧑'}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleTag}>
            <Ionicons
              name={user?.role === 'barber' ? 'cut-outline' : 'person-outline'}
              size={14}
              color={colors.primary}
            />
            <Text style={styles.roleText}>{user?.role === 'barber' ? 'Frizer' : 'Client'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menu}>
          <MenuItem icon="notifications-outline" label="Notificări" />
          <MenuItem icon="card-outline" label="Metode de plată" />
          <MenuItem icon="help-circle-outline" label="Ajutor și suport" />
          <MenuItem icon="information-circle-outline" label="Despre aplicație" />
        </View>

        <Button title="Deconectare" variant="outline" onPress={confirmLogout} />
        <Text style={styles.version}>Select Barber · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.menuItem}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  head: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  email: { color: colors.textMuted, marginTop: 2 },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4, textAlign: 'center' },
  menu: { gap: 2, marginBottom: spacing.lg },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuLabel: { flex: 1, color: colors.text, fontSize: 15 },
  version: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg, fontSize: 12 },
});
