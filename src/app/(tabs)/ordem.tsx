import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Container from "../../components/Container";
import { useOrdens, useClientes, useVeiculos } from "../../hooks";
import useAuth from "../../hooks/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Servico, Cliente, Veiculo, OrdemServico, StatusOrdem } from "../../types";
import { useAppTheme } from '../../theme';
import OrdemListTab from "../../components/ordem/OrdemListTab";
import OrdemCreateTab from "../../components/ordem/OrdemCreateTab";
import OrdemEditTab from "../../components/ordem/OrdemEditTab";

type Tab = "listar" | "criar" | "editar";

export default function OrdensPage() {
  const { colors } = useAppTheme();
  const { id: queryId } = useLocalSearchParams();
  const [tab, setTab] = useState<Tab>("listar");
  const { ordens, loading: loadingOrdens, criar, atualizar, remover } = useOrdens();
  const { clientes } = useClientes();
  const { veiculos } = useVeiculos();
  const auth = useAuth();
  const [defeito, setDefeito] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [clienteId, setClienteId] = useState<string>("");
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [veiculoId, setVeiculoId] = useState<string>("");
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [servicoDesc, setServicoDesc] = useState("");
  const [servicoValor, setServicoValor] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemServico | null>(null);
  const [editObservacoes, setEditObservacoes] = useState("");
  const [editStatus, setEditStatus] = useState<StatusOrdem>("ABERTA");
  const [showClienteList, setShowClienteList] = useState(false);
  const [showVeiculoList, setShowVeiculoList] = useState(false);
  const router = useRouter();
  const canManageOrdens = auth.isAuthenticated;
  const ordensVisiveis = ordens;

  const ensureCanManageOrdens = () => {
    if (canManageOrdens) return true;
    Alert.alert('Permissao', 'Voce precisa estar logado para criar, editar ou remover ordens.');
    return false;
  };

  React.useEffect(() => {
    
    if (loadingOrdens) return;
    if (queryId) {
      const o = ordensVisiveis.find(x => x.id === String(queryId));
      if (o) {
        setSelectedOrdem(o);
        setEditObservacoes(o.observacoes || "");
        setEditStatus(o.status || "ABERTA");
        if (canManageOrdens) setTab("editar");
      }
    }
  }, [queryId, loadingOrdens, ordensVisiveis, canManageOrdens]);

  const addServico = () => {
    if (!servicoDesc.trim() || !servicoValor) {
      Alert.alert("Erro", "Preencha descrição e valor");
      return;
    }
    const parsedValue = Number(String(servicoValor).replace(',', '.'));
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      Alert.alert("Erro", "Informe um valor válido para o serviço");
      return;
    }
    setServicos([...servicos, { id: String(Date.now()), descricao: servicoDesc.trim(), valor: parsedValue }]);
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

  const selecionarVeiculo = (v: Veiculo) => {
    setVeiculoId(v.id);
    setVeiculoSelecionado(v);
    setShowVeiculoList(false);
  };

  const salvarNova = async () => {
    if (!ensureCanManageOrdens()) return;
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
      
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Não foi possível salvar";
      Alert.alert("Erro", String(message));
    }
  };

  const abrirEditar = async (id: string) => {
    if (!ensureCanManageOrdens()) return;
    const o = ordensVisiveis.find(x => x.id === id);
    if (o) {
      setSelectedOrdem(o);
      setEditObservacoes(o.observacoes || "");
      setEditStatus(o.status || "ABERTA");
      setTab("editar");
    }
  };

  const salvarEdicao = async () => {
    if (!selectedOrdem) return;
    if (!ensureCanManageOrdens()) return;
    try {
      const updated = { ...selectedOrdem, observacoes: editObservacoes, status: editStatus };
      await atualizar(updated);
      Alert.alert("Sucesso", "Ordem atualizada");
      setTab("listar");
      
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Não foi possível atualizar";
      Alert.alert("Erro", String(message));
    }
  };

  const handleDelete = (id: string) => {
    if (!ensureCanManageOrdens()) return;
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

  const getVeiculoDescricao = (id?: string) => {
    const veiculo = veiculos.find(v => v.id === id);
    return `${veiculo?.marca || ''} ${veiculo?.modelo || ''} ${veiculo?.placa ? '— ' + veiculo.placa : ''}`;
  };

  return (
    <Container>
      <View style={[styles.tabs, { borderColor: colors.border }]}> 
        <TouchableOpacity style={[styles.tab, tab === "listar" && { borderColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setTab("listar")}>
          <Text style={[styles.tabText, { color: colors.textMuted }, tab === "listar" && { color: colors.primary, fontWeight: '700' }]}>Listar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "criar" && { borderColor: colors.primary, borderBottomWidth: 2 }, !canManageOrdens && { opacity: 0.5 }]}
          onPress={() => (canManageOrdens ? setTab("criar") : ensureCanManageOrdens())}
        >
          <Text style={[styles.tabText, { color: colors.textMuted }, tab === "criar" && { color: colors.primary, fontWeight: '700' }]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "editar" && { borderColor: colors.primary, borderBottomWidth: 2 }, !canManageOrdens && { opacity: 0.5 }]}
          onPress={() => (canManageOrdens ? setTab("editar") : ensureCanManageOrdens())}
        >
          <Text style={[styles.tabText, { color: colors.textMuted }, tab === "editar" && { color: colors.primary, fontWeight: '700' }]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {tab === "listar" && (
        <OrdemListTab
          colors={colors}
          styles={styles}
          loadingOrdens={loadingOrdens}
          ordens={ordensVisiveis}
          auth={{ email: auth.email, isFuncionario: canManageOrdens, isAdmin: auth.isAdmin }}
          getNomeCliente={getNomeCliente}
          onEditar={abrirEditar}
          onExcluir={handleDelete}
        />
      )}
      {tab === "criar" && canManageOrdens && (
        <OrdemCreateTab
          colors={colors}
          styles={styles}
          clientes={clientes}
          veiculos={veiculos}
          clienteId={clienteId}
          clienteSelecionado={clienteSelecionado}
          veiculoSelecionado={veiculoSelecionado}
          showClienteList={showClienteList}
          showVeiculoList={showVeiculoList}
          defeito={defeito}
          observacoes={observacoes}
          servicoDesc={servicoDesc}
          servicoValor={servicoValor}
          servicos={servicos}
          onToggleClienteList={() => setShowClienteList(!showClienteList)}
          onToggleVeiculoList={() => setShowVeiculoList(!showVeiculoList)}
          onSelecionarCliente={selecionarCliente}
          onSelecionarVeiculo={selecionarVeiculo}
          onGoCadastrarVeiculo={() => router.push('/(tabs)/veiculos?clienteId=' + (clienteId || ''))}
          onDefeitoChange={setDefeito}
          onObservacoesChange={setObservacoes}
          onServicoDescChange={setServicoDesc}
          onServicoValorChange={setServicoValor}
          onAddServico={addServico}
          onSalvar={salvarNova}
        />
      )}
      {tab === "editar" && canManageOrdens && (
        <OrdemEditTab
          colors={colors}
          styles={styles}
          selectedOrdem={selectedOrdem}
          editStatus={editStatus}
          editObservacoes={editObservacoes}
          getNomeCliente={getNomeCliente}
          getVeiculoDescricao={getVeiculoDescricao}
          onEditStatus={setEditStatus}
          onEditObservacoes={setEditObservacoes}
          onSalvar={salvarEdicao}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", borderBottomWidth: 2, 
    borderColor: "#eee", 
    marginBottom: 12 },

  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },

  tabActive: { borderBottomWidth: 2, borderColor: "#2596be" },

  tabText: { fontSize: 14, color: "#666" },

  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  label: { marginTop: 12, marginBottom: 6, fontWeight: "600", color: "#333" },

  input: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },

  item: { padding: 12, borderWidth: 1, borderRadius: 12, marginBottom: 10 },

  itemTitle: { fontWeight: "bold", marginBottom: 4 },

  itemSmall: { marginTop: 6 },

  clienteInfo: { fontSize: 13, marginBottom: 4 },
  
  servicoItem: { padding: 8, borderBottomWidth: 1 },

  statusBtn: { paddingVertical: 6, 
    paddingHorizontal: 8, borderRadius: 6, 
    borderWidth: 1, borderColor: "#ccc", 
    marginRight: 4, marginBottom: 4 },

  statusBtnActive: { backgroundColor: "#2596be", borderColor: "#2596be" },
  clienteButton: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 8,
  },
  clienteButtonText: { 
    color: "#333", 
    fontSize: 14,
    fontWeight: "500"
  },
  clienteListContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
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
