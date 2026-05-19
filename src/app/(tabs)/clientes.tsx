import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import Container from "../../components/Container";
import { useClientes } from '../../hooks';
import useAuth from "../../hooks/useAuth";
import { useLocalSearchParams, Redirect } from "expo-router";
import { Cliente } from '../../types';
import { useAppTheme } from '../../theme';

type Tab = 'listar' | 'criar' | 'editar';

export default function ClientesPage() {
  const { colors } = useAppTheme();
  const { id: queryId } = useLocalSearchParams();
  const auth = useAuth();
  
  
  if (auth.role && !['funcionario', 'admin'].includes(auth.role.toLowerCase())) {
    return <Redirect href="/(tabs)/perfil" />;
  }
  
  const [tab, setTab] = useState<Tab>('listar');
  const { clientes, loading, criar, atualizar, remover } = useClientes();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editCpf, setEditCpf] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSenha, setEditSenha] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editEndereco, setEditEndereco] = useState('');

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

  
  React.useEffect(() => {
    let mounted = true;
    const check = async () => {
      
      if (loading) return;
      if (!mounted) return;
      if (queryId) {
        const c = clientes.find(c => c.id === String(queryId));
        if (c) {
          setSelectedCliente(c);
          setEditNome(c.nome);
          setEditCpf(c.cpf || '');
          setEditEmail(c.email || '');
          setEditSenha(c.senha || '');
          setEditTelefone(c.telefone || '');
          setEditEndereco(c.endereco || '');
          setTab('editar');
        }
      }
    };
    check();
    return () => { mounted = false; };
  }, [queryId, loading, clientes]);

  const salvarNovo = async () => {
    try {
      const rawCpf = onlyDigits(cpf);
      const rawTelefone = onlyDigits(telefone);
      if (!nome.trim()) {
        Alert.alert('Erro', 'Preencha o nome');
        return;
      }
      if (!cpf.trim() || !email.trim() || !senha.trim() || !telefone.trim() || !endereco.trim()) {
        Alert.alert('Erro', 'CPF, email, senha, telefone e endereco sao obrigatorios');
        return;
      }
      if (rawCpf.length !== 11) {
        Alert.alert('Erro', 'CPF inválido. Informe 11 dígitos.');
        return;
      }
      if (rawTelefone.length < 10 || rawTelefone.length > 11) {
        Alert.alert('Erro', 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos).');
        return;
      }
      await criar({ nome: nome.trim(), cpf: rawCpf, email: email.trim(), senha: senha.trim(), telefone: rawTelefone, endereco: endereco.trim() });
      Alert.alert('Sucesso', 'Cliente criado');
      setNome('');
      setCpf('');
      setEmail('');
      setSenha('');
      setTelefone('');
      setEndereco('');
      setTab('listar');
      
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Não foi possível salvar';
      Alert.alert('Erro', String(message));
    }
  };

  const abrirEditar = async (id: string) => {
    const c = clientes.find(c => c.id === id);
    if (c) {
      setSelectedCliente(c);
      setEditNome(c.nome);
      setEditCpf(c.cpf || '');
      setEditEmail(c.email || '');
      setEditSenha(c.senha || '');
      setEditTelefone(c.telefone || '');
      setEditEndereco(c.endereco || '');
      setTab('editar');
    }
  };

  const salvarEdicao = async () => {
    if (!selectedCliente) return;
    try {
      const rawCpf = onlyDigits(editCpf);
      const rawTelefone = onlyDigits(editTelefone);
      if (!editNome.trim()) {
        Alert.alert('Erro', 'Preencha o nome');
        return;
      }
      if (!editCpf.trim() || !editEmail.trim() || !editSenha.trim() || !editTelefone.trim() || !editEndereco.trim()) {
        Alert.alert('Erro', 'CPF, email, senha, telefone e endereco sao obrigatorios');
        return;
      }
      if (rawCpf.length !== 11) {
        Alert.alert('Erro', 'CPF inválido. Informe 11 dígitos.');
        return;
      }
      if (rawTelefone.length < 10 || rawTelefone.length > 11) {
        Alert.alert('Erro', 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos).');
        return;
      }
      const updated: Cliente = { ...selectedCliente, nome: editNome.trim(), cpf: rawCpf, email: editEmail.trim(), senha: editSenha.trim(), telefone: rawTelefone, endereco: editEndereco.trim() };
      await atualizar(updated);
      Alert.alert('Sucesso', 'Cliente atualizado');
      setTab('listar');
      
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Não foi possível atualizar';
      Alert.alert('Erro', String(message));
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirmar', 'Deseja excluir este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await remover(id);
        }
      }
    ]);
  };

  return (
    <Container>
      <View style={[styles.tabs, { borderColor: colors.border }]}> 
        <TouchableOpacity style={[styles.tab, tab === 'listar' && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setTab('listar')}>
          <Text style={[styles.tabText, { color: colors.textMuted }, tab === 'listar' && { color: colors.primary, fontWeight: '700' }]}>Listar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'criar' && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setTab('criar')}>
          <Text style={[styles.tabText, { color: colors.textMuted }, tab === 'criar' && { color: colors.primary, fontWeight: '700' }]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'editar' && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setTab('editar')}>
          <Text style={[styles.tabText, { color: colors.textMuted }, tab === 'editar' && { color: colors.primary, fontWeight: '700' }]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {tab === 'listar' && (
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Clientes</Text>
          {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} /> : null}
          <FlatList
            data={clientes}
            keyExtractor={(c) => c.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, justifyContent: 'space-between', marginBottom: 8 }}
            ListEmptyComponent={!loading ? <Text style={{ marginTop: 18, color: colors.textMuted, textAlign: 'center', width: '100%' }}>Nenhum cliente cadastrado</Text> : null}
            renderItem={({ item }) => (
              <View style={[styles.gridItem, styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.nome}</Text>
                <Text style={[styles.itemSmall, { color: colors.textMuted }]}>{item.email}</Text>
                <Text style={[styles.itemSmall, { color: colors.textMuted }]}>{item.telefone}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
                  <TouchableOpacity style={[styles.gridActionButton, { backgroundColor: colors.primarySoft, flex: 1 }]} onPress={() => abrirEditar(item.id)}>
                    <Text style={[styles.actionText, { color: colors.primary, textAlign: 'center' }]}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.gridActionButton, { backgroundColor: colors.danger, flex: 1 }]} onPress={() => handleDelete(item.id)}>
                    <Text style={[styles.actionText, { color: '#fff', textAlign: 'center' }]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {tab === 'criar' && (
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Novo Cliente</Text>
          <TextInput placeholder="Nome *" placeholderTextColor={colors.textMuted} value={nome} onChangeText={setNome} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />
          <TextInput placeholder="CPF *" placeholderTextColor={colors.textMuted} value={cpf} onChangeText={(text) => setCpf(formatCpf(text))} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="numeric" maxLength={14} />
          <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="email-address" />
          <TextInput placeholder="Senha *" placeholderTextColor={colors.textMuted} value={senha} onChangeText={setSenha} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} secureTextEntry />
          <TextInput placeholder="Telefone" placeholderTextColor={colors.textMuted} value={telefone} onChangeText={(text) => setTelefone(formatTelefone(text))} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="phone-pad" maxLength={16} />
          <TextInput placeholder="Endereco" placeholderTextColor={colors.textMuted} value={endereco} onChangeText={setEndereco} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={salvarNovo}>
            <Text style={styles.primaryButtonText}>Salvar Cliente</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === 'editar' && (
        <View style={{ flex: 1 }}>
          {selectedCliente ? (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{selectedCliente.nome}</Text>
              <Text style={[styles.label, { color: colors.textMuted }]}>Nome</Text>
              <TextInput value={editNome} onChangeText={setEditNome} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />
              <Text style={[styles.label, { color: colors.textMuted }]}>CPF</Text>
              <TextInput value={editCpf} onChangeText={(text) => setEditCpf(formatCpf(text))} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="numeric" maxLength={14} />
              <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
              <TextInput value={editEmail} onChangeText={setEditEmail} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="email-address" />
              <Text style={[styles.label, { color: colors.textMuted }]}>Senha</Text>
              <TextInput value={editSenha} onChangeText={setEditSenha} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} secureTextEntry />
              <Text style={[styles.label, { color: colors.textMuted }]}>Telefone</Text>
              <TextInput value={editTelefone} onChangeText={(text) => setEditTelefone(formatTelefone(text))} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="phone-pad" maxLength={16} />
              <Text style={[styles.label, { color: colors.textMuted }]}>Endereco</Text>
              <TextInput value={editEndereco} onChangeText={setEditEndereco} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={salvarEdicao}>
                <Text style={styles.primaryButtonText}>Salvar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ marginTop: 20, textAlign: 'center', color: colors.textMuted }}>Selecione um cliente</Text>
          )}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderColor: '#eee', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: '#2596be' },
  tabText: { fontSize: 14, color: '#666' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 8 },
  item: { padding: 12, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  gridItem: { flex: 0.48 },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemSmall: { marginTop: 4, fontSize: 12 },
  actionButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  gridActionButton: { paddingVertical: 7, borderRadius: 10 },
  actionText: { fontSize: 12, fontWeight: '700' },
  primaryButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  primaryButtonText: { color: '#fff', fontWeight: '700' }
});
