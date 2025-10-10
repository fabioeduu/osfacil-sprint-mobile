import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { OrdemServico } from '../types';

interface OSCardProps {
  item: OrdemServico;
  onPress: () => void;
}

const OSCard: React.FC<OSCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.osCard} onPress={onPress}>
    <View style={styles.osHeader}>
      <Text style={styles.osNumero}>{item.numero}</Text>
      <Text style={[
        styles.status,
        { color: item.status === 'concluida' ? '#2ecc71' : item.status === 'em_andamento' ? '#3498db' : '#f1c40f' }
      ]}>
        {item.status.toUpperCase()}
      </Text>
    </View>
    <Text>{item.cliente.nome} - {item.veiculo.modelo}</Text>
    <Text>Valor: R$ {item.valorFinal.toFixed(2)}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  osCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8, elevation: 2 },
  osHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  osNumero: { fontWeight: 'bold', fontSize: 16 },
  status: { fontWeight: 'bold' },
});

export default OSCard;
