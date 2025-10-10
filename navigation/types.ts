
export type RootStackParamList = {
  Home: undefined;
  ListaOS: undefined;
  NovaOS: undefined;
  DetalhesOS: { osId: string };
  EditarOS: { osId: string };
  Clientes: undefined;
  NovoCliente: undefined;
  EditarCliente: { clienteId: string };
  Veiculos: { clienteId?: string };
  NovoVeiculo: { clienteId?: string };
  EditarVeiculo: { veiculoId: string };
  Servicos: undefined;
  NovoServico: undefined;
  EditarServico: { servicoId: string };
  Relatorios: undefined;
  Notificacoes: undefined;
  Configuracoes: undefined;
};