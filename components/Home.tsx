import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeHeader() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Image source={require('../assets/osfacil.png')} style={styles.logo} />
        <Text style={styles.titulo}>OS Fácil</Text>
        <Text style={styles.subtitulo}>Gerenciador de Ordens de Serviço</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Bem-vindo! 👋</Text>
        <Text style={styles.welcomeDesc}>
          Sistema simples e eficiente para gerenciar suas ordens de serviço automotivas.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(tabs)/ordem')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="list" size={32} color="#1976D2" />
          </View>
          <Text style={styles.cardTitle}>Ordens</Text>
          <Text style={styles.cardDesc}>Ver e gerenciar suas ordens</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(tabs)/clientes')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="people" size={32} color="#7B1FA2" />
          </View>
          <Text style={styles.cardTitle}>Clientes</Text>
          <Text style={styles.cardDesc}>Gerenciar seus clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(tabs)/busca')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="search" size={32} color="#388E3C" />
          </View>
          <Text style={styles.cardTitle}>Buscar</Text>
          <Text style={styles.cardDesc}>Pesquisar ordens</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)/ordem')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Nova Ordem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/(tabs)/clientes')}
        >
          <Ionicons name="person-add" size={24} color="#6BC0A9" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>Novo Cliente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ Sobre o Aplicativo</Text>
        <Text style={styles.infoText}>
          OS Fácil é uma solução completa para gerenciamento de ordens de serviço automotivas. 
          Organize seus clientes, veículos e serviços de forma simples e eficiente.
        </Text>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',

  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6BC0A9',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  welcomeSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6BC0A9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6BC0A9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6BC0A9',
  },
  secondaryButtonText: {
    color: '#6BC0A9',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#E8F8F5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6BC0A9',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
