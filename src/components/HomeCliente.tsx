import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useClientes, useOrdens, useVeiculos } from '../hooks';
import useAuth from '../hooks/useAuth';

export default function HomeCliente() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const auth = useAuth();
  const { clientes } = useClientes();
  const { ordens } = useOrdens();
  const { veiculos } = useVeiculos();

  const userEmail = auth.email;
  
  
  const clienteAtual = clientes.find(c => c.email === userEmail);
  
  
  const veiculosCliente = veiculos.filter(v => String(v.clienteId) === String(clienteAtual?.id));
  
  
  const ordensCliente = ordens.filter(o => String(o.clienteId) === String(clienteAtual?.id));
  
  
  const ordensServicoFeitoo = ordensCliente.filter(o => {
    const statusNorm = (o.status || '').toUpperCase().trim();
    return ['EM_ANDAMENTO', 'CONCLUIDA'].includes(statusNorm);
  });
  
  
  const ordemAtiva = ordensCliente.find(o => 
    ['ABERTA', 'EM_ANDAMENTO', 'AGUARDANDO_PECAS'].includes(o.status)
  ) || ordensCliente[0];

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(safeValue);
  };

  const getUltimaOrdemDoVeiculo = (veiculoId?: string) => {
    if (!veiculoId) return null;

    const ordensDoVeiculo = ordensCliente.filter(o => String(o.veiculoId) === String(veiculoId));
    if (ordensDoVeiculo.length === 0) return null;

    return [...ordensDoVeiculo].sort((a, b) => {
      const dataA = a.dataAbertura ? new Date(a.dataAbertura).getTime() : 0;
      const dataB = b.dataAbertura ? new Date(b.dataAbertura).getTime() : 0;
      return dataB - dataA;
    })[0];
  };

  const getStatusColor = (status: string) => {
    const statusNorm = (status || '').toUpperCase().trim();
    switch (statusNorm) {
      case 'ABERTA':
        return '#FF9800';
      case 'EM_ANDAMENTO':
        return colors.primary;
      case 'AGUARDANDO_PECAS':
        return '#2196F3';
      case 'CONCLUIDA':
        return colors.success || '#4CAF50';
      case 'CANCELADA':
        return colors.danger;
      default:
        return colors.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusNorm = (status || '').toUpperCase().trim();
    const labels: { [key: string]: string } = {
      'ABERTA': 'Aberta',
      'EM_ANDAMENTO': 'Em Andamento',
      'AGUARDANDO_PECAS': 'Aguardando Peças',
      'CONCLUIDA': 'Concluída',
      'CANCELADA': 'Cancelada',
    };
    return labels[statusNorm] || statusNorm;
  };

  const getResponsavel = (ordem: { funcionarioNome?: string; funcionarioEmail?: string; ownerEmail?: string; funcionarioId?: string }) => {
    return ordem.funcionarioNome || ordem.funcionarioEmail || ordem.ownerEmail || (ordem.funcionarioId ? `Funcionário #${ordem.funcionarioId}` : 'Não informado');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      
      <View style={[styles.headerSection, { backgroundColor: colors.primary }]}>
        <Image source={require('../../assets/osfacil.png')} style={styles.logo} />
        <Text style={styles.titulo}>Meu Veículo</Text>
        <Text style={styles.subtitulo}>Acompanhe sua manutenção</Text>
      </View>

      
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          👋 Bem-vindo, {clienteAtual?.nome?.split(' ')[0] || 'Cliente'}
        </Text>
        <Text style={[styles.welcomeDesc, { color: colors.textMuted }]}>Acompanhe suas ordens de serviço</Text>
      </View>

      
      {veiculosCliente.length > 0 && (
        <View style={[styles.mainVehicleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(() => {
            const ultimaOrdem = getUltimaOrdemDoVeiculo(veiculosCliente[0]?.id);
            return ultimaOrdem ? (
              <View style={[styles.vehicleStatusBadge, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name="person-outline" size={14} color={colors.primary} />
                <Text style={[styles.vehicleStatusText, { color: colors.textMuted }]}>
                  Funcionário que realizou: <Text style={[styles.vehicleStatusTextStrong, { color: colors.text }]}>{getResponsavel(ultimaOrdem)}</Text>
                </Text>
              </View>
            ) : null;
          })()}

          <View style={[styles.vehicleIconBg, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="car" size={40} color={colors.primary} />
          </View>
          
          <View style={styles.vehicleContent}>
            <Text style={[styles.vehicleTitle, { color: colors.text }]}>
              {veiculosCliente[0]?.marca} {veiculosCliente[0]?.modelo}
            </Text>
            
            <View style={styles.vehicleDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="card-outline" size={16} color={colors.primary} />
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Placa</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{veiculosCliente[0]?.placa}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Ano</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{veiculosCliente[0]?.ano}</Text>
              </View>
              
              {veiculosCliente[0]?.cor && (
                <View style={styles.detailItem}>
                  <Ionicons name="color-palette-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Cor</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{veiculosCliente[0]?.cor}</Text>
                </View>
              )}

              {getUltimaOrdemDoVeiculo(veiculosCliente[0]?.id) && (
                <View style={styles.detailItem}>
                  <Ionicons name="person-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Funcionário que realizou</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {getResponsavel(getUltimaOrdemDoVeiculo(veiculosCliente[0]?.id) as any)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
      
      
      {ordensCliente.length > 0 && (
        <>
          {ordensCliente.map((ordem) => {
            const statusNormalizado = (ordem.status || '').toUpperCase().trim();
            const temStatus = ['EM_ANDAMENTO', 'CONCLUIDA'].includes(statusNormalizado);
            
            if (temStatus) {
              return (
                <View key={ordem.id} style={[styles.servicoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  
                  <View style={styles.servicoCardHeader}>
                    <View style={styles.servicoCardTitleSection}>
                      <Ionicons name="cog" size={24} color={colors.primary} />
                      <Text style={[styles.servicoCardTitle, { color: colors.text }]}>Ordem #{ordem.numero}</Text>
                    </View>
                    <View style={[styles.statusBadgeService, { backgroundColor: getStatusColor(statusNormalizado) + '20', borderColor: getStatusColor(statusNormalizado) }]}>
                      <Text style={[styles.statusLabelService, { color: getStatusColor(statusNormalizado) }]}>
                        {getStatusLabel(statusNormalizado)}
                      </Text>
                    </View>
                  </View>

                  
                  <View style={[styles.servicoInfoRow, { borderBottomColor: colors.border }]}>
                    <Ionicons name="person-outline" size={18} color={colors.primary} />
                    <View style={styles.servicoInfoContent}>
                      <Text style={[styles.servicoInfoLabel, { color: colors.textMuted }]}>Funcionário que realizou</Text>
                      <Text style={[styles.servicoInfoValue, { color: colors.text }]}>
                        {getResponsavel(ordem)}
                      </Text>
                    </View>
                  </View>

                  
                  {ordem.observacoes && (
                    <View style={[styles.servicoInfoRow, { borderBottomColor: colors.border }]}>
                      <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                      <View style={styles.servicoInfoContent}>
                        <Text style={[styles.servicoInfoLabel, { color: colors.textMuted }]}>Observações</Text>
                        <Text style={[styles.servicoInfoValue, { color: colors.text }]}>
                          {ordem.observacoes}
                        </Text>
                      </View>
                    </View>
                  )}

                  
                  <View style={styles.servicoInfoRow}>
                    <Ionicons name="cash-outline" size={18} color={colors.primary} />
                    <View style={styles.servicoInfoContent}>
                      <Text style={[styles.servicoInfoLabel, { color: colors.textMuted }]}>Valor Total</Text>
                      <Text style={[styles.servicoValueValue, { color: colors.success || '#4CAF50' }]}>
                        {formatCurrency(ordem.valorTotal)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }
            return null;
          })}
        </>
      )}

      
      {ordemAtiva && (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cog" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ordem em Acompanhamento</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
            
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Ordem #{ordemAtiva.numero}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ordemAtiva.status) + '20', borderColor: getStatusColor(ordemAtiva.status) }]}>
                <Text style={[styles.statusLabel, { color: getStatusColor(ordemAtiva.status) }]}>
                  {getStatusLabel(ordemAtiva.status)}
                </Text>
              </View>
            </View>

            
            {ordemAtiva.defeito && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Problema:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{ordemAtiva.defeito}</Text>
              </View>
            )}

            
            {ordemAtiva.observacoes && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>O que está sendo feito:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{ordemAtiva.observacoes}</Text>
              </View>
            )}

            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Funcionário que realizou:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {getResponsavel(ordemAtiva)}
              </Text>
            </View>

            
            {ordemAtiva.veiculoId && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Veículo:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {veiculosCliente.find(v => v.id === ordemAtiva.veiculoId)?.placa || 'N/A'}
                </Text>
              </View>
            )}

            
            {ordemAtiva.dataAbertura && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Aberta em:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(ordemAtiva.dataAbertura).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            )}

            
            {ordemAtiva.servicos && ordemAtiva.servicos.length > 0 && (
              <View style={styles.servicesSection}>
                <Text style={[styles.servicesTitle, { color: colors.textMuted }]}>Serviços:</Text>
                {ordemAtiva.servicos.map((servico, idx) => (
                  <View key={idx} style={styles.serviceItem}>
                    <Text style={[styles.serviceName, { color: colors.text }]}>{servico.descricao}</Text>
                    <Text style={[styles.serviceValue, { color: colors.primary }]}>
                      {formatCurrency(servico.valor)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            
            <View style={[styles.totalSection, { backgroundColor: colors.primarySoft, borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Valor Total a Pagar:</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                {formatCurrency(ordemAtiva.valorTotal)}
              </Text>
            </View>

            
            <TouchableOpacity 
              style={[styles.detailButton, { backgroundColor: colors.primarySoft }]}
              onPress={() => router.push(`/(tabs)/busca`)}
            >
              <Text style={[styles.detailButtonText, { color: colors.primary }]}>Ver Detalhes Completos</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      
      {!ordemAtiva && ordensCliente.length === 0 && (
        <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="remove-circle-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Nenhuma ordem em andamento</Text>
          <Text style={[styles.emptyStateDesc, { color: colors.textMuted }]}>
            Você não tem ordens de serviço no momento
          </Text>
        </View>
      )}

      
      {ordensCliente.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Histórico de Ordens ({ordensCliente.length})</Text>
          </View>

          {ordensCliente.slice(0, 3).map((ordem) => (
            <TouchableOpacity
              key={ordem.id}
              style={[styles.orderItem, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              onPress={() => router.push(`/(tabs)/busca`)}
            >
              <View style={styles.orderItemHeader}>
                <Text style={[styles.orderItemTitle, { color: colors.text }]}>Ordem #{ordem.numero}</Text>
                <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(ordem.status) + '20', borderColor: getStatusColor(ordem.status) }]}>
                  <Text style={[styles.statusLabelSmall, { color: getStatusColor(ordem.status) }]}>
                    {getStatusLabel(ordem.status)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.orderItemDesc, { color: colors.textMuted }]} numberOfLines={1}>
                {ordem.defeito}
              </Text>
              <Text style={[styles.orderItemMeta, { color: colors.textMuted }]} numberOfLines={1}>
                Funcionário: {getResponsavel(ordem)}
              </Text>
              <Text style={[styles.orderItemValue, { color: colors.primary }]}>
                {formatCurrency(ordem.valorTotal)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  welcomeSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  welcomeDesc: {
    fontSize: 15,
    fontWeight: '500',
  },
  section: {
    borderWidth: 0,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  card: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cardYear: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardInfo: {
    gap: 8,
  },
  infoRow: {
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusLabelSmall: {
    fontSize: 11,
    fontWeight: '600',
  },
  servicesSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 12,
    flex: 1,
  },
  serviceValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: '600',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    borderWidth: 0,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyStateDesc: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  orderItem: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  orderItemDesc: {
    fontSize: 12,
    marginBottom: 4,
  },
  orderItemMeta: {
    fontSize: 12,
    marginBottom: 4,
  },
  orderItemValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  mainVehicleCard: {
    borderWidth: 0,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  vehicleStatusBadge: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  vehicleStatusText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  vehicleStatusTextStrong: {
    fontSize: 12,
    fontWeight: '700',
  },
  vehicleIconBg: {
    width: 70,
    height: 70,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleContent: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  vehicleDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  servicoCard: {
    borderWidth: 0,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  servicoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  servicoCardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  servicoCardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  statusBadgeService: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusLabelService: {
    fontSize: 12,
    fontWeight: '600',
  },
  servicoInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  servicoInfoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  servicoInfoLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  servicoInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  servicoValueValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
