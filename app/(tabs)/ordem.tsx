import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import Container from "../../components/Container";
import { useOrdens, useClientes, useVeiculos } from "../../src/hooks";
import useAuth from "../../src/hooks/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Servico, Cliente } from "../../src/types";

type Tab = "listar" | "criar" | "editar";

export default function OrdensPage() {
  const { id: queryId } = useLocalSearchParams();
  const [tab, setTab] = useState<Tab>("listar");
  const { ordens, loading: loadingOrdens, load: loadOrdens, criar, atualizar, remover } = useOrdens();
  const { clientes } = useClientes();
  const { veiculos } = useVeiculos();
  const auth = useAuth();
  const [defeito, setDefeito] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [clienteId, setClienteId] = useState<string>("");
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [veiculoId, setVeiculoId] = useState<string>("");
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<any | null>(null);
  const [servicoDesc, setServicoDesc] = useState("");
  const [servicoValor, setServicoValor] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedOrdem, setSelectedOrdem] = useState<any | null>(null);
  const [editObservacoes, setEditObservacoes] = useState("");
  const [editStatus, setEditStatus] = useState("ABERTA");
  const [showClienteList, setShowClienteList] = useState(false);
  const [showVeiculoList, setShowVeiculoList] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    
    if (loadingOrdens) return;
    if (queryId) {
      const o = ordens.find(x => x.id === String(queryId));
      if (o) {
        setSelectedOrdem(o);
        setEditObservacoes(o.observacoes || "");
        setEditStatus(o.status || "ABERTA");
        setTab("editar");
      }
    }
  }, [queryId, loadingOrdens, ordens]);

  const addServico = () => {
    if (!servicoDesc || !servicoValor) {
      Alert.alert("Erro", "Preencha descrição e valor");
      return;
    }
    setServicos([...servicos, { id: String(Date.now()), descricao: servicoDesc, valor: Number(servicoValor) }]);
    setServicoDesc("");
    setServicoValor("");
  };

  const selecionarCliente = (cliente: Cliente) => {
    setClienteId(cliente.id);
    setClienteSelecionado(cliente);
    setShowClienteList(false);
    
    setVeiculoId('');
    setVeiculoSelecionado(null);
  };

  const selecionarVeiculo = (v: any) => {
    setVeiculoId(v.id);
    setVeiculoSelecionado(v);
    setShowVeiculoList(false);
  };

  const salvarNova = async () => {
    try {
      if (!defeito.trim()) {
        Alert.alert("Erro", "Preencha o defeito");
        return;
      }
      if (!clienteId) {
        Alert.alert('Erro', 'Selecione o cliente');
        return;
      }
      if (!veiculoId) {
        Alert.alert('Erro', 'Selecione o veículo do cliente');
        return;
      }
      await criar({ 
        defeito, 
        observacoes, 
        servicos, 
        status: "ABERTA",
        clienteId: clienteId || undefined,
        veiculoId: veiculoId || undefined,
      });
      Alert.alert("Sucesso", "Ordem criada");
      setDefeito("");
      setObservacoes("");
      setClienteId("");
      setClienteSelecionado(null);
      setVeiculoId('');
      setVeiculoSelecionado(null);
      setServicos([]);
      setTab("listar");
      
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar");
    }
  };

  const abrirEditar = async (id: string) => {
    const o = ordens.find(x => x.id === id);
    if (o) {
      setSelectedOrdem(o);
      setEditObservacoes(o.observacoes || "");
      setEditStatus(o.status || "ABERTA");
      setTab("editar");
    }
  };

  const salvarEdicao = async () => {
    if (!selectedOrdem) return;
    try {
      const updated = { ...selectedOrdem, observacoes: editObservacoes, status: editStatus };
      await atualizar(updated);
      Alert.alert("Sucesso", "Ordem atualizada");
      setTab("listar");
      
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await remover(id);
        }
      }
    ]);
  };

  const getNomeCliente = (id?: string) => {
    if (!id) return "Sem cliente";
    const cliente = clientes.find(c => c.id === id);
    return cliente?.nome || "Cliente desconhecido";
  };

  return (
    <Container>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === "listar" && styles.tabActive]} onPress={() => setTab("listar")}>
          <Text style={[styles.tabText, tab === "listar" && styles.tabTextActive]}>Listar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === "criar" && styles.tabActive]} onPress={() => setTab("criar")}>
          <Text style={[styles.tabText, tab === "criar" && styles.tabTextActive]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === "editar" && styles.tabActive]} onPress={() => setTab("editar")}>
          <Text style={[styles.tabText, tab === "editar" && styles.tabTextActive]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {tab === "listar" && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Ordens de Serviço</Text>
          <FlatList
            data={ordens}
            keyExtractor={(o) => o.id}
            renderItem={({ item }) => {
              const canModify = auth.isAdmin() || (auth.email && item.ownerEmail && auth.email.toLowerCase() === item.ownerEmail.toLowerCase());
              return (
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Ordem #{item.numero}  {item.status}</Text>
                  <Text style={styles.clienteInfo}>👤 {getNomeCliente(item.clienteId)}</Text>
                  <Text numberOfLines={2}>{item.defeito}</Text>
                  <Text style={styles.itemSmall}>R$ {Number(item.valorTotal).toFixed(2)}</Text>
                  <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                    {canModify ? (
                      <>
                        <Button title="Editar" onPress={() => abrirEditar(item.id)} />
                        <Button color="#d9534f" title="Excluir" onPress={() => handleDelete(item.id)} />
                      </>
                    ) : (
                      <Text style={{ color: '#999', fontSize: 12, alignSelf: 'center' }}>Apenas administrador ou dono pode editar/excluir</Text>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {tab === "criar" && (
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.title}>Nova Ordem</Text>
          
          <Text style={styles.label}>Cliente *</Text>
          <TouchableOpacity 
            style={styles.clienteButton}
            onPress={() => setShowClienteList(!showClienteList)}
          >
            <Text style={styles.clienteButtonText}>
              {clienteSelecionado ? clienteSelecionado.nome : "Selecione um cliente"}
            </Text>
          </TouchableOpacity>

          {showClienteList && (
            <View style={styles.clienteListContainer}>
              <FlatList
                data={clientes}
                keyExtractor={(c) => c.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.clienteListItem}
                    onPress={() => selecionarCliente(item)}
                  >
                    <Text style={styles.clienteListItemText}>{item.nome}</Text>
                    {item.telefone && <Text style={styles.clienteListItemPhone}>{item.telefone}</Text>}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

              <Text style={styles.label}>Veículo *</Text>
              <TouchableOpacity 
                style={styles.clienteButton}
                onPress={() => setShowVeiculoList(!showVeiculoList)}
              >
                <Text style={styles.clienteButtonText}>
                  {veiculoSelecionado ? `${veiculoSelecionado.marca} ${veiculoSelecionado.modelo} — ${veiculoSelecionado.placa}` : (clienteSelecionado ? 'Selecione um veículo' : 'Selecione um cliente primeiro')}
                </Text>
              </TouchableOpacity>

              {showVeiculoList && (
                <View style={styles.clienteListContainer}>
                  <FlatList
                    data={veiculos.filter(v => v.clienteId === clienteId)}
                    keyExtractor={(v) => v.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.clienteListItem}
                        onPress={() => selecionarVeiculo(item)}
                      >
                        <Text style={styles.clienteListItemText}>{item.marca} {item.modelo} — {item.placa}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity style={{ padding: 12, alignItems: 'center' }} onPress={() => router.push('/(tabs)/veiculos?clienteId=' + (clienteId || ''))}>
                    <Text style={{ color: '#2596be', fontWeight: '600' }}>Cadastrar veículo</Text>
                  </TouchableOpacity>
                </View>
              )}

          <Text style={styles.label}>Defeito *</Text>
          <TextInput 
            placeholder="Descreva o defeito" 
            value={defeito} 
            onChangeText={setDefeito} 
            style={styles.input} 
          />
          
          <Text style={styles.label}>Observações</Text>
          <TextInput
            placeholder="Observações adicionais"
            value={observacoes}
            onChangeText={setObservacoes}
            style={[styles.input, { height: 60 }]}
            multiline
          />
          
          <Text style={styles.label}>Serviços</Text>
          <TextInput 
            placeholder="Descrição do serviço" 
            value={servicoDesc} 
            onChangeText={setServicoDesc} 
            style={styles.input} 
          />
          <TextInput 
            placeholder="Valor (R$)" 
            value={servicoValor} 
            onChangeText={setServicoValor} 
            keyboardType="numeric" 
            style={styles.input} 
          />
          <Button title="Adicionar Serviço" onPress={addServico} />
          
          <FlatList
            data={servicos}
            keyExtractor={(s) => s.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.servicoItem}>
                <Text>{item.descricao} - R$ {item.valor.toFixed(2)}</Text>
              </View>
            )}
          />
          
          <View style={{ marginTop: 12, marginBottom: 20 }}>
            <Button title="Salvar Ordem" onPress={salvarNova} />
          </View>
        </ScrollView>
      )}

      {tab === "editar" && (
        <ScrollView style={{ flex: 1 }}>
          {selectedOrdem ? (
            <>
              <Text style={styles.title}>Ordem #{selectedOrdem.numero}</Text>
              <Text style={styles.clienteInfo}>👤 {getNomeCliente(selectedOrdem.clienteId)}</Text>
              <Text style={styles.clienteInfo}>🚗 {veiculos.find(v => v.id === selectedOrdem.veiculoId)?.marca || ''} {veiculos.find(v => v.id === selectedOrdem.veiculoId)?.modelo || ''} {veiculos.find(v => v.id === selectedOrdem.veiculoId)?.placa ? '— ' + veiculos.find(v => v.id === selectedOrdem.veiculoId)?.placa : ''}</Text>
              <Text style={styles.label}>Status</Text>
              <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                {["ABERTA", "EM_ANDAMENTO", "AGUARDANDO_PECAS", "CONCLUIDA", "CANCELADA"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusBtn, editStatus === s && styles.statusBtnActive]}
                    onPress={() => setEditStatus(s)}
                  >
                    <Text style={{ color: editStatus === s ? "#fff" : "#333", fontSize: 12 }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Observações</Text>
              <TextInput value={editObservacoes} onChangeText={setEditObservacoes} style={[styles.input, { height: 80 }]} multiline />
              <View style={{ marginTop: 12, marginBottom: 20 }}>
                <Button title="Salvar" onPress={salvarEdicao} />
              </View>
            </>
          ) : (
            <Text style={{ marginTop: 20, textAlign: "center" }}>Selecione uma ordem</Text>
          )}
        </ScrollView>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", borderBottomWidth: 2, borderColor: "#eee", marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderColor: "#2596be" },
  tabText: { fontSize: 14, color: "#666" },
  tabTextActive: { color: "#2596be", fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "600", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 8 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee", backgroundColor: "#fafafa" },
  itemTitle: { fontWeight: "bold", marginBottom: 4 },
  itemSmall: { color: "#666", marginTop: 6 },
  clienteInfo: { fontSize: 13, color: "#2596be", marginBottom: 4 },
  servicoItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee", backgroundColor: "#f9f9f9" },
  statusBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: "#ccc", marginRight: 4, marginBottom: 4 },
  statusBtnActive: { backgroundColor: "#2596be", borderColor: "#2596be" },
  clienteButton: { 
    borderWidth: 1, 
    borderColor: "#2596be", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 8,
    backgroundColor: "#f0f8ff"
  },
  clienteButtonText: { 
    color: "#333", 
    fontSize: 14,
    fontWeight: "500"
  },
  clienteListContainer: {
    borderWidth: 1,
    borderColor: "#2596be",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    maxHeight: 300
  },
  clienteListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  clienteListItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333"
  },
  clienteListItemPhone: {
    fontSize: 12,
    color: "#999",
    marginTop: 2
  }
});
