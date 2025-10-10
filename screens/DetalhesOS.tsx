import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type Nav = StackNavigationProp<RootStackParamList, 'DetalhesOS'>;
type Route = RouteProp<RootStackParamList, 'DetalhesOS'>;

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '—'}</Text>
  </View>
);

const InfoCard = ({ title, icon, color, children }: any) => (
  <View style={styles.card}>
    <View style={[styles.cardHeader, { backgroundColor: color }]}>
      <Ionicons name={icon} size={20} color="#fff" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

export default function DetalhesOSScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { osId } = route.params;
  const { state, updateOrdemServico } = useApp();

  const os = state.ordensServico.find(o => o.id === osId);
  if (!os)
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={64} color="#e74c3c" />
        <Text style={styles.error}>OS não encontrada</Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  const changeStatus = () => {
    const seq: Array<'aberta' | 'em_andamento' | 'aguardando_peca' | 'concluida' | 'cancelada'> = [
      'aberta',
      'em_andamento',
      'aguardando_peca',
      'concluida',
      'cancelada',
    ];
    const next = seq[(seq.indexOf(os.status) + 1) % seq.length];
    updateOrdemServico({ ...os, status: next });
  };

  return (
    <ScrollView style={styles.container}>
      <Header
        title={`OS #${os.numero}`}
        subtitle={`${os.cliente.nome} • ${os.veiculo.marca} ${os.veiculo.modelo}`}
        rightElement={
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditarOS', { osId })}>
            <Ionicons name="create" size={22} color="#fff" />
          </TouchableOpacity>
        }
        style={styles.header}
        titleStyle={styles.headerTitle}
      />

      {/* Cliente */}
      <InfoCard title="Cliente" icon="person" color="#3498db">
        {['Nome', 'Telefone', 'Email', 'CPF'].map((f, i) => (
          <InfoRow key={i} label={`${f}:`} value={(os.cliente as any)[f.toLowerCase()]} />
        ))}
      </InfoCard>

      {/* Veículo */}
      <InfoCard title="Veículo" icon="car" color="#e74c3c">
        {['Placa', 'Marca', 'Modelo', 'Ano', 'Cor', 'Km'].map((f, i) => (
          <InfoRow
            key={i}
            label={`${f}:`}
            value={(os.veiculo as any)[f.toLowerCase()] || (f === 'Km' ? os.veiculo.km : '')}
          />
        ))}
      </InfoCard>

      {/* Problema */}
      <InfoCard title="Descrição do Problema" icon="alert-circle" color="#f39c12">
        <Text style={styles.desc}>{os.observacoes || os.observacoesInternas || '—'}</Text>
      </InfoCard>

      {/* Serviços */}
      <InfoCard title="Serviços" icon="construct" color="#9b59b6">
        {os.itens?.length ? (
          os.itens.map((it, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.value}>{it.servico.nome}</Text>
              <Text style={[styles.value, { color: '#27ae60' }]}>R$ {it.valorTotal.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Nenhum serviço</Text>
        )}
      </InfoCard>

      {/* Valores */}
      <InfoCard title="Valores" icon="cash" color="#27ae60">
        <InfoRow label="Valor Estimado:" value={`R$ ${os.valorTotal.toFixed(2)}`} />
        <InfoRow label="Valor Final:" value={`R$ ${os.valorFinal.toFixed(2)}`} />
      </InfoCard>

      {/* Datas */}
      <InfoCard title="Datas" icon="calendar" color="#1abc9c">
        {[
          { key: 'dataAbertura', label: 'Data Abertura', value: os.dataAbertura },
          { key: 'dataPrevisao', label: 'Data Previsão', value: os.dataPrevisao },
          { key: 'dataConclusao', label: 'Data Conclusão', value: os.dataConclusao },
        ].map(
          (item, i) =>
            item.value && (
              <InfoRow
                key={i}
                label={item.label}
                value={new Date(item.value).toLocaleDateString('pt-BR')}
              />
            )
        )}
      </InfoCard>

      {/* Observações */}
      {os.observacoes && (
        <InfoCard title="Observações" icon="document-text" color="#95a5a6">
          <Text style={styles.desc}>{os.observacoes}</Text>
        </InfoCard>
      )}

      {/* Ações */}
      <View style={styles.actions}>
        {[
          { text: 'Alterar Status', icon: 'refresh', color: '#3498db', fn: changeStatus },
          {
            text: 'Gerar PDF',
            icon: 'print',
            color: '#27ae60',
            fn: () => Alert.alert('PDF', 'Função em desenvolvimento'),
          },
        ].map((b, i) => (
          <TouchableOpacity key={i} style={[styles.btn, { backgroundColor: b.color }]} onPress={b.fn}>
            <Ionicons name={b.icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color="#fff" />
            <Text style={styles.btnText}>{b.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#3498db', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  editBtn: { backgroundColor: '#2c3e50', padding: 10, borderRadius: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, margin: 10, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  cardTitle: { marginLeft: 8, color: '#fff', fontWeight: '700' },
  cardBody: { padding: 10, backgroundColor: '#f8f9fa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: '#7f8c8d', fontSize: 14 },
  value: { color: '#2c3e50', fontWeight: '600' },
  desc: { color: '#34495e', fontSize: 14 },
  empty: { color: '#95a5a6', fontStyle: 'italic' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', margin: 16 },
  btn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  error: { color: '#e74c3c', fontSize: 16, marginVertical: 12 },
  btnBack: { backgroundColor: '#3498db', padding: 10, borderRadius: 8 },
});
