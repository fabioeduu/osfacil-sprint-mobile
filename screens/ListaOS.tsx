import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrdemServico, StatusOS } from '../types';
import { RootStackParamList } from '../navigation/types';

type ListaOSNav = StackNavigationProp<RootStackParamList, 'ListaOS'>;

const cores = {
  aberta: '#3498db',
  em_andamento: '#f39c12',
  aguardando_peca: '#9b59b6',
  concluida: '#27ae60',
  cancelada: '#e74c3c',
  padrao: '#95a5a6',
};

const statusLabels: Record<StatusOS, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  aguardando_peca: 'Aguardando Peça',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const OSCard = ({ os, onPress }: { os: OrdemServico; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Text style={styles.osNumber}>OS #{os.numero}</Text>
      <View style={[styles.statusBadge, { backgroundColor: cores[os.status] || cores.padrao }]}>
        <Text style={styles.statusText}>{statusLabels[os.status] || 'Desconhecido'}</Text>
      </View>
    </View>

    <Text style={styles.clienteName}>{os.cliente.nome}</Text>
    <Text style={styles.vehicleInfo}>
      {os.veiculo.marca} {os.veiculo.modelo} - {os.veiculo.placa}
    </Text>
    <Text style={styles.dateInfo}>Abertura: {new Date(os.dataAbertura).toLocaleDateString('pt-BR')}</Text>
    {os.dataPrevisao && (
      <Text style={styles.dateInfo}>Previsão: {new Date(os.dataPrevisao).toLocaleDateString('pt-BR')}</Text>
    )}
    <View style={styles.cardFooter}>
      <Text style={styles.valorTotal}>R$ {os.valorFinal.toFixed(2)}</Text>
      <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
    </View>
  </TouchableOpacity>
);

export default function ListaOSScreen() {
  const navigation = useNavigation<ListaOSNav>();
  const [ordemServicos, setOrdemServicos] = useState<OrdemServico[]>([]);
  const [filteredOS, setFilteredOS] = useState<OrdemServico[]>([]);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState<StatusOS | 'todas'>('todas');

  // Dados de exemplo resumidos
  useEffect(() => {
    const exemplo: OrdemServico[] = [
      {
        id: '1',
        numero: '2024001',
        cliente: { id: '1', nome: 'João Silva' } as any,
        veiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234' } as any,
        dataAbertura: new Date(),
        status: 'em_andamento',
        valorFinal: 350,
        prioridade: 'normal',
        itens: [],
        valorTotal: 0
      },
      {
        id: '2',
        numero: '2024002',
        cliente: { id: '2', nome: 'Maria Santos' } as any,
        veiculo: { marca: 'Honda', modelo: 'Civic', placa: 'DEF-5678' } as any,
        dataAbertura: new Date(),
        status: 'aguardando_peca',
        valorFinal: 1200,
        prioridade: 'normal',
        itens: [],
        valorTotal: 0
      },
      {
        id: '3',
        numero: '2024003',
        cliente: { id: '3', nome: 'Carlos Pereira' } as any,
        veiculo: { marca: 'Ford', modelo: 'Fiesta', placa: 'GHI-9012' } as any,
        dataAbertura: new Date(),
        status: 'aberta',
        valorFinal: 0,
        prioridade: 'alta',
        itens: [],
        valorTotal: 0
      },
      {
        id: '4',
        numero: '2024004',
        cliente: { id: '4', nome: 'Ana Souza' } as any,
        veiculo: { marca: 'Chevrolet', modelo: 'Onix', placa: 'JKL-3456' } as any,
        dataAbertura: new Date(),
        status: 'concluida',
        valorFinal: 800,
        prioridade: 'normal',
        itens: [],
        valorTotal: 0
      },
      {
        id: '5',
        numero: '2024005',
        cliente: { id: '5', nome: 'Bruno Lima' } as any,
        veiculo: { marca: 'Volkswagen', modelo: 'Gol', placa: 'MNO-7890' } as any,
        dataAbertura: new Date(),
        status: 'cancelada',
        valorFinal: 0,
        prioridade: 'baixa',
        itens: [],
        valorTotal: 0
      },
      {
        id: '6',
        numero: '2024006',
        cliente: { id: '6', nome: 'Fernanda Costa' } as any,
        veiculo: { marca: 'Renault', modelo: 'Sandero', placa: 'PQR-2345' } as any,
        dataAbertura: new Date(),
        status: 'em_andamento',
        valorFinal: 450,
        prioridade: 'normal',
        itens: [],
        valorTotal: 0
      },
      {
        id: '7',
        numero: '2024007',
        cliente: { id: '7', nome: 'Patrícia Mendes' } as any,
        veiculo: { marca: 'Fiat', modelo: 'Argo', placa: 'STU-6789' } as any,
        dataAbertura: new Date(),
        status: 'aguardando_peca',
        valorFinal: 600,
        prioridade: 'alta',
        itens: [],
        valorTotal: 0
      },
    ];
    setOrdemServicos(exemplo);
    setFilteredOS(exemplo);
  }, []);

  const filterOS = useCallback(() => {
    const text = searchText.toLowerCase();
    const result = ordemServicos.filter(os =>
      (status === 'todas' || os.status === status) &&
      (os.numero.toLowerCase().includes(text) ||
        os.cliente.nome.toLowerCase().includes(text) ||
        os.veiculo.placa.toLowerCase().includes(text))
    );
    setFilteredOS(result);
  }, [ordemServicos, status, searchText]);

  useFocusEffect(useCallback(() => filterOS(), [filterOS]));
  useEffect(() => filterOS(), [searchText, status]);

  return (
    <View style={styles.container}>
      {/* 🔍 Busca e filtros */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#95a5a6" />
          <TextInput
            style={styles.input}
            placeholder="Buscar OS, cliente ou placa..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          horizontal
          data={[
            { value: 'todas', label: 'Todas' },
            ...Object.entries(statusLabels).map(([key, label]) => ({ value: key, label })),
          ]}
          keyExtractor={item => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, status === item.value && styles.filterBtnActive]}
              onPress={() => setStatus(item.value as any)}
            >
              <Text
                style={[styles.filterText, status === item.value && styles.filterTextActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* 📋 Lista */}
      <FlatList
        data={filteredOS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OSCard os={item} onPress={() => navigation.navigate('DetalhesOS', { osId: item.id })} />
        )}
        contentContainerStyle={filteredOS.length ? styles.list : styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>Nenhuma OS encontrada</Text>
          </View>
        }
      />

      {/* ➕ Botão flutuante */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NovaOS')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchContainer: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderRadius: 20, backgroundColor: '#ecf0f1' },
  filterBtnActive: { backgroundColor: '#3498db' },
  filterText: { color: '#7f8c8d' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  osNumber: { fontWeight: 'bold', fontSize: 16, color: '#2c3e50' },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: '#fff', fontSize: 12 },
  clienteName: { fontWeight: '600', fontSize: 15, marginTop: 8 },
  vehicleInfo: { color: '#7f8c8d', fontSize: 14 },
  dateInfo: { color: '#95a5a6', fontSize: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  valorTotal: { color: '#27ae60', fontWeight: 'bold', fontSize: 15 },
  list: { padding: 15 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#bdc3c7', marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15 },
});
