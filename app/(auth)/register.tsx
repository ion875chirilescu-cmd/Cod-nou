import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import { colors, radius, spacing } from '@/theme/colors';
import { Field } from './login';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!name || !email || !password) {
      setError('Completează toate câmpurile.');
      return;
    }
    if (password.length < 4) {
      setError('Parola trebuie să aibă cel puțin 4 caractere.');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await register({ name, email, password, role });
    setLoading(false);
    if (err) setError(err);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Creează cont</Text>
          <Text style={styles.subtitle}>Alătură-te comunității Select Barber</Text>

          <View style={styles.roleRow}>
            <RoleCard
              active={role === 'client'}
              icon="person-outline"
              label="Client"
              desc="Vreau să rezerv"
              onPress={() => setRole('client')}
            />
            <RoleCard
              active={role === 'barber'}
              icon="cut-outline"
              label="Frizer"
              desc="Ofer servicii"
              onPress={() => setRole('barber')}
            />
          </View>

          <View style={styles.form}>
            <Field icon="person-outline" placeholder="Nume complet" value={name} onChangeText={setName} />
            <Field
              icon="mail-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field
              icon="lock-closed-outline"
              placeholder="Parolă"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Button title="Înregistrare" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />

            <View style={styles.loginRow}>
              <Text style={styles.muted}>Ai deja cont?</Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}> Autentifică-te</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RoleCard({
  active,
  icon,
  label,
  desc,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.roleCard, active && styles.roleCardActive]}
    >
      <Ionicons name={icon} size={26} color={active ? colors.primary : colors.textMuted} />
      <Text style={[styles.roleLabel, active && { color: colors.text }]}>{label}</Text>
      <Text style={styles.roleDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  roleRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  roleCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  roleCardActive: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  roleLabel: { color: colors.textMuted, fontWeight: '700', fontSize: 16 },
  roleDesc: { color: colors.textMuted, fontSize: 12 },
  form: { gap: spacing.md },
  error: { color: colors.danger, fontSize: 14 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  muted: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '700' },
});
