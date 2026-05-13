import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { login as loginAPI } from '../api/auth';
import useAuth from '../hooks/useAuth';
import { useAppTheme } from '../theme';

export default function LoginFuncionarioPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

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
      
      const profile = { nome: response.nome, email: response.email, role: 'funcionario' };
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
          <Text style={[styles.title, { color: colors.text }]}>Entrar como Funcionário</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Acesse para gerenciar ordens e dados da oficina</Text>
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
            onPress={() => router.push('/register-funcionario')}
            disabled={loggingIn}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Cadastrar funcionário</Text>
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
