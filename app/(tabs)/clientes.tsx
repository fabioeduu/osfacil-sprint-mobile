import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import Container from "../../components/Container";
import { useClientes } from '../../src/hooks';
import { useLocalSearchParams } from "expo-router";
import { Cliente } from '../../src/types';

type Tab = 'listar' | 'criar' | 'editar';

export default function ClientesPage() {
  const { id: queryId } = useLocalSearchParams();
  const [tab, setTab] = useState<Tab>('listar');
  const { clientes, loading, load, criar, atualizar, remover } = useClientes();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editEndereco, setEditEndereco] = useState('');

  
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
          setEditEmail(c.email || '');
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
      if (!nome.trim()) {
        Alert.alert('Erro', 'Preencha o nome');
        return;
      }
      await criar({ nome, email, telefone, endereco });
      Alert.alert('Sucesso', 'Cliente criado');
      setNome('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setTab('listar');
      
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  const abrirEditar = async (id: string) => {
    const c = clientes.find(c => c.id === id);
    if (c) {
      setSelectedCliente(c);
      setEditNome(c.nome);
      setEditEmail(c.email || '');
      setEditTelefone(c.telefone || '');
      setEditEndereco(c.endereco || '');
      setTab('editar');
    }
  };

  const salvarEdicao = async () => {
    if (!selectedCliente) return;
    try {
      const updated: Cliente = { ...selectedCliente, nome: editNome, email: editEmail, telefone: editTelefone, endereco: editEndereco };
      await atualizar(updated);
      Alert.alert('Sucesso', 'Cliente atualizado');
      setTab('listar');
      
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar');
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
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'listar' && styles.tabActive]} onPress={() => setTab('listar')}>
          <Text style={[styles.tabText, tab === 'listar' && styles.tabTextActive]}>Listar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'criar' && styles.tabActive]} onPress={() => setTab('criar')}>
          <Text style={[styles.tabText, tab === 'criar' && styles.tabTextActive]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'editar' && styles.tabActive]} onPress={() => setTab('editar')}>
          <Text style={[styles.tabText, tab === 'editar' && styles.tabTextActive]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {tab === 'listar' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Clientes</Text>
          <FlatList
            data={clientes}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemSmall}>{item.email}</Text>
                <Text style={styles.itemSmall}>{item.telefone}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                  <Button title="Editar" onPress={() => abrirEditar(item.id)} />
                  <Button color="#d9534f" title="Excluir" onPress={() => handleDelete(item.id)} />
                </View>
              </View>
            )}
          />
        </View>
      )}

      {tab === 'criar' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Novo Cliente</Text>
          <TextInput placeholder="Nome *" value={nome} onChangeText={setNome} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
          <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={styles.input} />
          <View style={{ marginTop: 12 }}>
            <Button title="Salvar Cliente" onPress={salvarNovo} />
          </View>
        </View>
      )}

      {tab === 'editar' && (
        <View style={{ flex: 1 }}>
          {selectedCliente ? (
            <>
              <Text style={styles.title}>{selectedCliente.nome}</Text>
              <Text style={styles.label}>Nome</Text>
              <TextInput value={editNome} onChangeText={setEditNome} style={styles.input} />
              <Text style={styles.label}>Email</Text>
              <TextInput value={editEmail} onChangeText={setEditEmail} style={styles.input} keyboardType="email-address" />
              <Text style={styles.label}>Telefone</Text>
              <TextInput value={editTelefone} onChangeText={setEditTelefone} style={styles.input} keyboardType="phone-pad" />
              <Text style={styles.label}>Endereço</Text>
              <TextInput value={editEndereco} onChangeText={setEditEndereco} style={styles.input} />
              <View style={{ marginTop: 12 }}>
                <Button title="Salvar" onPress={salvarEdicao} />
              </View>
            </>
          ) : (
            <Text style={{ marginTop: 20, textAlign: 'center' }}>Selecione um cliente</Text>
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
  tabTextActive: { color: '#2596be', fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemSmall: { color: '#666', marginTop: 4, fontSize: 12 }
});
