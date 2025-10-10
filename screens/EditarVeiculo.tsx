import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type EditarVeiculoScreenRouteProp = RouteProp<RootStackParamList, 'EditarVeiculo'>;

export default function EditarVeiculoScreen() {
  const route = useRoute<EditarVeiculoScreenRouteProp>();
  const { veiculoId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct" size={64} color="#f39c12" />
        </View>
        <Text style={styles.title}>Editar Veículo</Text>
        <Text style={styles.subtitle}>Veículo ID: {veiculoId}</Text>
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