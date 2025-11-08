import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginAPI } from '../api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('@osfacil:token');
        if (token) {
          router.replace('/(tabs)/home');
          return;
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível verificar autenticação');
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoggingIn(true);
    try {
      const response = await loginAPI({ email: email.trim(), password: senha });
      await AsyncStorage.setItem('@osfacil:token', response.tokenAcesso);
      const profile = { nome: response.nome, email: response.email, role: 'user' };
      await AsyncStorage.setItem('@osfacil:profile', JSON.stringify(profile));
      router.replace('/(tabs)/home');
    } catch (e: any) {
      console.error('Erro ao fazer login:', e);
      Alert.alert('Erro', e.response?.data?.message || 'Falha ao fazer login');
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2596be" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.inner}>
          <View style={styles.logoWrap}>
            <Image source={require('../../assets/osfacil.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Entrar</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loggingIn}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#666"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            secureTextEntry
            editable={!loggingIn}
          />

          <TouchableOpacity 
            style={[styles.primaryButton, loggingIn && { opacity: 0.6 }]} 
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
            style={styles.secondaryButton} 
            onPress={() => router.push('/register')}
            disabled={loggingIn}
          >
            <Text style={styles.secondaryButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#F5F5F5' },
  inner: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logo: { width: 240, height: 240, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#222' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff', color: '#222' },
  primaryButton: { backgroundColor: '#6BC0A9', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#6BC0A9', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10, backgroundColor: '#fff' },
  secondaryButtonText: { color: '#6BC0A9', fontWeight: '600' }
});
