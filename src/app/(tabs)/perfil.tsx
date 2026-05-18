import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Container from '../../components/Container';
import { useRouter } from 'expo-router';
import { useOrdens, useClientes, useApexStatus } from '../../hooks';
import useAuth from '../../hooks/useAuth';
import { useAppTheme } from '../../theme';

export default function PerfilPage() {
  const router = useRouter();
  const auth = useAuth();
  const { colors, mode, setMode, isDark } = useAppTheme();
  const { ordens } = useOrdens();
  const { clientes } = useClientes();
  const {
    statusItems: apexStatus,
    apexOnline,
    updatedAt,
    source,
    loading: apexLoading,
    error: apexError,
    reload: reloadApex,
  } = useApexStatus();
  const apexConnectionLabel = apexOnline === null ? 'Verificando...' : apexOnline ? 'Online' : 'Offline';
  const statusSourceLabel = source === 'main-api' ? 'API principal do app' : source === 'apex' ? 'Oracle APEX' : '--';
  const lastApexUpdate = updatedAt ? new Date(updatedAt).toLocaleString('pt-BR') : '--';
  const apexItems = apexStatus
    .map((item) => ({
      status: typeof item.STATUS === 'string' ? item.STATUS : 'Sem status',
      quantidade: typeof item.TOTAL === 'number' ? item.TOTAL : 0,
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 6);
  const apexTotal = apexItems.reduce((acc, item) => acc + item.quantidade, 0);
  const apexMax = apexItems.reduce((acc, item) => Math.max(acc, item.quantidade), 0);
  const totalOrdens = ordens.length;
  const totalClientes = clientes.length;
  const profile = auth.profile;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Container>
        <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>

        {profile && (
          <View style={[styles.profileBox, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <Text style={[styles.profileName, { color: colors.text }]}>{profile.nome || 'Usuario'}</Text>
            {profile.email ? <Text style={[styles.profileText, { color: colors.textMuted }]}>{profile.email}</Text> : null}
            {profile.telefone ? <Text style={[styles.profileText, { color: colors.textMuted }]}>{profile.telefone}</Text> : null}
            {profile.endereco ? <Text style={[styles.profileText, { color: colors.textMuted }]}>{profile.endereco}</Text> : null}
          </View>
        )}

        <View style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Ionicons name="list" size={24} color={colors.primary} />
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total de Ordens</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalOrdens}</Text>
          </View>
        </View>

        <View style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Ionicons name="people" size={24} color={colors.primary} />
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total de Clientes</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalClientes}</Text>
          </View>
        </View>

        <View
  style={[
    styles.apexSection,
    { backgroundColor: colors.surface, borderColor: colors.border },
  ]}
>
  <View style={styles.apexHeader}>
    <Text style={[styles.apexTitle, { color: colors.text }]}>
      Status Oracle APEX
    </Text>

    <TouchableOpacity
      onPress={() => reloadApex()}
      style={[
        styles.apexRefreshButton,
        {
          borderColor: colors.primarySoft,
          backgroundColor: colors.primarySoft,
        },
        apexLoading && { opacity: 0.6 },
      ]}
      disabled={apexLoading}
    >
      <Text style={[styles.apexRefreshText, { color: colors.primary }]}>
        {apexLoading ? 'Atualizando...' : 'Atualizar'}
      </Text>
    </TouchableOpacity>
  </View>

  {apexLoading && (
    <Text style={[styles.apexHint, { color: colors.textMuted }]}>
      Carregando dados...
    </Text>
  )}

  <Text style={[styles.apexHint, { color: apexOnline ? colors.primary : colors.textMuted }]}>
    Conexao APEX: {apexConnectionLabel}
  </Text>

  <Text style={[styles.apexHint, { color: colors.textMuted }]}>
    Fonte dos dados: {statusSourceLabel}
  </Text>

  <Text style={[styles.apexHint, { color: colors.textMuted }]}>
    Ultima atualizacao: {lastApexUpdate}
  </Text>

  
  {apexError && (
    <Text style={[styles.apexHint, { color: colors.danger }]}>
      {apexError}
    </Text>
  )}

  {!apexLoading && !apexError && apexStatus.length === 0 && (
    <Text style={[styles.apexHint, { color: colors.textMuted }]}>
      Sem dados de status no APEX.
    </Text>
  )}

  {!apexLoading && !apexError && apexItems.length > 0 && (
    <View style={styles.apexReport}>
      <View style={styles.apexSummaryRow}>
        <View style={[styles.apexSummaryCard, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
          <Text style={[styles.apexSummaryValue, { color: colors.primary }]}>{apexTotal}</Text>
          <Text style={[styles.apexSummaryLabel, { color: colors.text }]}>Total de ordens</Text>
        </View>
        <View style={[styles.apexSummaryCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.apexSummaryValue, { color: colors.text }]}>{apexItems.length}</Text>
          <Text style={[styles.apexSummaryLabel, { color: colors.textMuted }]}>Status encontrados</Text>
        </View>
      </View>

      {apexItems.map((item) => {
        const widthPercent = apexMax > 0 ? Math.max(8, Math.round((item.quantidade / apexMax) * 100)) : 8;
        return (
          <View key={item.status} style={styles.apexReportRow}>
            <View style={styles.apexReportHead}>
              <Text style={[styles.apexReportStatus, { color: colors.text }]} numberOfLines={1}>{item.status}</Text>
              <Text style={[styles.apexReportTotal, { color: colors.primary }]}>{item.quantidade}</Text>
            </View>
            <View style={[styles.apexBarTrack, { backgroundColor: colors.surfaceAlt }]}>
              <View style={[styles.apexBarFill, { backgroundColor: colors.primary, width: `${widthPercent}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  )}
</View>

        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.infoTitle, { color: colors.text }]}>Tema</Text>
          <View style={styles.themeRow}>
            <TouchableOpacity style={[styles.themeButton, { backgroundColor: mode === 'light' ? colors.primary : colors.surfaceAlt }]} onPress={() => setMode('light')}>
              <Text style={{ color: mode === 'light' ? '#fff' : colors.text }}>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeButton, { backgroundColor: mode === 'dark' ? colors.primary : colors.surfaceAlt }]} onPress={() => setMode('dark')}>
              <Text style={{ color: mode === 'dark' ? '#fff' : colors.text }}>Escuro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeButton, { backgroundColor: mode === 'system' ? colors.primary : colors.surfaceAlt }]} onPress={() => setMode('system')}>
              <Text style={{ color: mode === 'system' ? '#fff' : colors.text }}>Sistema</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>Modo atual: {isDark ? 'Escuro' : 'Claro'}</Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.infoTitle, { color: colors.text }]}>Versão</Text>
          <Text style={[styles.infoText, { color: colors.textMuted }]}> 
            OS Fácil v1.0.0
          </Text>
          <Text style={[styles.infoText, { color: colors.textMuted }]}> 
            Sistema de gerenciamento de ordens de serviço automotivas
          </Text>
        </View>


        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.logoutText}>Sobre o App</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutButton, { marginTop: 12, backgroundColor: '#ce1a1a' }]}
            onPress={() => {
              Alert.alert('Sair', 'Deseja realmente sair?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sair',
                  style: 'destructive',
                  onPress: async () => {
                    await auth.logout();
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
    borderWidth: 1,
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
    borderWidth: 1,
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
    backgroundColor: '#578cb1',
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
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'flex-start'
  },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#2C3E50' },
  profileText: { fontSize: 14, color: '#555' },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 12 },
  themeButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  apexSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  apexTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  apexHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  apexRefreshButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  apexRefreshText: { fontSize: 12, fontWeight: '700' },
  apexHint: { fontSize: 13 },
  apexReport: { marginTop: 10 },
  apexSummaryRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  apexSummaryCard: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 10 },
  apexSummaryValue: { fontSize: 20, fontWeight: '800' },
  apexSummaryLabel: { fontSize: 11, marginTop: 3, fontWeight: '600' },
  apexReportRow: { marginBottom: 8 },
  apexReportHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  apexReportStatus: { flex: 1, fontSize: 12, fontWeight: '600', marginRight: 8 },
  apexReportTotal: { fontSize: 14, fontWeight: '700' },
  apexBarTrack: { height: 8, borderRadius: 999, overflow: 'hidden' },
  apexBarFill: { height: '100%', borderRadius: 999 },
});
