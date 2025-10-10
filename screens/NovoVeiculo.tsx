import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type NovoVeiculoScreenRouteProp = RouteProp<RootStackParamList, 'NovoVeiculo'>;

export default function NovoVeiculoScreen() {
  const route = useRoute<NovoVeiculoScreenRouteProp>();
  const clienteId = route.params?.clienteId;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="car" size={64} color="#27ae60" />
        </View>
        <Text style={styles.title}>Novo Veículo</Text>
        {clienteId && <Text style={styles.subtitle}>Cliente ID: {clienteId}</Text>}
        <Text style={styles.subtitle}>Em desenvolvimento...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20, alignItems: 'center', justifyContent: 'center', minHeight: 400 },
  iconContainer: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20, textAlign: 'center' },
});