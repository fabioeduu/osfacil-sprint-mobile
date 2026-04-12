import { api } from './api';
import { OrdemServico, StatusOrdem } from '../types';

type OrdemServicoDTO = {
  clienteId: number;
  statusOrdemServico: string;
  descricao: string;
  statusPagamento: string;
  valor: number;
};

type ApiStatusOrdem = 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

type RawOrdem = Record<string, unknown>;

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function toStatusOrdem(value: unknown): StatusOrdem {
  const normalized = String(value ?? '').trim().toUpperCase();

  if (normalized === 'ABERTA') return 'ABERTA';
  if (normalized === 'EM_ANDAMENTO') return 'EM_ANDAMENTO';
  if (normalized === 'CONCLUIDA') return 'CONCLUIDA';
  if (normalized === 'CANCELADA') return 'CANCELADA';
  if (normalized === 'AGUARDANDO_PECAS') return 'AGUARDANDO_PECAS';

  return 'ABERTA';
}

function toApiStatusOrdem(value: StatusOrdem | undefined): ApiStatusOrdem {
  if (value === 'CONCLUIDA') return 'CONCLUIDA';
  if (value === 'CANCELADA') return 'CANCELADA';
  if (value === 'AGUARDANDO_PECAS') return 'EM_ANDAMENTO';
  if (value === 'EM_ANDAMENTO') return 'EM_ANDAMENTO';
  return 'ABERTA';
}

function normalizeOrdem(item: RawOrdem): OrdemServico {
  const idNumber = toNumber(item.id);
  const numero = toNumber(item.numero) || idNumber || Date.now();
  const clienteId = toNumber(item.clienteId ?? (item as any)?.cliente?.id);
  const valor = toNumber(item.valor ?? item.valorTotal);

  const descricao = String(item.descricao ?? item.defeito ?? item.observacoes ?? '').trim();
  const statusRaw = item.statusOrdemServico ?? item.status;
  const status = toStatusOrdem(statusRaw);

  return {
    id: String(idNumber || numero),
    numero,
    clienteId: clienteId ? String(clienteId) : undefined,
    veiculoId: item.veiculoId ? String(item.veiculoId) : undefined,
    dataAbertura: String(item.dataAbertura ?? item.dataCriacao ?? new Date().toISOString()),
    dataConclusao: item.dataConclusao ? String(item.dataConclusao) : undefined,
    status,
    defeito: descricao || undefined,
    observacoes: String(item.observacoes ?? item.descricao ?? '').trim() || undefined,
    servicos: Array.isArray(item.servicos) ? (item.servicos as any[]) : [],
    valorTotal: valor,
    ownerEmail: item.ownerEmail ? String(item.ownerEmail) : undefined,
  };
}

function unwrapOrdensPayload(data: unknown): RawOrdem[] {
  if (Array.isArray(data)) {
    return data.filter((item) => item && typeof item === 'object') as RawOrdem[];
  }

  if (data && typeof data === 'object') {
    const payload = data as Record<string, unknown>;

    if (Array.isArray(payload.content)) {
      return payload.content.filter((item) => item && typeof item === 'object') as RawOrdem[];
    }

    if (Array.isArray(payload.ordemServicos)) {
      return payload.ordemServicos.filter((item) => item && typeof item === 'object') as RawOrdem[];
    }

    const embedded = payload._embedded as Record<string, unknown> | undefined;
    if (embedded && Array.isArray(embedded.ordemServicos)) {
      return embedded.ordemServicos.filter((item) => item && typeof item === 'object') as RawOrdem[];
    }
  }

  return [];
}

function toOrdemServicoDTO(ordem: Partial<OrdemServico>): OrdemServicoDTO {
  const runtime = ordem as Record<string, any>;
  const clienteId = toNumber(ordem.clienteId ?? runtime?.cliente?.id ?? runtime?.clienteId);
  if (!clienteId) {
    throw new Error('Cliente obrigatorio para salvar ordem.');
  }

  const descricao = (ordem.defeito || ordem.observacoes || runtime?.descricao || 'Ordem de servico').trim();
  const valorServicos = Array.isArray(ordem.servicos)
    ? ordem.servicos.reduce((total, item) => total + (Number(item.valor) || 0), 0)
    : 0;
  const valorTotal = Number(ordem.valorTotal);
  const valorApi = Number(runtime?.valor);
  const valor =
    (Number.isFinite(valorTotal) && valorTotal > 0 ? valorTotal : 0) ||
    (Number.isFinite(valorApi) && valorApi > 0 ? valorApi : 0) ||
    valorServicos;

  if (!valor || valor <= 0) {
    throw new Error('Valor da ordem obrigatorio para salvar.');
  }

  return {
    clienteId,
    statusOrdemServico: toApiStatusOrdem(ordem.status),
    descricao,
    statusPagamento: 'PENDENTE',
    valor,
  };
}

export async function getOrdensServico(): Promise<OrdemServico[]> {
  const response = await api.get<any>('/ordem-servicos');
  const rows = unwrapOrdensPayload(response.data);
  return rows.map(normalizeOrdem);
}

export async function getOrdemServico(id: string): Promise<OrdemServico> {
  const response = await api.get<any>(`/ordem-servicos/${id}`);
  return normalizeOrdem(response.data as RawOrdem);
}

export async function postOrdemServico(novaOrdem: Omit<OrdemServico, 'id'>): Promise<OrdemServico> {
  const dto = toOrdemServicoDTO(novaOrdem);
  const response = await api.post<any>('/ordem-servicos', dto);
  return normalizeOrdem(response.data as RawOrdem);
}

export async function putOrdemServico(params: {
  id: string;
  numero?: number;
  clienteId?: string;
  veiculoId?: string;
  dataAbertura: string;
  dataConclusao?: string;
  status: StatusOrdem;
  defeito?: string;
  observacoes?: string;
  servicos?: any[];
  valorTotal?: number;
}): Promise<OrdemServico> {
  const { id, ...body } = params;
  const dto = toOrdemServicoDTO(body);
  const response = await api.put<any>(`/ordem-servicos/${id}`, dto);
  return normalizeOrdem(response.data as RawOrdem);
}

export async function deleteOrdemServico(id: string): Promise<void> {
  await api.delete(`/ordem-servicos/${id}`);
}
