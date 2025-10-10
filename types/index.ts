export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  endereco?: string;
  cpf?: string;
  cnpj?: string;
  dataCadastro: Date;
}

export interface Veiculo {
  id: string;
  clienteId: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor?: string;
  combustivel?: 'gasolina' | 'etanol' | 'diesel' | 'flex' | 'gnv' | 'eletrico';
  km?: number;
  chassi?: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  tempoPrevisto?: number;
  categoria: 'mecanica' | 'eletrica' | 'funilaria' | 'pintura' | 'revisao' | 'outro';
}

export interface ItemOrdemServico {
  id: string;
  servicoId: string;
  servico: Servico;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacoes?: string;
}

export interface OrdemServico {
  id: string;
  numero: string;
  cliente: Cliente;
  veiculo: Veiculo;
  dataAbertura: Date;
  dataPrevisao?: Date;
  dataConclusao?: Date;
  status: 'aberta' | 'em_andamento' | 'aguardando_peca' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  itens: ItemOrdemServico[];
  observacoes?: string;
  observacoesInternas?: string;
  valorTotal: number;
  valorDesconto?: number;
  valorFinal: number;
  formaPagamento?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto';
  responsavelTecnico?: string;
  garantia?: number;
}

export type StatusOS = OrdemServico['status'];
export type PrioridadeOS = OrdemServico['prioridade'];
export type CategoriaServico = Servico['categoria'];
export type FormaPagamento = NonNullable<OrdemServico['formaPagamento']>;