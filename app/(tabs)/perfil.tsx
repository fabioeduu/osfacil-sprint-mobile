import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Container from '../../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useOrdens, useClientes } from '../../src/hooks';

export default function PerfilPage() {
  const router = useRouter();
  const { ordens } = useOrdens();
  const { clientes } = useClientes();
  const totalOrdens = ordens.length;
  const totalClientes = clientes.length;
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const json = await AsyncStorage.getItem('@osfacil:profile');
        if (json && mounted) setProfile(JSON.parse(json));
      } catch (e) {
        
      }
    })();
    return () => { mounted = false; };
  }, []);


  return (
    <ScrollView style={styles.container}>
      <Container>
        <Text style={styles.title}>Perfil</Text>

        {profile && (
          <View style={styles.profileBox}>
            <Text style={styles.profileName}>{profile.nome || 'Usuário'}</Text>
            {profile.email ? <Text style={styles.profileText}>{profile.email}</Text> : null}
            {profile.telefone ? <Text style={styles.profileText}>{profile.telefone}</Text> : null}
            {profile.endereco ? <Text style={styles.profileText}>{profile.endereco}</Text> : null}
          </View>
        )}

        <View style={styles.statItem}>
          <Ionicons name="list" size={24} color="#2596be" />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Total de Ordens</Text>
            <Text style={styles.statValue}>{totalOrdens}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="people" size={24} color="#2596be" />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Total de Clientes</Text>
            <Text style={styles.statValue}>{totalClientes}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Sobre</Text>
          <Text style={styles.infoText}>
            OS Fácil v1.0.0
          </Text>
          <Text style={styles.infoText}>
            Sistema de gerenciamento de ordens de serviço automotivas
          </Text>
        </View>


        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Sair', 'Deseja realmente sair?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sair',
                  style: 'destructive',
                  onPress: async () => {
                    await AsyncStorage.removeItem('@osfacil:token');
                    
                    router.replace('/login');
                  }
                }
              ]);
            }}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
		
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  statContent: {
    marginLeft: 16,
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2596be',
  },
  infoBox: {
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
  logoutButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  }
  ,
  profileBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'flex-start'
  },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#2C3E50' },
  profileText: { fontSize: 14, color: '#555' },
});
