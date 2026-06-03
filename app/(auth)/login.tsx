import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme/colors';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email || !password) {
      setError('Completează emailul și parola.');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err);
    // La succes, redirecționarea e gestionată de layout-ul rădăcină.
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>💈</Text>
            <Text style={styles.brand}>SELECT BARBER</Text>
            <Text style={styles.tagline}>Programări rapide la cei mai buni frizeri</Text>
          </View>

          <View style={styles.form}>
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

            <Button title="Autentificare" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />

            <View style={styles.registerRow}>
              <Text style={styles.muted}>Nu ai cont?</Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}> Creează unul</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Conturi demo</Text>
            <Text style={styles.demoText}>Client: client@demo.com · 1234</Text>
            <Text style={styles.demoText}>Frizer: frizer@demo.com · 1234</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FieldProps extends React.ComponentProps<typeof TextInput> {
  icon: keyof typeof Ionicons.glyphMap;
}

export function Field({ icon, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logoEmoji: { fontSize: 56 },
  brand: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: spacing.sm,
  },
  tagline: { color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
  form: { gap: spacing.md },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  input: { flex: 1, color: colors.text, paddingVertical: 14, fontSize: 16 },
  error: { color: colors.danger, fontSize: 14 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  muted: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '700' },
  demoBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: { color: colors.primary, fontWeight: '700', marginBottom: spacing.xs },
  demoText: { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
});
