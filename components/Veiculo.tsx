import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Container from './Container';
import { useVeiculos, useClientes } from '../src/hooks';
import { Veiculo as VeiculoType, Cliente } from '../src/types';
import { useLocalSearchParams } from 'expo-router';

export default function Veiculo() {
  const [mode, setMode] = useState<'listar' | 'criar' | 'editar'>('listar');
  const { veiculos, loading: loadingVeiculos, load: loadVeiculos, criar, atualizar, remover } = useVeiculos();
  const { clientes, loading: loadingClientes } = useClientes();

  const [clienteId, setClienteId] = useState<string>('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');

  const [selected, setSelected] = useState<VeiculoType | null>(null);
  const [showClienteList, setShowClienteList] = useState(false);
  const { clienteId: paramClienteId } = useLocalSearchParams() as any;

  useEffect(() => {
    if (paramClienteId) {
      setClienteId(String(paramClienteId));
      setMode('criar');
    }
  }, [paramClienteId]);


  const salvarNovo = async () => {
    try {
      if (!clienteId || !marca.trim() || !placa.trim()) {
        Alert.alert('Erro', 'Cliente, marca e placa são obrigatórios');
        return;
      }
      await criar({ clienteId, marca, modelo, placa, ano, cor });
      Alert.alert('Sucesso', 'Veículo criado');
      setMarca(''); setModelo(''); setPlaca(''); setAno(''); setCor(''); setClienteId('');
      setMode('listar');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o veículo');
    }
  };

  const abrirEditar = async (id: string) => {
    const v = veiculos.find(x => x.id === id);
    if (v) {
      setSelected(v);
      setClienteId(v.clienteId);
      setMarca(v.marca);
      setModelo(v.modelo);
      setPlaca(v.placa);
      setAno(v.ano);
      setCor(v.cor || '');
      setMode('editar');
    }
  };

  const salvarEdicao = async () => {
    if (!selected) return;
    try {
      const updated: VeiculoType = { ...selected, clienteId, marca, modelo, placa, ano, cor };
      await atualizar(updated);
      Alert.alert('Sucesso', 'Veículo atualizado');
      setSelected(null);
      setMode('listar');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível atualizar o veículo');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirmar', 'Deseja excluir este veículo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await remover(id); } }
    ]);
  };

  const selecionarCliente = (c: Cliente) => {
    setClienteId(c.id);
    setShowClienteList(false);
  };

  return (
    <Container>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, mode === 'listar' && styles.tabActive]} onPress={() => setMode('listar')}>
          <Text style={[styles.tabText, mode === 'listar' && styles.tabTextActive]}>Listar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode === 'criar' && styles.tabActive]} onPress={() => { setMode('criar'); setSelected(null); }}>
          <Text style={[styles.tabText, mode === 'criar' && styles.tabTextActive]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode === 'editar' && styles.tabActive]} onPress={() => setMode('editar')}>
          <Text style={[styles.tabText, mode === 'editar' && styles.tabTextActive]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {mode === 'listar' && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Veículos</Text>
          <FlatList
            data={veiculos}
            keyExtractor={(v) => v.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.marca} {item.modelo} — {item.placa}</Text>
                <Text style={styles.itemSmall}>Cliente: {clientes.find(c => c.id === item.clienteId)?.nome || '—'}</Text>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                  <Button title="Editar" onPress={() => abrirEditar(item.id)} />
                  <Button color="#d9534f" title="Excluir" onPress={() => handleDelete(item.id)} />
                </View>
              </View>
            )}
          />
        </View>
      )}

      {(mode === 'criar' || mode === 'editar') && (
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.title}>{mode === 'criar' ? 'Novo Veículo' : `Editar Veículo`}</Text>

          <Text style={styles.label}>Cliente *</Text>
          <TouchableOpacity style={styles.clienteButton} onPress={() => setShowClienteList(!showClienteList)}>
            <Text style={styles.clienteButtonText}>{clientes.find(c => c.id === clienteId)?.nome || 'Selecione um cliente'}</Text>
          </TouchableOpacity>

          {showClienteList && (
            <View style={styles.clienteListContainer}>
              <FlatList
                data={clientes}
                keyExtractor={c => c.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.clienteListItem} onPress={() => selecionarCliente(item)}>
                    <Text style={styles.clienteListItemText}>{item.nome}</Text>
                    {item.telefone ? <Text style={styles.clienteListItemPhone}>{item.telefone}</Text> : null}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Text style={styles.label}>Marca *</Text>
          <TextInput value={marca} onChangeText={setMarca} style={styles.input} />

          <Text style={styles.label}>Modelo</Text>
          <TextInput value={modelo} onChangeText={setModelo} style={styles.input} />

          <Text style={styles.label}>Placa *</Text>
          <TextInput value={placa} onChangeText={setPlaca} style={styles.input} />

          <Text style={styles.label}>Ano</Text>
          <TextInput value={ano} onChangeText={setAno} style={styles.input} keyboardType="numeric" />

          <Text style={styles.label}>Cor</Text>
          <TextInput value={cor} onChangeText={setCor} style={styles.input} />

          <View style={{ marginTop: 12, marginBottom: 20 }}>
            {mode === 'criar' ? (
              <Button title="Salvar Veículo" onPress={salvarNovo} />
            ) : (
              <Button title="Salvar Alterações" onPress={salvarEdicao} />
            )}
          </View>
        </ScrollView>
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
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontWeight: 'bold', marginBottom: 4 },
  itemSmall: { color: '#666', marginTop: 4 },
  clienteButton: { borderWidth: 1, borderColor: '#2596be', borderRadius: 8, padding: 12, marginBottom: 8, backgroundColor: '#f0f8ff' },
  clienteButtonText: { color: '#333', fontSize: 14, fontWeight: '500' },
  clienteListContainer: { borderWidth: 1, borderColor: '#2596be', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff', maxHeight: 300 },
  clienteListItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  clienteListItemText: { fontSize: 14, fontWeight: '500', color: '#333' },
  clienteListItemPhone: { fontSize: 12, color: '#999', marginTop: 2 }
});