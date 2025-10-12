import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function RelatoriosScreen() {
  const { state } = useApp();
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'ano'>('mes');
  const navigation = (typeof useApp === 'function' ? require('@react-navigation/native').useNavigation() : null);

  
  const estat = useMemo(() => {
    const totalOS = state.ordensServico.length;
    const concluidas = state.ordensServico.filter(os => os.status === 'concluida');
    const faturamento = concluidas.reduce((t, os) => t + (os.valorFinal || 0), 0);
    const ticketMedio = concluidas.length ? faturamento / concluidas.length : 0;
    const clientes = new Set(state.ordensServico.map(os => os.cliente?.nome)).size;

    return { totalOS, concluidas: concluidas.length, faturamento, ticketMedio, clientes };
  }, [state.ordensServico]);

  const Card = ({ icon, title, value, color }: any) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={28} color={color} />
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );

  const periodos = [
    { key: 'semana', label: '7 dias' },
    { key: 'mes', label: '30 dias' },
    { key: 'ano', label: '1 ano' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Header
        title="Relatórios OS Fácil"
        subtitle="Visão geral"
        variant="compact"
        rightElement={
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={20} color="#fff" />
          </TouchableOpacity>
        }
        style={styles.header}
        titleStyle={styles.headerTitle}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Período</Text>
        <View style={styles.periodoSelector}>
          {periodos.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[styles.periodoBtn, periodo === p.key && styles.periodoAtivo]}
              onPress={() => setPeriodo(p.key as any)}
            >
              <Text style={[styles.periodoTxt, periodo === p.key && styles.periodoTxtAtivo]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Resumo Geral</Text>
        <View style={styles.grid}>
          <Card icon="document-text" title="Total de OS" value={estat.totalOS} color="#3498db" />
          <Card icon="checkmark-done" title="Concluídas" value={estat.concluidas} color="#27ae60" />
          <Card icon="cash" title="Faturamento" value={`R$ ${estat.faturamento.toFixed(0)}`} color="#16a085" />
          <Card icon="trending-up" title="Ticket Médio" value={`R$ ${estat.ticketMedio.toFixed(0)}`} color="#f39c12" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Clientes Atendidos</Text>
        <Text style={styles.simpleText}>{estat.clientes} clientes </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  exportButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 18, fontWeight: '600',
    color: '#2c3e50', marginBottom: 10,
  },
  periodoSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    justifyContent: 'space-between',
  },
  periodoBtn: { flex: 1, padding: 8, borderRadius: 20, alignItems: 'center' },
  periodoAtivo: { backgroundColor: '#3498db' },
  periodoTxt: { color: '#7f8c8d', fontWeight: '500' },
  periodoTxtAtivo: { color: '#fff', fontWeight: '700' },
  grid: { gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    padding: 15, borderLeftWidth: 4, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { color: '#7f8c8d', fontSize: 14 },
  cardValue: { color: '#2c3e50', fontSize: 18, fontWeight: '700' },
  simpleText: { fontSize: 16, color: '#2c3e50' },
});
