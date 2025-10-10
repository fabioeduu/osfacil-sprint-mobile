import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NovoClienteScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-add" size={64} color="#27ae60" />
        </View>
        <Text style={styles.title}>Novo Cliente</Text>
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