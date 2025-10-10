import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Cliente, Veiculo, Servico, OrdemServico, StatusOS, PrioridadeOS } from '../types';
import { ConfirmationModal } from '../components/Modal';
import Section from '../components/Section';
import SelectItem from '../components/SelectItem';
import PriorityButton from '../components/PriorityButton';
import { RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

type NavProp = StackNavigationProp<RootStackParamList, 'NovaOS'>;

export default function NovaOSScreen() {
  const navigation = useNavigation<NavProp>();
  const { state, addOrdemServico } = useApp();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [prioridade, setPrioridade] = useState<PrioridadeOS>('normal');
  const [problema, setProblema] = useState('');
  const [obs, setObs] = useState('');
  const [km, setKm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, msg: '' });

  const veiculosDoCliente = cliente
    ? state.veiculos.filter(v => v.clienteId === cliente.id)
    : [];

  const calcularTotal = () =>
    servicos.reduce((t, s) => t + (s.valor ?? 0), 0);

  const criarAlertaSelecao = (titulo: string, lista: any[], onSelect: (item: any) => void, extra?: { label: string, acao: () => void }) => {
    Alert.alert(titulo, 'Escolha uma opção:', [
      ...lista.map((i) => ({ text: i.nome || i.modelo || i.label, onPress: () => onSelect(i) })),
      extra && { text: extra.label, onPress: extra.acao },
      { text: 'Cancelar', style: 'cancel' }
    ].filter(Boolean) as any);
  };

  const selecionarCliente = () => {
    if (!state.clientes.length)
      return Alert.alert('Nenhum Cliente', 'Deseja cadastrar um novo?', [
        { text: 'Sim', onPress: () => navigation.navigate('NovoCliente') },
        { text: 'Cancelar', style: 'cancel' }
      ]);
    criarAlertaSelecao('Selecionar Cliente', state.clientes, (c) => { setCliente(c); setVeiculo(null); },
      { label: 'Novo Cliente', acao: () => navigation.navigate('NovoCliente') });
  };

  const selecionarVeiculo = () => {
    if (!cliente) return Alert.alert('Atenção', 'Selecione primeiro um cliente');
    if (!veiculosDoCliente.length)
      return Alert.alert('Nenhum Veículo', 'Deseja cadastrar um novo?', [
        { text: 'Sim', onPress: () => navigation.navigate('NovoVeiculo', { clienteId: cliente.id }) },
        { text: 'Cancelar', style: 'cancel' }
      ]);
    criarAlertaSelecao('Selecionar Veículo', veiculosDoCliente, setVeiculo,
      { label: 'Novo Veículo', acao: () => navigation.navigate('NovoVeiculo', { clienteId: cliente.id }) });
  };

  const selecionarServicos = () => {
    if (!state.servicos.length)
      return Alert.alert('Nenhum Serviço', 'Deseja cadastrar um novo?', [
        { text: 'Sim', onPress: () => navigation.navigate('NovoServico') },
        { text: 'Cancelar', style: 'cancel' }
      ]);
    criarAlertaSelecao('Selecionar Serviços', state.servicos.slice(0, 5), (s) => {
      if (!servicos.find(x => x.id === s.id)) setServicos([...servicos, s]);
    }, { label: 'Novo Serviço', acao: () => navigation.navigate('NovoServico') });
  };

  const validar = () => {
    if (!cliente) return Alert.alert('Erro', 'Selecione um cliente'), false;
    if (!veiculo) return Alert.alert('Erro', 'Selecione um veículo'), false;
    if (!problema.trim()) return Alert.alert('Erro', 'Descreva o problema'), false;
    if (!servicos.length) return Alert.alert('Erro', 'Selecione pelo menos um serviço'), false;
    return true;
  };

  const handleCriarOS = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      const itens = servicos.map((s, i) => ({
        id: `${Date.now()}_${i}`, servicoId: s.id, servico: s,
        quantidade: 1, valorUnitario: s.valor, valorTotal: s.valor
      }));
      const numero = `OS${String(state.ordensServico.length + 1).padStart(4, '0')}`;
      const novaOS: Omit<OrdemServico, 'id'> = {
        numero, cliente: cliente!, veiculo: veiculo!, itens,
        status: 'aberta' as StatusOS, prioridade,
        observacoes: problema || obs,
        dataAbertura: new Date(), valorTotal: calcularTotal(),
        valorFinal: 0,
      };
      const id = await addOrdemServico(novaOS);
      Alert.alert('Sucesso!', `Ordem ${numero} criada com sucesso!`, [
        { text: 'Ver OS', onPress: () => navigation.replace('DetalhesOS', { osId: id }) },
        { text: 'Nova', onPress: () => { setCliente(null); setVeiculo(null); setServicos([]); setPrioridade('normal'); setProblema(''); setObs(''); setKm(''); } },
        { text: 'Voltar', onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert('Erro', 'Falha ao criar OS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section title="Cliente" icon="person" required>
          <SelectItem label="" value={cliente?.nome} placeholder="Selecionar cliente" icon="person" onPress={selecionarCliente} />
          {cliente && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>📧 {cliente.email}</Text>
              <Text style={styles.infoText}>📱 {cliente.telefone}</Text>
              {cliente.endereco && <Text style={styles.infoText}>📍 {cliente.endereco}</Text>}
            </View>
          )}
        </Section>

        <Section title="Veículo" icon="car" required>
          <SelectItem
            label=""
            value={veiculo ? `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}` : undefined}
            placeholder="Selecionar veículo" icon="car" onPress={selecionarVeiculo}
          />
          {veiculo && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{veiculo.marca} {veiculo.modelo}</Text>
              <Text style={styles.infoText}>Ano: {veiculo.ano}</Text>
              <Text style={styles.infoText}>Placa: {veiculo.placa}</Text>
              {veiculo.cor && <Text style={styles.infoText}>Cor: {veiculo.cor}</Text>}
            </View>
          )}
        </Section>

        <Section title="Problema Relatado" icon="alert-circle" required>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={problema} onChangeText={setProblema}
            placeholder="Descreva o problema relatado pelo cliente..."
            multiline numberOfLines={4}
          />
        </Section>

        <Section title="Prioridade" icon="flag">
          <View style={styles.priorityContainer}>
            {(['baixa', 'normal', 'alta', 'urgente'] as PrioridadeOS[]).map((p) => (
              <PriorityButton key={p} priority={p} selected={prioridade === p} onPress={() => setPrioridade(p)} />
            ))}
          </View>
        </Section>

        <Section title="Serviços" icon="construct" required>
          <SelectItem
            label=""
            value={servicos.length ? `${servicos.length} serviço(s)` : undefined}
            placeholder="Selecionar serviços"
            icon="construct"
            onPress={selecionarServicos}
          />
          {servicos.length > 0 && (
            <View style={styles.infoCard}>
              {servicos.map((s, i) => (
                <View key={i} style={styles.servicoItem}>
                  <Text>{s.nome}</Text>
                  <Text style={{ color: '#27ae60' }}>R$ {s.valor.toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>R$ {calcularTotal().toFixed(2)}</Text>
              </View>
            </View>
          )}
        </Section>

        <Section title="Observações" icon="document-text">
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={obs} onChangeText={setObs}
            placeholder="Observações adicionais..."
            multiline numberOfLines={3}
          />
        </Section>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCriarOS}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar Ordem de Serviço'}</Text>
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          visible={modal.visible}
          message={modal.msg}
          onConfirm={() => { setModal({ visible: false, msg: '' }); handleCriarOS(); }}
          onCancel={() => setModal({ visible: false, msg: '' })}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  infoCard: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginTop: 8 },
  infoTitle: { fontWeight: '600', color: '#2c3e50' },
  infoText: { color: '#7f8c8d' },
  textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff', fontSize: 15 },
  textArea: { height: 80, textAlignVertical: 'top' },
  priorityContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  servicoItem: { flexDirection: 'row', justifyContent: 'space-between' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 6 },
  totalLabel: { fontWeight: '600', color: '#2c3e50' },
  totalValue: { fontWeight: 'bold', color: '#27ae60' },
  buttonContainer: { padding: 20 },
  createButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#27ae60', borderRadius: 12, padding: 14 },
  disabledButton: { backgroundColor: '#bdc3c7' },
  buttonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
});
