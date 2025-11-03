import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleRegister = async () => {
    setError('');
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirm.trim()) {
      setError('Preencha todos os campos obrigatórios');
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (senha !== confirm) {
      setError('As senhas não coincidem');
      Alert.alert('Erro', 'Senhas não coincidem');
      return;
    }

    const rawCpf = cpf.replace(/\D/g, '');
    const rawTelefone = telefone.replace(/\D/g, '');
    if (rawCpf.length !== 11) {
      setError('CPF inválido. Informe 11 dígitos.');
      Alert.alert('Erro', 'CPF inválido. Informe 11 dígitos.');
      return;
    }
    if (rawTelefone.length < 10) {
      setError('Telefone inválido. Informe ao menos DDD + número.');
      Alert.alert('Erro', 'Telefone inválido. Informe ao menos DDD + número.');
      return;
    }

    setLoading(true);
    try {
      const usersJson = await AsyncStorage.getItem('@osfacil:users');
      const users = usersJson ? JSON.parse(usersJson) as Array<any> : [];
      const exists = users.find((u: any) => u.email === email.trim());
      if (exists) {
        setError('Já existe uma conta com esse email');
        Alert.alert('Erro', 'Já existe uma conta com esse email');
        setLoading(false);
        return;
      }

      const profile = {
        nome: nome.trim(),
        email: email.trim(),
        endereco: endereco.trim(),
        cpf: rawCpf,
        telefone: rawTelefone,
        cpfFormatado: formatCpf(rawCpf),
        telefoneFormatado: formatTelefone(rawTelefone),
        role: 'user',
      } as const;

  users.push({ ...profile, senha });
      await AsyncStorage.setItem('@osfacil:users', JSON.stringify(users));

      await AsyncStorage.setItem('@osfacil:profile', JSON.stringify(profile));

      await AsyncStorage.setItem('@osfacil:token', JSON.stringify({ email: email.trim(), role: 'user' }));

      router.replace('/(tabs)/home');
    } catch (e) {
      console.error('register error', e);
      Alert.alert('Erro', 'Não foi possível cadastrar');
      setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  
  const onlyDigits = (s: string) => s.replace(/\D/g, '');

  const formatCpf = (text: string) => {
    const digits = onlyDigits(text).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
    return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9,11)}`;
  };

  const formatTelefone = (text: string) => {
    const digits = onlyDigits(text).slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
   
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.inner}>

          <Text style={styles.title}>Cadastre-se</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            placeholder="Nome"
            placeholderTextColor="#666"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            keyboardType="default"
            autoCapitalize="words"
          />


          <TextInput
            placeholder="CPF"
            placeholderTextColor="#666"
            value={cpf}
            onChangeText={(text) => setCpf(formatCpf(text))}
            style={styles.input}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={14}
          />


          <TextInput
            placeholder="Telefone"
            placeholderTextColor="#666"
            value={telefone}
            onChangeText={(text) => setTelefone(formatTelefone(text))}
            style={styles.input}
            keyboardType="phone-pad"
            autoCapitalize="none"
            maxLength={16}
          />


          <TextInput
            placeholder="Endereço"
            placeholderTextColor="#666"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
            keyboardType="default"
            autoCapitalize="words"
          />


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

          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#666"
            value={confirm}
            onChangeText={setConfirm}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading ? styles.primaryButtonDisabled : null]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Cadastrar</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/login')}>
            <Text style={styles.secondaryButtonText}>Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#F5F5F5' },
  inner: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#222' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff', color: '#222' },
  primaryButton: { backgroundColor: '#6BC0A9', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  primaryButtonDisabled: { opacity: 0.6 },
  errorText: { color: '#c0392b', textAlign: 'center', marginBottom: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#6BC0A9', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10, backgroundColor: '#fff' },
  secondaryButtonText: { color: '#6BC0A9', fontWeight: '600' }
});
