import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import StatCard from '../components/Card';
import ActionButton from '../components/Button';
import OSCard from '../components/OSCard';

const Logo = require('../assets/osfacil.png');

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { state } = useApp();
  const { ordensServico, clientes, veiculos } = state;

  const stats = [
    { label: 'Em Andamento', value: ordensServico.filter(o => o.status === 'em_andamento').length, color: '#3498db' },
    { label: 'Concluídas', value: ordensServico.filter(o => o.status === 'concluida').length, color: '#2ecc71' },
    { label: 'Aguardando', value: ordensServico.filter(o => o.status === 'aguardando_peca').length, color: '#f1c40f' },
    { label: 'Canceladas', value: ordensServico.filter(o => o.status === 'cancelada').length, color: '#e74c3c' },
  ];

  const recentOS = ordensServico.slice(0, 3);

  const actions = [
    { icon: 'add-circle', text: 'Nova OS', screen: 'NovaOS' },
    { icon: 'list', text: 'Todas OS', screen: 'ListaOS' },
    { icon: 'person', text: 'Clientes', screen: 'Clientes' },
    { icon: 'car', text: 'Veiculos', screen: 'Veiculos' },
    { icon: 'bar-chart', text: 'Relatórios', screen: 'Relatorios' },
    { icon: 'notifications', text: 'Notificações', screen: 'Notificacoes' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Header
        logo={Logo}
        title="Sistema de Gerenciamento Automotivo"
        subtitle=""
        variant="large"
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('Configuracoes')}>
            <Ionicons name="settings" size={24} color="#fff" style={{ marginRight: 8 }} />
          </TouchableOpacity>
        }
      />
      
      <Text style={styles.title}>Painel de Controle</Text>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </View>

      {/* Ações rápidas */}
      <View style={styles.actionsContainer}>
        {actions.map((a, i) => (
          <ActionButton
            key={i}
            icon={a.icon}
            text={a.text}
            onPress={() => navigation.navigate(a.screen)}
          />
        ))}
      </View>

      {/* Últimas OS */}
      <View style={styles.latestContainer}>
        <Text style={styles.latestTitle}>Últimas Ordens de Serviço</Text>
        <View style={styles.latestBox}>
          {recentOS.length === 0 ? (
            <Text style={styles.empty}>Nenhuma OS registrada.</Text>
          ) : (
            recentOS.map(item => (
              <OSCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('DetalhesOS', { osId: item.id })}
              />
            ))
          )}
        </View>
      </View>

      {/* Resumo geral */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Clientes: {clientes.length}</Text>
          <Text style={styles.summaryText}>Veículos: {veiculos.length}</Text>
          <Text style={styles.summaryText}>Ordens de Serviço: {ordensServico.length}</Text>
        </View>
      </View>
      <View style={{ height: 25 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf0f1', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2c3e50' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 12 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#34495e', marginBottom: 8 },
  empty: { textAlign: 'center', color: '#7f8c8d' },
  latestContainer: {
    marginTop: 20,
    padding: 0,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  latestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 16,
    paddingBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  latestBox: {
    padding: 16,
    paddingTop: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  summary: { backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 2 },
  summaryContainer: {
    marginTop: 8,
    padding: 0,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 16,
    paddingBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  summaryBox: {
    padding: 16,
    paddingTop: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  summaryText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 8,
    borderRadius: 1,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 4,
  },
});