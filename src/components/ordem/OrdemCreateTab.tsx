import { ScrollView, Text, TouchableOpacity, View, FlatList, TextInput, Button } from "react-native";
import { Cliente, Servico, Veiculo } from "../../types";

type Props = {
  colors: any;
  styles: any;
  clientes: Cliente[];
  filteredClientes: Cliente[];
  veiculos: Veiculo[];
  clienteId: string;
  clienteSelecionado: Cliente | null;
  veiculoSelecionado: Veiculo | null;
  showClienteList: boolean;
  showVeiculoList: boolean;
  clienteSearch: string;
  defeito: string;
  observacoes: string;
  servicoDesc: string;
  servicoValor: string;
  servicos: Servico[];
  formatCurrency: (value: number) => string;
  onToggleClienteList: () => void;
  onToggleVeiculoList: () => void;
  onSelecionarCliente: (cliente: Cliente) => void;
  onSelecionarVeiculo: (veiculo: Veiculo) => void;
  onGoCadastrarVeiculo: () => void;
  onClienteSearchChange: (value: string) => void;
  onDefeitoChange: (value: string) => void;
  onObservacoesChange: (value: string) => void;
  onServicoDescChange: (value: string) => void;
  onServicoValorChange: (value: string) => void;
  onAddServico: () => void;
  onSalvar: () => void;
};

export default function OrdemCreateTab({
  colors,
  styles,
  clientes,
  filteredClientes,
  veiculos,
  clienteId,
  clienteSelecionado,
  veiculoSelecionado,
  showClienteList,
  showVeiculoList,
  clienteSearch,
  defeito,
  observacoes,
  servicoDesc,
  servicoValor,
  servicos,
  formatCurrency,
  onToggleClienteList,
  onToggleVeiculoList,
  onSelecionarCliente,
  onSelecionarVeiculo,
  onGoCadastrarVeiculo,
  onClienteSearchChange,
  onDefeitoChange,
  onObservacoesChange,
  onServicoDescChange,
  onServicoValorChange,
  onAddServico,
  onSalvar,
}: Props) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.text }]}>Nova Ordem</Text>

      <Text style={[styles.label, { color: colors.textMuted }]}>Cliente *</Text>
      <TouchableOpacity
        style={[styles.clienteButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
        onPress={onToggleClienteList}
      >
        <Text style={[styles.clienteButtonText, { color: colors.text }]}>
          {clienteSelecionado ? clienteSelecionado.nome : "Selecione um cliente"}
        </Text>
      </TouchableOpacity>

      {showClienteList && (
        <View style={[styles.clienteListContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            placeholder="Pesquisar cliente"
            value={clienteSearch}
            onChangeText={onClienteSearchChange}
            style={[styles.input, { margin: 8, marginBottom: 0, borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceAlt || colors.surface }]}
            placeholderTextColor={colors.textMuted}
          />
          <FlatList
            data={filteredClientes}
            keyExtractor={(c) => c.id}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={{ padding: 12, color: colors.textMuted }}>Nenhum cliente encontrado</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.clienteListItem, { borderBottomColor: colors.border }]}
                onPress={() => onSelecionarCliente(item)}
              >
                <Text style={[styles.clienteListItemText, { color: colors.text }]}>{item.nome}</Text>
                {item.telefone && <Text style={[styles.clienteListItemPhone, { color: colors.textMuted }]}>{item.telefone}</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Text style={[styles.label, { color: colors.textMuted }]}>Veiculo *</Text>
      <TouchableOpacity
        style={[styles.clienteButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
        onPress={onToggleVeiculoList}
      >
        <Text style={[styles.clienteButtonText, { color: colors.text }]}>
          {veiculoSelecionado
            ? `${veiculoSelecionado.marca} ${veiculoSelecionado.modelo} — ${veiculoSelecionado.placa}`
            : clienteSelecionado
              ? "Selecione um veículo"
              : "Selecione um cliente primeiro"}
        </Text>
      </TouchableOpacity>

      {showVeiculoList && (
        <View style={[styles.clienteListContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <FlatList
            data={veiculos.filter((v) => String(v.clienteId) === String(clienteId))}
            keyExtractor={(v) => v.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.clienteListItem, { borderBottomColor: colors.border }]}
                onPress={() => onSelecionarVeiculo(item)}
              >
                <Text style={[styles.clienteListItemText, { color: colors.text }]}>{item.marca} {item.modelo} — {item.placa}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={{ padding: 12, alignItems: "center" }} onPress={onGoCadastrarVeiculo}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>Cadastrar veiculo</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.label, { color: colors.textMuted }]}>Defeito *</Text>
      <TextInput
        placeholder="Descreva o defeito"
        value={defeito}
        onChangeText={onDefeitoChange}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
        placeholderTextColor={colors.textMuted}
      />

      <Text style={[styles.label, { color: colors.textMuted }]}>Observacoes</Text>
      <TextInput
        placeholder="Observações adicionais"
        value={observacoes}
        onChangeText={onObservacoesChange}
        style={[styles.input, { height: 60, borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
        placeholderTextColor={colors.textMuted}
        multiline
      />

      <Text style={[styles.label, { color: colors.textMuted }]}>Servicos</Text>
      <TextInput
        placeholder="Descrição do serviço"
        value={servicoDesc}
        onChangeText={onServicoDescChange}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
        placeholderTextColor={colors.textMuted}
      />
      <TextInput
        placeholder="Valor (R$)"
        value={servicoValor}
        onChangeText={onServicoValorChange}
        keyboardType="numeric"
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
        placeholderTextColor={colors.textMuted}
      />
      <Button title="Adicionar Serviço" onPress={onAddServico} />

      <FlatList
        data={servicos}
        keyExtractor={(s) => s.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.servicoItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <Text style={{ color: colors.text }}>{item.descricao} - {formatCurrency(item.valor)}</Text>
          </View>
        )}
      />

      <View style={{ marginTop: 12, marginBottom: 20 }}>
        <Button title="Salvar Ordem" onPress={onSalvar} />
      </View>
    </ScrollView>
  );
}
