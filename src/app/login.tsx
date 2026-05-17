import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { login as loginAPI } from '../api/auth';
import useAuth from '../hooks/useAuth';
import { useAppTheme } from '../theme';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const decodeBase64 = (base64: string): string | null => {
    try {
      if (typeof globalThis.atob === 'function') {
        return globalThis.atob(base64);
      }

      const maybeBuffer = (globalThis as any).Buffer;
      if (maybeBuffer?.from) {
        return maybeBuffer.from(base64, 'base64').toString('utf-8');
      }

      return null;
    } catch {
      return null;
    }
  };

  const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const decoded = decodeBase64(padded);
      if (!decoded) return null;
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  };

  const normalizeRole = (value: string): string => value.trim().toLowerCase().replace(/^role_/, '');

  const resolveRoleFromToken = (token: string): string => {
    const payload = decodeJwtPayload(token);
    if (!payload) return 'user';

    if (typeof payload.role === 'string' && payload.role.trim()) {
      return normalizeRole(payload.role);
    }

    if (Array.isArray(payload.roles) && typeof payload.roles[0] === 'string') {
      return normalizeRole(String(payload.roles[0]));
    }

    if (Array.isArray(payload.authorities)) {
      const first = payload.authorities[0];
      if (typeof first === 'string' && first.trim()) return normalizeRole(first);
      if (first && typeof first === 'object' && typeof (first as Record<string, unknown>).authority === 'string') {
        return normalizeRole(String((first as Record<string, unknown>).authority));
      }
    }

    return 'user';
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoggingIn(true);
    try {
      const response = await loginAPI({ email: email.trim(), password: senha });
      const role = resolveRoleFromToken(response.tokenAcesso || '');
      const profile = { nome: response.nome, email: response.email, role };
      await signIn(response.tokenAcesso, profile);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      console.error('Erro ao fazer login:', e);
      Alert.alert('Erro', e.response?.data?.message || 'Falha ao fazer login');
      setLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={[styles.inner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.logoWrap}>
            <Image source={require('../../assets/osfacil.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Entrar na oficina</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Acesse para gerenciar ordens, clientes e veiculos</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loggingIn}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={colors.textMuted}
            value={senha}
            onChangeText={setSenha}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            secureTextEntry
            editable={!loggingIn}
          />

          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }, loggingIn && { opacity: 0.6 }]} 
            onPress={handleLogin}
            disabled={loggingIn}
          >
            {loggingIn ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.primarySoft, backgroundColor: colors.primarySoft }]} 
            onPress={() => router.push('/register')}
            disabled={loggingIn}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.primarySoft, backgroundColor: colors.primarySoft, marginTop: 6 }]} 
            onPress={() => router.push('/login-funcionario')}
            disabled={loggingIn}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Entrar como funcionário</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  inner: { width: '100%', maxWidth: 520, alignSelf: 'center', borderWidth: 1, borderRadius: 20, padding: 20 },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logo: { width: 150, height: 150, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 13, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, borderRadius: 12, marginBottom: 12 },
  primaryButton: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { fontWeight: '700' }
});
