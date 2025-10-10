import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type VeiculosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Veiculos'>;
type VeiculosScreenRouteProp = RouteProp<RootStackParamList, 'Veiculos'>;

export default function VeiculosScreen() {
  const navigation = useNavigation<VeiculosScreenNavigationProp>();
  const route = useRoute<VeiculosScreenRouteProp>();
  const clienteId = route.params?.clienteId;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="car-sport" size={64} color="#9b59b6" />
        </View>
        <Text style={styles.title}>Veículos</Text>
        {clienteId && <Text style={styles.subtitle}>Cliente ID: {clienteId}</Text>}
        <Text style={styles.subtitle}>Em desenvolvimento...</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('NovoVeiculo', { clienteId })}
        >
          <Text style={styles.buttonText}>Novo Veículo</Text>
        </TouchableOpacity>
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
  button: { backgroundColor: '#9b59b6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});