import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { register as registerAPI } from '../api/auth';
import { useAppTheme } from '../theme';

export default function RegisterPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
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
    if (rawTelefone.length < 10 || rawTelefone.length > 11) {
      setError('Telefone inválido. Informe DDD + número (10 ou 11 dígitos).');
      Alert.alert('Erro', 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos).');
      return;
    }

    setLoading(true);
    try {
      await registerAPI({
        email: email.trim(),
        password: senha,
        nome: nome.trim(),
        cpf: rawCpf,
        telefone: rawTelefone,
        endereco: endereco.trim(),
      });
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login agora.');
      router.replace('/login');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setError(error.response?.data?.message || 'Erro ao registrar');
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao registrar');
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={[styles.inner, { backgroundColor: colors.surface, borderColor: colors.border }] }>

          <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            placeholder="Nome"
            placeholderTextColor={colors.textMuted}
            value={nome}
            onChangeText={setNome}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            keyboardType="default"
            autoCapitalize="words"
          />


          <TextInput
            placeholder="CPF"
            placeholderTextColor={colors.textMuted}
            value={cpf}
            onChangeText={(text) => setCpf(formatCpf(text))}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={14}
          />


          <TextInput
            placeholder="Telefone"
            placeholderTextColor={colors.textMuted}
            value={telefone}
            onChangeText={(text) => setTelefone(formatTelefone(text))}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            keyboardType="phone-pad"
            autoCapitalize="none"
            maxLength={16}
          />


          <TextInput
            placeholder="Endereço"
            placeholderTextColor={colors.textMuted}
            value={endereco}
            onChangeText={setEndereco}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            keyboardType="default"
            autoCapitalize="words"
          />


          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor={colors.textMuted}
            value={senha}
            onChangeText={setSenha}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            secureTextEntry
          />

          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor={colors.textMuted}
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt }]}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }, loading ? styles.primaryButtonDisabled : null]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Cadastrar</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.primarySoft, backgroundColor: colors.primarySoft }]} onPress={() => router.replace('/login')}>
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  inner: { width: '100%', maxWidth: 520, alignSelf: 'center', borderWidth: 1, borderRadius: 20, padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, borderRadius: 12, marginBottom: 12 },
  primaryButton: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  primaryButtonDisabled: { opacity: 0.6 },
  errorText: { color: '#c0392b', textAlign: 'center', marginBottom: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { fontWeight: '700' }
});
