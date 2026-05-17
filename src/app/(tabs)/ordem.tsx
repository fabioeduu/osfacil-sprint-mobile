import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from "react-native";
import Container from "../../components/Container";
import { useOrdens, useClientes, useVeiculos } from "../../hooks";
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../hooks";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { Servico, Cliente, Veiculo, OrdemServico, StatusOrdem } from "../../types";
import { useAppTheme } from '../../theme';
import OrdemListTab from "../../components/ordem/OrdemListTab";
import OrdemCreateTab from "../../components/ordem/OrdemCreateTab";
import OrdemEditTab from "../../components/ordem/OrdemEditTab";

type Tab = "listar" | "criar" | "editar";

export default function OrdensPage() {
  const { colors } = useAppTheme();
  const { id: queryId } = useLocalSearchParams();
  const { sendNotification } = useNotification();
  const auth = useAuth();
  const router = useRouter();
  
  
  if (auth.role && !['funcionario', 'admin'].includes(auth.role.toLowerCase())) {
    return <Redirect href="/(tabs)/busca" />;
  }
  
  const [tab, setTab] = useState<Tab>("listar");
  const { ordens, loading: loadingOrdens, criar, atualizar, remover } = useOrdens();
  const { clientes } = useClientes();
  const { veiculos } = useVeiculos();
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
  const [editValorMaoObra, setEditValorMaoObra] = useState("");
  const [editStatus, setEditStatus] = useState<StatusOrdem>("ABERTA");
  const [showClienteList, setShowClienteList] = useState(false);
  const [showVeiculoList, setShowVeiculoList] = useState(false);
  const [clienteSearch, setClienteSearch] = useState('');
  const [ordemDetalheAberta, setOrdemDetalheAberta] = useState<OrdemServico | null>(null);
  const canManageOrdens = auth.isAuthenticated;
  const ordensVisiveis = ordens;

  const formatValorServico = (value: string) => {
    const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
    const parts = normalized.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = (parts[1] || '').slice(0, 2);
    return parts.length > 1 ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(safeValue);
  };

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
        setEditValorMaoObra(String(o.valorTotal ?? 0));
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
    setClienteSearch('');
    
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
        await sendNotification(
          "Nova Ordem Criada",
          `Ordem de serviço #{defeito} foi criada com sucesso para ${clienteSelecionado?.nome || 'cliente'}`,
          { orderId: selectedOrdem?.id, screen: '/(tabs)/ordem' },
          2
        );
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
      setEditValorMaoObra(String(o.valorTotal ?? 0));
      setTab("editar");
    }
  };

  const salvarEdicao = async () => {
    if (!selectedOrdem) return;
    if (!ensureCanManageOrdens()) return;
    try {
      const valorMaoObra = Number(String(editValorMaoObra).replace(',', '.'));
      if (!Number.isFinite(valorMaoObra) || valorMaoObra < 0) {
        Alert.alert('Erro', 'Informe um valor válido para a mão de obra');
        return;
      }

      const updated = {
        ...selectedOrdem,
        observacoes: editObservacoes,
        status: editStatus,
        valorTotal: valorMaoObra,
      };
      await atualizar(updated);
      setSelectedOrdem(updated);
      setOrdemDetalheAberta((current) => (current?.id === updated.id ? updated : current));
      Alert.alert("Sucesso", "Ordem atualizada");
        await sendNotification(
          "Ordem Atualizada",
          `Ordem #{updated.numero} foi atualizada para status: ${editStatus}`,
          { orderId: updated.id, screen: '/(tabs)/ordem' },
          1
        );
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

  const getNomeCliente = (id?: string, nomeFallback?: string) => {
    if (!id) return nomeFallback || "Sem cliente";
    const normalizedId = String(id).trim();
    const cliente = clientes.find(c => String(c.id).trim() === normalizedId);
    return cliente?.nome || nomeFallback || "Cliente desconhecido";
  };

  const getVeiculoDescricao = (id?: string) => {
    const veiculo = veiculos.find(v => v.id === id);
    return `${veiculo?.marca || ''} ${veiculo?.modelo || ''} ${veiculo?.placa ? '— ' + veiculo.placa : ''}`;
  };

  const formatValorDigitado = (value: string) => {
    const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
    const parts = normalized.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = (parts[1] || '').slice(0, 2);
    return parts.length > 1 ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const getFuncionarioNome = (ordem: OrdemServico) => {
    if (ordem.funcionarioNome) return ordem.funcionarioNome;
    if (ordem.funcionarioEmail) {
      if (ordem.funcionarioEmail === auth.email && auth.profile?.nome) {
        return auth.profile.nome;
      }
      return ordem.funcionarioEmail;
    }
    if (ordem.ownerEmail) {
      if (ordem.ownerEmail === auth.email && auth.profile?.nome) {
        return auth.profile.nome;
      }
      return ordem.ownerEmail;
    }
    return 'Funcionário não informado';
  };

  const getFuncionarioDetalhe = (ordem: OrdemServico) => {
    const nome = getFuncionarioNome(ordem);
    const email = ordem.funcionarioEmail || ordem.ownerEmail || auth.email || undefined;
    return { nome, email };
  };

  const filteredClientes = clientes.filter((cliente) => {
    const query = clienteSearch.trim().toLowerCase();
    if (!query) return true;
    return [cliente.nome, cliente.email || '', cliente.cpf || '', cliente.telefone || '']
      .some((field) => String(field).toLowerCase().includes(query));
  });

  const clienteVeiculosDaOrdem = veiculos.filter((veiculo) => String(veiculo.clienteId) === String(selectedOrdem?.clienteId || ordemDetalheAberta?.clienteId || ''));

  return (
    <>
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
          formatCurrency={formatCurrency}
          onSelecionarOrdem={(id) => {
            const ordem = ordensVisiveis.find((item) => item.id === id) || null;
            setOrdemDetalheAberta(ordem);
          }}
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
          clienteSearch={clienteSearch}
          filteredClientes={filteredClientes}
          defeito={defeito}
          observacoes={observacoes}
          servicoDesc={servicoDesc}
          servicoValor={servicoValor}
          servicos={servicos}
          formatCurrency={formatCurrency}
          onToggleClienteList={() => {
            const next = !showClienteList;
            setShowClienteList(next);
            if (!next) setClienteSearch('');
          }}
          onToggleVeiculoList={() => setShowVeiculoList(!showVeiculoList)}
          onSelecionarCliente={selecionarCliente}
          onSelecionarVeiculo={selecionarVeiculo}
          onGoCadastrarVeiculo={() => router.push('/(tabs)/veiculos?clienteId=' + (clienteId || ''))}
          onClienteSearchChange={setClienteSearch}
          onDefeitoChange={setDefeito}
          onObservacoesChange={setObservacoes}
          onServicoDescChange={setServicoDesc}
          onServicoValorChange={(value) => setServicoValor(formatValorServico(value))}
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
          editValorMaoObra={editValorMaoObra}
          clienteVeiculos={clienteVeiculosDaOrdem}
          formatCurrency={formatCurrency}
          getNomeCliente={getNomeCliente}
          getVeiculoDescricao={getVeiculoDescricao}
          onEditStatus={setEditStatus}
          onEditObservacoes={setEditObservacoes}
          onEditValorMaoObra={(value) => setEditValorMaoObra(formatValorDigitado(value))}
          onSalvar={salvarEdicao}
        />
      )}
    </Container>
      <Modal
        visible={Boolean(ordemDetalheAberta)}
        transparent
        animationType="fade"
        onRequestClose={() => setOrdemDetalheAberta(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>Detalhes da Ordem #{ordemDetalheAberta?.numero}</Text>

            {ordemDetalheAberta ? (
              <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
                <View style={[styles.modalSection, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                  <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Status</Text>
                  <Text style={[styles.modalValue, { color: colors.primary }]}>{ordemDetalheAberta.status}</Text>
                </View>

                <View style={[styles.modalSection, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                  <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Observação</Text>
                  <Text style={[styles.modalValue, { color: colors.text }]}>{ordemDetalheAberta.observacoes || ordemDetalheAberta.defeito || 'Sem observação'}</Text>
                </View>

                <View style={[styles.modalSection, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                  <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Cliente</Text>
                  <Text style={[styles.modalValue, { color: colors.text }]}>{getNomeCliente(ordemDetalheAberta.clienteId, ordemDetalheAberta.clienteNome)}</Text>
                </View>

                <View style={[styles.modalSection, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                  <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Funcionário responsável</Text>
                  <Text style={[styles.modalValue, { color: colors.text }]}>{getFuncionarioDetalhe(ordemDetalheAberta).nome}</Text>
                  {getFuncionarioDetalhe(ordemDetalheAberta).email ? (
                    <Text style={[styles.modalSubValue, { color: colors.textMuted }]}>{getFuncionarioDetalhe(ordemDetalheAberta).email}</Text>
                  ) : null}
                </View>

                <View style={[styles.modalSection, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                  <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Serviços</Text>
                  {ordemDetalheAberta.servicos?.length ? ordemDetalheAberta.servicos.map((servico) => (
                    <View key={servico.id} style={{ marginBottom: 8 }}>
                      <Text style={[styles.modalValue, { color: colors.text }]}>{servico.descricao} - {formatCurrency(Number(servico.valor))}</Text>
                      {(
                        (servico as any).funcionarioNome || (servico as any).funcionarioEmail
                      ) ? (
                        <Text style={[styles.modalSubValue, { color: colors.textMuted }]}>Realizado por: {( (servico as any).funcionarioNome || (servico as any).funcionarioEmail )}</Text>
                      ) : null}
                    </View>
                  )) : (
                    <Text style={[styles.modalValue, { color: colors.text }]}>Sem serviços adicionais</Text>
                  )}
                </View>

                <View style={[styles.modalSection, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}> 
                  <Text style={[styles.modalLabel, { color: colors.textMuted }]}>Valor total</Text>
                  <Text style={[styles.modalValue, { color: colors.primary }]}>{formatCurrency(ordemDetalheAberta.valorTotal)}</Text>
                </View>
              </ScrollView>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primarySoft }]}
                onPress={() => setOrdemDetalheAberta(null)}
              >
                <Text style={[styles.modalButtonText, { color: colors.primary }]}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  },
  vehicleCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  vehicleGridCard: {
    flex: 0.48,
  },
  vehiclesGridContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 8,
  },
  vehicleCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  vehicleTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  vehicleSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  vehicleMeta: {
    fontSize: 12,
    lineHeight: 18,
  },
  linkChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center',
  },
  linkChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSection: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  modalSubValue: {
    fontSize: 12,
    marginTop: 4,
  },
  modalActions: {
    marginTop: 6,
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: '700',
  },
  detailBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  detailLine: {
    fontSize: 13,
    lineHeight: 18,
  }
});
