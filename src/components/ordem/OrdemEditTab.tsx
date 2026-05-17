import { ScrollView, Text, View, TouchableOpacity, TextInput, Button, FlatList } from "react-native";
import { Cliente, OrdemServico, StatusOrdem, Veiculo } from "../../types";

const statusOptions: StatusOrdem[] = ["ABERTA", "EM_ANDAMENTO", "AGUARDANDO_PECAS", "CONCLUIDA", "CANCELADA"];

type Props = {
  colors: any;
  styles: any;
  selectedOrdem: OrdemServico | null;
  editStatus: StatusOrdem;
  editObservacoes: string;
  editValorMaoObra: string;
  clienteVeiculos: Veiculo[];
  formatCurrency: (value: number) => string;
  getNomeCliente: (id?: string, nomeFallback?: string) => string;
  getVeiculoDescricao: (id?: string) => string;
  onEditStatus: (status: StatusOrdem) => void;
  onEditObservacoes: (value: string) => void;
  onEditValorMaoObra: (value: string) => void;
  onSalvar: () => void;
};

export default function OrdemEditTab({
  colors,
  styles,
  selectedOrdem,
  editStatus,
  editObservacoes,
  editValorMaoObra,
  clienteVeiculos,
  formatCurrency,
  getNomeCliente,
  getVeiculoDescricao,
  onEditStatus,
  onEditObservacoes,
  onEditValorMaoObra,
  onSalvar,
}: Props) {
  const linkedVehicleId = selectedOrdem?.veiculoId ? String(selectedOrdem.veiculoId) : '';

  return (
    <ScrollView style={{ flex: 1 }}>
      {selectedOrdem ? (
        <>
          <Text style={styles.title}>Ordem #{selectedOrdem.numero}</Text>
          <Text style={[styles.clienteInfo, { color: colors.primary }]}>Cliente atual: {getNomeCliente(selectedOrdem.clienteId, selectedOrdem.clienteNome)}</Text>
          <Text style={[styles.clienteInfo, { color: colors.primary }]}>Veiculo: {getVeiculoDescricao(selectedOrdem.veiculoId)}</Text>
          <Text style={[styles.clienteInfo, { color: colors.primary }]}>Valor total: {formatCurrency(Number(selectedOrdem.valorTotal))}</Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Cliente da ordem</Text>
          <Text style={[styles.clienteInfo, { color: colors.primary }]}>Cliente selecionado: {getNomeCliente(selectedOrdem.clienteId, selectedOrdem.clienteNome)}</Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Veículos cadastrados do cliente</Text>
          <View style={[styles.vehiclesGridContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <FlatList
              data={clienteVeiculos}
              keyExtractor={(veiculo) => veiculo.id}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={{ gap: 12, justifyContent: 'space-between', marginBottom: 8 }}
              ListEmptyComponent={<Text style={{ padding: 12, color: colors.textMuted, textAlign: 'center', width: '100%' }}>Nenhum veículo cadastrado para este cliente</Text>}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.vehicleCard,
                    styles.vehicleGridCard,
                    { borderColor: colors.border, backgroundColor: colors.surfaceAlt },
                    linkedVehicleId === item.id && { 
                      borderColor: colors.primary, 
                      backgroundColor: colors.primary,
                      elevation: 8,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      transform: [{ scale: 1.02 }],
                    },
                  ]}
                >
                  <View style={styles.vehicleCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        styles.vehicleTitle, 
                        { color: linkedVehicleId === item.id ? '#fff' : colors.text }
                      ]}>{item.marca} {item.modelo}</Text>
                      <Text style={[
                        styles.vehicleSubtitle, 
                        { color: linkedVehicleId === item.id ? 'rgba(255,255,255,0.8)' : colors.textMuted }
                      ]}>{item.placa}</Text>
                    </View>
                    {linkedVehicleId === item.id ? (
                      <View style={[styles.linkChip, { backgroundColor: '#fff', opacity: 0.95 }]}> 
                        <Text style={[styles.linkChipText, { color: colors.primary }]}>Vinculado</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[
                    styles.vehicleMeta, 
                    { color: linkedVehicleId === item.id ? 'rgba(255,255,255,0.8)' : colors.textMuted }
                  ]}>Ano: {item.ano || '---'}</Text>
                  {item.cor ? <Text style={[
                    styles.vehicleMeta, 
                    { color: linkedVehicleId === item.id ? 'rgba(255,255,255,0.8)' : colors.textMuted }
                  ]}>Cor: {item.cor}</Text> : null}
                </View>
              )}
            />
          </View>

          <Text style={[styles.label, { color: colors.textMuted }]}>Valor cobrado pela mão de obra</Text>
          <TextInput
            value={editValorMaoObra}
            onChangeText={onEditValorMaoObra}
            placeholder="0.00"
            keyboardType="numeric"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            placeholderTextColor={colors.textMuted}
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>Status</Text>
          <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusBtn,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  editStatus === status && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => onEditStatus(status)}
              >
                <Text style={{ color: editStatus === status ? "#fff" : colors.text, fontSize: 12 }}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.label, { color: colors.textMuted }]}>Observacoes</Text>
          <TextInput
            value={editObservacoes}
            onChangeText={onEditObservacoes}
            style={[styles.input, { height: 80, borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            multiline
          />
          <View style={{ marginTop: 12, marginBottom: 20 }}>
            <Button title="Salvar" onPress={onSalvar} />
          </View>
        </>
      ) : (
        <Text style={{ marginTop: 20, textAlign: "center", color: colors.textMuted }}>Selecione uma ordem</Text>
      )}
    </ScrollView>
  );
}
