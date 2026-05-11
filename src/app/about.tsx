import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Container from '../components/Container';
import { useAppTheme } from '../theme';
import { useRouter } from 'expo-router';
import * as Application from 'expo-application';

const APP_VERSION = '1.0.0';
const COMMIT_HASH = process.env.EXPO_PUBLIC_COMMIT_HASH || 'development-build';

export default function AboutScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [buildId, setBuildId] = useState<string>('');
  const [androidVersion, setAndroidVersion] = useState<string>('');

  useEffect(() => {
    const getInfo = async () => {
      try {
        const nativeBuildId = Application.nativeApplicationVersion || 'N/A';
        setAndroidVersion(nativeBuildId);
        setBuildId(COMMIT_HASH);
      } catch (error) {
        console.error('Error getting app info:', error);
      }
    };
    getInfo();
  }, []);

  return (
    <Container>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          <Text style={[styles.backButton, { color: colors.primary }]}>← Voltar</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.appName, { color: colors.text }]}>OS Fácil</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Sistema de Gestão de Ordens de Serviço</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações da Versão</Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Versão do App:</Text>
            <Text style={[styles.value, { color: colors.text }]}>{APP_VERSION}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Commit Hash:</Text>
            <Text style={[styles.hashValue, { color: colors.primary, fontFamily: 'monospace' }]}>
              {buildId}
            </Text>
          </View>

          {androidVersion && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Build ID:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{androidVersion}</Text>
              </View>
            </>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre o Projeto</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            OS Fácil é um sistema mobile para gestão de ordens de serviço integrado com Oracle APEX. 
            O aplicativo permite que funcionários gerenciem ordens de serviço de veículos, clientes e acompanhamento de status.
          </Text>

          <Text style={[styles.description, { color: colors.text, marginTop: 12 }]}>
            <Text style={{ fontWeight: 'bold' }}>Tecnologias Utilizadas:</Text>
            {'\n'}• React Native + Expo{'\n'}• TypeScript{'\n'}• Expo Router{'\n'}• Axios{'\n'}• AsyncStorage{'\n'}• Tanstack React Query{'\n'}• Oracle APEX Backend
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ Autenticação (Cliente e Funcionário)</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ CRUD de Clientes</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ CRUD de Veículos</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ Criação e Edição de Ordens de Serviço</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ Busca e Filtros de Ordens</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ Notificações Locais em Tempo Real</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ Modo Claro/Escuro</Text>
          <Text style={[styles.feature, { color: colors.text }]}>✓ Integração com Oracle APEX</Text>
        </View>

        <TouchableOpacity 
          style={[styles.copyButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            alert(`Commit: ${buildId}`);
          }}
        >
          <Text style={styles.copyButtonText}>Copiar Commit Hash</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
  hashValue: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: '60%',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
  },
  feature: {
    fontSize: 13,
    paddingVertical: 6,
    lineHeight: 20,
  },
  copyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
