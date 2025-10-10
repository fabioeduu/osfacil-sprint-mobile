import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, Notificacao } from '../context/NotificationContext';
import Header from '../components/Header';

type NotificacoesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const NotificationCard = ({ notificacao, onPress, onDelete }: {
  notificacao: Notificacao, onPress: (n: Notificacao) => void, onDelete: (id: string) => void
}) => {
  const tipos: any = {
    urgente: { icon: 'warning', color: '#e74c3c' },
    vencida: { icon: 'time', color: '#e67e22' },
    prazo: { icon: 'calendar', color: '#f39c12' },
    nova: { icon: 'information-circle', color: '#3498db' },
    concluida: { icon: 'checkmark-circle', color: '#27ae60' },
    default: { icon: 'notifications', color: '#95a5a6' },
  };
  const { icon, color } = tipos[notificacao.tipo] || tipos.default;

  return (
    <TouchableOpacity
      style={[styles.card, !notificacao.lida && styles.unreadCard]}
      onPress={() => onPress(notificacao)}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <View style={[styles.iconBg, { backgroundColor: color }]}>
            <Ionicons name={icon} size={20} color="#fff" />
          </View>
          {!notificacao.lida && <View style={styles.dot} />}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, !notificacao.lida && styles.unreadTitle]}>{notificacao.titulo}</Text>
          <Text style={styles.msg}>{notificacao.mensagem}</Text>
          <Text style={styles.time}>{new Date(notificacao.data).toLocaleString('pt-BR')}</Text>
        </View>

        <TouchableOpacity onPress={() => onDelete(notificacao.id)}>
          <Ionicons name="close" size={20} color="#95a5a6" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function NotificacoesScreen() {
  const navigation = useNavigation<NotificacoesScreenNavigationProp>();
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas, removerNotificacao, limparNotificacoes } = useNotifications();

  const handlePress = (n: Notificacao) => {
    if (!n.lida) marcarComoLida(n.id);
    if (n.osId) navigation.navigate('DetalhesOS' as any, { osId: n.osId });
  };

  const confirmar = (msg: string, fn: () => void) =>
    Alert.alert(msg, 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: fn },
    ]);

  const tipos = [
    { key: 'urgente', label: '🚨 Urgente', color: '#e74c3c' },
    { key: 'vencida', label: '⏰ Vencidas', color: '#e67e22' },
    { key: 'prazo', label: '📅 Próximas do Prazo', color: '#f39c12' },
    { key: 'outras', label: 'ℹ️ Outras', color: '#3498db' },
  ];

  const porTipo = (tipo: string) =>
    tipo === 'outras'
      ? notificacoes.filter(n => !['urgente', 'vencida', 'prazo'].includes(n.tipo))
      : notificacoes.filter(n => n.tipo === tipo);

  return (
    <View style={styles.container}>
      <Header
        title="Notificações"
        subtitle={naoLidas > 0 ? `${naoLidas} não lida(s)` : 'Tudo em dia'}
        variant="compact"
        rightElement={
          <View style={styles.actions}>
            {naoLidas > 0 && (
              <TouchableOpacity onPress={marcarTodasComoLidas} style={styles.iconBtn}>
                <Ionicons name="checkmark-done" size={20} color="#3498db" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => notificacoes.length && confirmar('Limpar todas?', limparNotificacoes)} style={styles.iconBtn}>
              <Ionicons name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        }
        style={styles.header}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {notificacoes.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>Nenhuma Notificação</Text>
            <Text style={styles.emptyMsg}>Você está em dia! Não há notificações pendentes.</Text>
          </View>
        ) : (
          tipos.map(({ key, label, color }) => {
            const lista = porTipo(key);
            if (!lista.length) return null;
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color }]}>{label} ({lista.length})</Text>
                {lista.map(n => (
                  <NotificationCard key={n.id} notificacao={n} onPress={handlePress} onDelete={id => confirmar('Remover notificação?', () => removerNotificacao(id))} />
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#2c3e50', padding: 20, paddingTop: 50, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#3498db' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: { position: 'relative', marginRight: 15 },
  iconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#e74c3c', borderWidth: 2, borderColor: '#fff' },
  title: { fontSize: 16, fontWeight: '500', color: '#2c3e50', marginBottom: 4 },
  unreadTitle: { fontWeight: '600' },
  msg: { fontSize: 14, color: '#7f8c8d', marginBottom: 8 },
  time: { fontSize: 12, color: '#95a5a6' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#2c3e50', marginTop: 20, marginBottom: 10 },
  emptyMsg: { fontSize: 14, color: '#7f8c8d', textAlign: 'center' },
});
