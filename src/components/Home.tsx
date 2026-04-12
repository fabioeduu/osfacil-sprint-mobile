import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useApexStatus, useClientes, useOrdens, useVeiculos } from '../hooks';

export default function HomeHeader() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { clientes } = useClientes();
  const { ordens } = useOrdens();
  const { veiculos } = useVeiculos();
  const {
    statusItems: apexStatus,
    apexOnline,
    updatedAt,
    source,
    loading: apexLoading,
    error: apexError,
    reload: reloadApex,
  } = useApexStatus();

  const lastApexUpdate = updatedAt ? new Date(updatedAt).toLocaleString('pt-BR') : '--';
  const apexConnectionLabel = apexOnline === null ? 'Verificando...' : apexOnline ? 'Online' : 'Offline';
  const statusSourceLabel = source === 'main-api' ? 'API principal do app' : source === 'apex' ? 'Oracle APEX' : '--';
  const apexItems = apexStatus
    .map((item) => ({
      status: typeof item.STATUS === 'string' ? item.STATUS : 'Sem status',
      quantidade: typeof item.TOTAL === 'number' ? item.TOTAL : 0,
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 6);
  const apexTotal = apexItems.reduce((acc, item) => acc + item.quantidade, 0);
  const apexMax = apexItems.reduce((acc, item) => Math.max(acc, item.quantidade), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.headerSection, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
  <Image source={require('../../assets/osfacil.png')} style={styles.logo} />
        <Text style={[styles.titulo, { color: colors.text }]}>OS Facil</Text>
        <Text style={[styles.subtitulo, { color: colors.textMuted }]}>Painel de operacao da oficina</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>Bem-vindo</Text>
        <Text style={[styles.welcomeDesc, { color: colors.textMuted }]}> 
          Sistema simples e eficiente para gerenciar suas ordens de serviço automotivas.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.statValue, { color: colors.primary }]}>{ordens.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Ordens</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.statValue, { color: colors.primary }]}>{clientes.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Clientes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.statValue, { color: colors.primary }]}>{veiculos.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Veiculos</Text>
        </View>
      </View>

      <View style={[styles.apexSection, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={styles.apexHeader}>
          <View style={styles.apexTitleWrap}>
            <Ionicons name="analytics" size={18} color={colors.primary} />
            <Text style={[styles.apexTitle, { color: colors.text }]}>Relatorio Oracle APEX</Text>
          </View>
          <View style={[styles.apexOnlineBadge, { backgroundColor: apexOnline ? colors.primarySoft : colors.surfaceAlt, borderColor: colors.border }]}> 
            <View style={[styles.apexOnlineDot, { backgroundColor: apexOnline ? colors.success : colors.danger }]} />
            <Text style={[styles.apexOnlineText, { color: apexOnline ? colors.primary : colors.textMuted }]}>{apexConnectionLabel}</Text>
          </View>
        </View>

        <View style={styles.apexMetaRow}>
          <Text style={[styles.apexHint, { color: colors.textMuted }]}>Fonte: {statusSourceLabel}</Text>
          <Text style={[styles.apexHint, { color: colors.textMuted }]}>Atualizacao: {lastApexUpdate}</Text>
        </View>

        <TouchableOpacity
          onPress={() => reloadApex()}
          style={[styles.apexRefreshButton, { borderColor: colors.primarySoft, backgroundColor: colors.primarySoft }, apexLoading && { opacity: 0.6 }]}
          disabled={apexLoading}
        >
          <Text style={[styles.apexRefreshText, { color: colors.primary }]}>{apexLoading ? 'Atualizando dados...' : 'Atualizar relatorio'}</Text>
        </TouchableOpacity>

        {apexError ? <Text style={[styles.apexHint, { color: colors.danger }]}>{apexError}</Text> : null}
        {!apexLoading && !apexError && apexStatus.length === 0 ? (
          <Text style={[styles.apexHint, { color: colors.textMuted }]}>Sem dados de status no APEX.</Text>
        ) : null}

        {!apexLoading && !apexError && apexItems.length > 0 ? (
          <View style={styles.apexReport}>
            <View style={styles.apexSummaryRow}>
              <View style={[styles.apexSummaryCard, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}> 
                <Text style={[styles.apexSummaryValue, { color: colors.primary }]}>{apexTotal}</Text>
                <Text style={[styles.apexSummaryLabel, { color: colors.text }]}>Total de ordens</Text>
              </View>
              <View style={[styles.apexSummaryCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                <Text style={[styles.apexSummaryValue, { color: colors.text }]}>{apexItems.length}</Text>
                <Text style={[styles.apexSummaryLabel, { color: colors.textMuted }]}>Status mapeados</Text>
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
        ) : null}
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/ordem')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="list" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Ordens</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>Ver e gerenciar ordens</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/clientes')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="people" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Clientes</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>Gerenciar clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/busca')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="search" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Buscar</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>Pesquisar ordens</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/ordem')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Nova Ordem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }]}
          onPress={() => router.push('/(tabs)/clientes')}
        >
          <Ionicons name="person-add" size={24} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Novo Cliente</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.surface, borderLeftColor: colors.primary, borderColor: colors.border }]}> 
        <Text style={[styles.infoTitle, { color: colors.text }]}>Sobre o aplicativo</Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}> 
          OS Fácil é um gerenciamento de ordens de serviço automotivas. 
          Organize seus clientes, veículos e serviços de forma simples e eficiente!!
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
    borderWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0f6cbd',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10223b',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#5b6b82',
    fontWeight: '500',
  },
  welcomeSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#10223b',
    marginBottom: 8,
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#5b6b82',
    lineHeight: 20,
  },
  statsRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
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
    color: '#10223b',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#5b6b82',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d8e9fb',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  apexSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  apexTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  apexTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apexHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apexOnlineBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apexOnlineDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  apexOnlineText: {
    fontSize: 11,
    fontWeight: '700',
  },
  apexMetaRow: {
    gap: 2,
    marginBottom: 8,
  },
  apexRefreshButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  apexRefreshText: {
    fontSize: 12,
    fontWeight: '700',
  },
  apexHint: {
    fontSize: 13,
  },
  apexReport: {
    marginTop: 2,
  },
  apexSummaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  apexSummaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  apexSummaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  apexSummaryLabel: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '600',
  },
  apexReportRow: {
    marginBottom: 8,
  },
  apexReportHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  apexReportStatus: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  apexReportTotal: {
    fontSize: 14,
    fontWeight: '700',
  },
  apexBarTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  apexBarFill: {
    height: '100%',
    borderRadius: 999,
  },
});
