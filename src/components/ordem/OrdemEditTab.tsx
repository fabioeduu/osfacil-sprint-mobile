import { ScrollView, Text, View, TouchableOpacity, TextInput, Button } from "react-native";
import { OrdemServico, StatusOrdem } from "../../types";

const statusOptions: StatusOrdem[] = ["ABERTA", "EM_ANDAMENTO", "AGUARDANDO_PECAS", "CONCLUIDA", "CANCELADA"];

type Props = {
  colors: any;
  styles: any;
  selectedOrdem: OrdemServico | null;
  editStatus: StatusOrdem;
  editObservacoes: string;
  getNomeCliente: (id?: string) => string;
  getVeiculoDescricao: (id?: string) => string;
  onEditStatus: (status: StatusOrdem) => void;
  onEditObservacoes: (value: string) => void;
  onSalvar: () => void;
};

export default function OrdemEditTab({
  colors,
  styles,
  selectedOrdem,
  editStatus,
  editObservacoes,
  getNomeCliente,
  getVeiculoDescricao,
  onEditStatus,
  onEditObservacoes,
  onSalvar,
}: Props) {
  return (
    <ScrollView style={{ flex: 1 }}>
      {selectedOrdem ? (
        <>
          <Text style={styles.title}>Ordem #{selectedOrdem.numero}</Text>
          <Text style={[styles.clienteInfo, { color: colors.primary }]}>Cliente: {getNomeCliente(selectedOrdem.clienteId)}</Text>
          <Text style={[styles.clienteInfo, { color: colors.primary }]}>Veiculo: {getVeiculoDescricao(selectedOrdem.veiculoId)}</Text>
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
