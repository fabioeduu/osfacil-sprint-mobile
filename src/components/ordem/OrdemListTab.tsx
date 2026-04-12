import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";
import { OrdemServico } from "../../types";

type AuthLike = {
  email: string | null;
  isAdmin: () => boolean;
  isFuncionario: boolean;
};

type Props = {
  colors: any;
  styles: any;
  loadingOrdens: boolean;
  ordens: OrdemServico[];
  auth: AuthLike;
  getNomeCliente: (id?: string) => string;
  onEditar: (id: string) => void;
  onExcluir: (id: string) => void;
};

export default function OrdemListTab({
  colors,
  styles,
  loadingOrdens,
  ordens,
  auth,
  getNomeCliente,
  onEditar,
  onExcluir,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.text }]}>Ordens de Servico</Text>
      {loadingOrdens ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} /> : null}
      <FlatList
        data={ordens}
        keyExtractor={(o) => o.id}
        ListEmptyComponent={!loadingOrdens ? <Text style={{ marginTop: 18, color: colors.textMuted }}>Nenhuma ordem para acompanhar</Text> : null}
        renderItem={({ item }) => {
          const canModify = auth.isFuncionario || auth.isAdmin();
          return (
            <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <Text style={[styles.itemTitle, { color: colors.text }]}>Ordem #{item.numero}  {item.status}</Text>
              <Text style={[styles.clienteInfo, { color: colors.primary }]}>Cliente: {getNomeCliente(item.clienteId)}</Text>
              <Text numberOfLines={2} style={{ color: colors.text }}>{item.defeito}</Text>
              <Text style={[styles.itemSmall, { color: colors.textMuted }]}>R$ {Number(item.valorTotal).toFixed(2)}</Text>
              <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                {canModify ? (
                  <>
                    <Button title="Editar" onPress={() => onEditar(item.id)} />
                    <Button color="#d9534f" title="Excluir" onPress={() => onExcluir(item.id)} />
                  </>
                ) : (
                  <Text style={{ color: colors.textMuted, fontSize: 12, alignSelf: "center" }}>Acompanhamento disponivel para cliente</Text>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
