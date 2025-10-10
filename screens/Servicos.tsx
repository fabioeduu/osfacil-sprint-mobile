import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type ServicosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Servicos'>;

export default function ServicosScreen() {
  const navigation = useNavigation<ServicosScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="list" size={64} color="#f39c12" />
        </View>
        <Text style={styles.title}>Serviços</Text>
        <Text style={styles.subtitle}>Em desenvolvimento...</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('NovoServico')}
        >
          <Text style={styles.buttonText}>Novo Serviço</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: '#f8f9fa' },
  content: { padding: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: 400 },
    
  iconContainer: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 30, textAlign: 'center' },
  button: { backgroundColor: '#f39c12', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});