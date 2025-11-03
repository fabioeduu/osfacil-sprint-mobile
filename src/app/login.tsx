import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const usersJson = await AsyncStorage.getItem('@osfacil:users');
        const users = usersJson ? JSON.parse(usersJson) as Array<any> : [];
        if (users.length === 0) {
          const admin = { email: 'admin@osfacil', senha: 'admin123', nome: 'Administrador', role: 'admin' };
          await AsyncStorage.setItem('@osfacil:users', JSON.stringify([admin]));
        }

        const token = await AsyncStorage.getItem('@osfacil:token');
        if (token) {
          router.replace('/(tabs)/home');
          return;
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possivel fazer login');
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem('@osfacil:users');
      const users = usersJson ? JSON.parse(usersJson) as Array<any> : [];
      if (!users || users.length === 0) {
        Alert.alert('Erro', 'Conta não encontrada. Cadastre-se primeiro.');
        return router.push('/register');
      }
      const user = users.find(u => u.email === email.trim() && u.senha === senha);
      if (!user) {
        Alert.alert('Erro', 'Email ou senha inválidos');
        return;
      }

      await AsyncStorage.setItem('@osfacil:token', JSON.stringify({ email: user.email, role: user.role }));
      const profile = { nome: user.nome || '', email: user.email, role: user.role };
      await AsyncStorage.setItem('@osfacil:profile', JSON.stringify(profile));
      router.replace('/(tabs)/home');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível efetuar login');
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
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#666"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
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
