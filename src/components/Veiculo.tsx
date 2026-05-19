import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Container from './Container';
import { useVeiculos, useClientes } from '../hooks';
import { Veiculo as VeiculoType, Cliente } from '../types';
import { useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../theme';

export default function Veiculo() {
  const { colors } = useAppTheme();
  const [mode, setMode] = useState<'listar' | 'criar' | 'editar'>('listar');
  const { veiculos, loading: loadingVeiculos, criar, atualizar, remover } = useVeiculos();
  const { clientes } = useClientes();

  const [clienteId, setClienteId] = useState<string>('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');

  const [selected, setSelected] = useState<VeiculoType | null>(null);
  const [showClienteList, setShowClienteList] = useState(false);
  const { clienteId: paramClienteId } = useLocalSearchParams() as any;

  const formatPlaca = (text: string) => text.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 8);
  const formatAno = (text: string) => text.replace(/\D/g, '').slice(0, 4);
  const isPlacaValida = (value: string) => {
    const placa = value.trim().toUpperCase();
    return /^[A-Z]{3}-\d{4}$/.test(placa) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(placa);
  };

  useEffect(() => {
    if (paramClienteId) {
      setClienteId(String(paramClienteId));
      setMode('criar');
    }
  }, [paramClienteId]);

  const resetForm = (preserveCliente = false) => {
    setMarca('');
    setModelo('');
    setPlaca('');
    setAno('');
    setCor('');
    setSelected(null);
    if (!preserveCliente) {
      setClienteId('');
    }
  };

  const getApiErrorMessage = (e: any, fallback: string) => {
    if (e?.response?.status === 403) {
      return 'Sem permissao para salvar veiculo (403). Faça login com perfil autorizado.';
    }

    return (
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      fallback
    );
  };


  const salvarNovo = async () => {
    try {
      const placaNormalizada = placa.trim().toUpperCase();
      if (!clienteId || !marca.trim() || !placa.trim()) {
        Alert.alert('Erro', 'Cliente, marca e placa são obrigatórios');
        return;
      }
      if (!isPlacaValida(placaNormalizada)) {
        Alert.alert('Erro', 'Placa inválida. Use apenas os formatos ABC-1234 ou QSX6C10.');
        return;
      }
      if (ano && ano.length !== 4) {
        Alert.alert('Erro', 'Ano inválido. Informe 4 dígitos.');
        return;
      }
      
      await criar({ clienteId, marca: marca.trim(), modelo: modelo.trim(), placa: placaNormalizada, ano: ano.trim(), cor: cor.trim() });
      Alert.alert('Sucesso', 'Veículo criado');
      resetForm();
      setMode('listar');
    } catch (e: any) {
      Alert.alert('Erro', String(getApiErrorMessage(e, 'Não foi possível salvar o veículo')));
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
      const placaNormalizada = placa.trim().toUpperCase();
      if (!clienteId || !marca.trim() || !placa.trim()) {
        Alert.alert('Erro', 'Cliente, marca e placa são obrigatórios');
        return;
      }
      if (!isPlacaValida(placaNormalizada)) {
        Alert.alert('Erro', 'Placa inválida. Use apenas os formatos ABC-1234 ou QSX6C10.');
        return;
      }
      if (ano && ano.length !== 4) {
        Alert.alert('Erro', 'Ano inválido. Informe 4 dígitos.');
        return;
      }
      const updated: VeiculoType = { ...selected, clienteId, marca: marca.trim(), modelo: modelo.trim(), placa: placaNormalizada, ano: ano.trim(), cor: cor.trim() };
      await atualizar(updated);
      Alert.alert('Sucesso', 'Veículo atualizado');
      resetForm();
      setMode('listar');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', String(getApiErrorMessage(e, 'Não foi possível atualizar o veículo')));
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
      <View style={[styles.tabs, { borderColor: colors.border }]}> 
        <TouchableOpacity style={[styles.tab, mode === 'listar' && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setMode('listar')}>
          <Text style={[styles.tabText, { color: colors.textMuted }, mode === 'listar' && { color: colors.primary, fontWeight: '700' }]}>Listar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode === 'criar' && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => { setMode('criar'); resetForm(Boolean(paramClienteId)); }}>
          <Text style={[styles.tabText, { color: colors.textMuted }, mode === 'criar' && { color: colors.primary, fontWeight: '700' }]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode === 'editar' && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setMode('editar')}>
          <Text style={[styles.tabText, { color: colors.textMuted }, mode === 'editar' && { color: colors.primary, fontWeight: '700' }]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {mode === 'listar' && (
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Veiculos</Text>
          {loadingVeiculos ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} /> : null}
          <FlatList
            data={veiculos}
            keyExtractor={(v) => v.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, justifyContent: 'space-between', marginBottom: 8 }}
            ListEmptyComponent={!loadingVeiculos ? <Text style={{ marginTop: 18, color: colors.textMuted, textAlign: 'center', width: '100%' }}>Nenhum veiculo cadastrado</Text> : null}
            renderItem={({ item }) => (
              <View style={[styles.gridItem, styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.marca} {item.modelo}</Text>
                <Text style={[styles.itemSmall, { color: colors.textMuted }]}>Placa: {item.placa}</Text>
                <Text style={[styles.itemSmall, { color: colors.textMuted }]}>Cliente: {clientes.find(c => c.id === item.clienteId)?.nome || '-'}</Text>
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

      {(mode === 'criar' || mode === 'editar') && (
        <ScrollView style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{mode === 'criar' ? 'Novo Veiculo' : `Editar Veiculo`}</Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Cliente *</Text>
          <TouchableOpacity style={[styles.clienteButton, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => setShowClienteList(!showClienteList)}>
            <Text style={[styles.clienteButtonText, { color: colors.text }]}>{clientes.find(c => String(c.id) === String(clienteId))?.nome || 'Selecione um cliente'}</Text>
          </TouchableOpacity>

          {showClienteList && (
            <View style={[styles.clienteListContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
              <FlatList
                data={clientes}
                keyExtractor={c => c.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.clienteListItem, { borderBottomColor: colors.border }]} onPress={() => selecionarCliente(item)}>
                    <Text style={[styles.clienteListItemText, { color: colors.text }]}>{item.nome}</Text>
                    {item.telefone ? <Text style={[styles.clienteListItemPhone, { color: colors.textMuted }]}>{item.telefone}</Text> : null}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Text style={[styles.label, { color: colors.textMuted }]}>Marca *</Text>
          <TextInput value={marca} onChangeText={setMarca} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />

          <Text style={[styles.label, { color: colors.textMuted }]}>Modelo</Text>
          <TextInput value={modelo} onChangeText={setModelo} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />

          <Text style={[styles.label, { color: colors.textMuted }]}>Placa *</Text>
          <TextInput
            value={placa}
            onChangeText={(text) => setPlaca(formatPlaca(text))}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            autoCapitalize="characters"
            maxLength={8}
            placeholder="ABC-1234 ou QSX6C10"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>Ano</Text>
          <TextInput value={ano} onChangeText={(text) => setAno(formatAno(text))} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} keyboardType="numeric" maxLength={4} />

          <Text style={[styles.label, { color: colors.textMuted }]}>Cor</Text>
          <TextInput value={cor} onChangeText={setCor} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary, marginBottom: 20 }]} onPress={mode === 'criar' ? salvarNovo : salvarEdicao}>
            <Text style={styles.primaryButtonText}>{mode === 'criar' ? 'Salvar Veiculo' : 'Salvar Alteracoes'}</Text>
          </TouchableOpacity>
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
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 8 },
  item: { padding: 12, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  gridItem: { flex: 0.48 },
  itemTitle: { fontWeight: 'bold', marginBottom: 4 },
  itemSmall: { marginTop: 4 },
  clienteButton: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8 },
  clienteButtonText: { fontSize: 14, fontWeight: '500' },
  clienteListContainer: { borderWidth: 1, borderRadius: 10, marginBottom: 12, maxHeight: 300 },
  clienteListItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  clienteListItemText: { fontSize: 14, fontWeight: '500' },
  clienteListItemPhone: { fontSize: 12, marginTop: 2 },
  actionButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  gridActionButton: { paddingVertical: 7, borderRadius: 10 },
  actionText: { fontSize: 12, fontWeight: '700' },
  primaryButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '700' }
});