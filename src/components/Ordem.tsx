import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useOrdens } from '../src/hooks';
import { useRouter } from 'expo-router';
import { Servico } from '../src/types';
import Container from './Container';

export default function Ordem() {
  const router = useRouter();
  const [defeito, setDefeito] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [servicoDesc, setServicoDesc] = useState('');
  const [servicoValor, setServicoValor] = useState('');
  const [servicos, setServicos] = useState<Servico[]>([]);

  const addServico = () => {
    if (!servicoDesc || !servicoValor) {
      Alert.alert('Erro', 'Preencha descrição e valor do serviço');
      return;
    }
    const s: Servico = { id: String(Date.now()), descricao: servicoDesc, valor: Number(servicoValor) };
    setServicos(prev => [...prev, s]);
    setServicoDesc('');
    setServicoValor('');
  };
  const { criar } = useOrdens();

  const salvar = async () => {
    try {
      const ordem = await criar({ defeito, observacoes, servicos, status: 'ABERTA' } as any);
      Alert.alert('Ordem criada', `Ordem #${ordem?.numero || ''} criada com sucesso`);
      setDefeito(''); setObservacoes(''); setServicos([]);
      router.push('/(tabs)/ordem');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a ordem');
      console.error(e);
    }
  };

  return (
    <Container>
      <View style={styles.container}>
      <Text style={styles.title}>Nova Ordem</Text>

      <Text style={styles.label}>Defeito</Text>
      <TextInput style={styles.input} value={defeito} onChangeText={setDefeito} placeholder="Descreva o defeito" />

      <Text style={styles.label}>Observações</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={observacoes} onChangeText={setObservacoes} placeholder="Observações adicionais" multiline />

      <Text style={styles.label}>Adicionar Serviço</Text>
      <TextInput style={styles.input} value={servicoDesc} onChangeText={setServicoDesc} placeholder="Descrição do serviço" />
      <TextInput style={styles.input} value={servicoValor} onChangeText={setServicoValor} placeholder="Valor (ex: 120.00)" keyboardType="numeric" />
      <Button title="Adicionar Serviço" onPress={addServico} />

      <FlatList data={servicos} keyExtractor={s => s.id} renderItem={({ item }) => (
        <View style={styles.servicoItem}>
          <Text>{item.descricao} - R$ {item.valor.toFixed(2)}</Text>
        </View>
      )} />

      <View style={styles.actions}>
        <Button title="Salvar Ordem" onPress={salvar} />
      </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
  servicoItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  actions: { marginTop: 16 }
});