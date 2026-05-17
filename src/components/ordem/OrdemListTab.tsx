import { View, Text, FlatList, Button, ActivityIndicator, TouchableOpacity } from "react-native";
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
  getNomeCliente: (id?: string, nomeFallback?: string) => string;
  formatCurrency: (value: number) => string;
  onSelecionarOrdem: (id: string) => void;
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
  formatCurrency,
  onSelecionarOrdem,
  onEditar,
  onExcluir,
}: Props) {
  const getResponsavel = (ordem: OrdemServico) => {
    return ordem.funcionarioNome || ordem.funcionarioEmail || ordem.ownerEmail || (ordem.funcionarioId ? `Funcionário #${ordem.funcionarioId}` : 'Não informado');
  };

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
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onSelecionarOrdem(item.id)}
              style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.itemTitle, { color: colors.text }]}>Ordem #{item.numero}</Text>
              <Text style={[styles.itemSmall, { color: colors.textMuted }]}>Clique para ver detalhes da manutenção</Text>
              <Text numberOfLines={2} style={{ color: colors.text }}>{item.defeito}</Text>
              <Text style={[styles.itemSmall, { color: colors.textMuted }]}>Funcionário: {getResponsavel(item)}</Text>
              <Text style={[styles.itemSmall, { color: colors.textMuted }]}>{formatCurrency(Number(item.valorTotal))}</Text>
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
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
