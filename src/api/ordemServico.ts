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

function pickString(source: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function getNestedNumber(source: Record<string, unknown> | undefined, keys: string[]): number {
  if (!source) return 0;
  for (const key of keys) {
    const value = source[key];
    const parsed = toNumber(value);
    if (parsed > 0) return parsed;
  }
  return 0;
}

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
  const clienteObj = (item as any)?.cliente as Record<string, unknown> | undefined;
  const funcionarioObj = (item as any)?.funcionario as Record<string, unknown> | undefined;
  const servicosRaw = Array.isArray(item.servicos) ? (item.servicos as Record<string, unknown>[]) : [];
  const servicoComFuncionario = servicosRaw.find((s) =>
    !!pickString(s, ['funcionarioNome', 'nomeFuncionario', 'funcionarioEmail', 'emailFuncionario', 'responsavelNome', 'responsavelEmail'])
  );
  const ownerObj =
    ((item as any)?.owner as Record<string, unknown> | undefined) ||
    ((item as any)?.responsavel as Record<string, unknown> | undefined) ||
    ((item as any)?.usuario as Record<string, unknown> | undefined);
  const ownerText = typeof (item as any)?.owner === 'string' ? String((item as any).owner).trim() : undefined;
  const funcionarioText = typeof (item as any)?.funcionario === 'string' ? String((item as any).funcionario).trim() : undefined;
  const idNumber = toNumber(item.id);
  const numero = toNumber(item.numero) || idNumber || Date.now();
  const clienteId =
    toNumber(item.clienteId) ||
    getNestedNumber(clienteObj, ['id', 'idCliente', 'clienteId']);
  const funcionarioId =
    toNumber(item.funcionarioId ?? item.idFuncionario ?? item.ownerId ?? item.funcionario ?? item.responsavel ?? item.usuario) ||
    getNestedNumber(funcionarioObj, ['id', 'idFuncionario', 'funcionarioId']) ||
    getNestedNumber(ownerObj, ['id', 'idUsuario', 'ownerId']);
  const valor = toNumber(item.valor ?? item.valorTotal);

  const descricao = String(item.descricao ?? item.defeito ?? item.observacoes ?? '').trim();
  const statusRaw = item.statusOrdemServico ?? item.status;
  const status = toStatusOrdem(statusRaw);
  const ownerTextLooksEmail = ownerText && ownerText.includes('@') ? ownerText : undefined;
  const funcionarioTextLooksEmail = funcionarioText && funcionarioText.includes('@') ? funcionarioText : undefined;
  const responsavelFallback = funcionarioId ? `Funcionário #${funcionarioId}` : undefined;
  const funcionarioEmail =
    pickString(item, [
      'funcionarioEmail',
      'emailFuncionario',
      'funcionario_email',
      'FUNCIONARIO_EMAIL',
      'EMAIL_FUNCIONARIO',
      'ownerEmail',
      'owner_email',
      'OWNER_EMAIL',
      'responsavelEmail',
      'responsavel_email',
      'RESPONSAVEL_EMAIL',
      'emailResponsavel',
      'usuarioEmail',
      'USUARIO_EMAIL',
    ]) ||
    pickString(servicoComFuncionario, ['funcionarioEmail', 'emailFuncionario', 'responsavelEmail']) ||
    pickString(funcionarioObj, ['email', 'mail', 'emailFuncionario']) ||
    pickString(ownerObj, ['email', 'mail', 'username', 'login']) ||
    ownerTextLooksEmail ||
    funcionarioTextLooksEmail ||
    undefined;

  const funcionarioNome =
    pickString(item, [
      'funcionarioNome',
      'nomeFuncionario',
      'funcionario_nome',
      'FUNCIONARIO_NOME',
      'NOME_FUNCIONARIO',
      'ownerName',
      'owner_name',
      'OWNER_NAME',
      'nomeResponsavel',
      'responsavelNome',
      'responsavel_nome',
      'RESPONSAVEL_NOME',
      'usuarioNome',
      'USUARIO_NOME',
    ]) ||
    pickString(servicoComFuncionario, ['funcionarioNome', 'nomeFuncionario', 'responsavelNome']) ||
    pickString(funcionarioObj, ['nome', 'name', 'nomeFuncionario', 'login']) ||
    pickString(ownerObj, ['nome', 'name', 'username', 'login']) ||
    (ownerText && !ownerTextLooksEmail ? ownerText : undefined) ||
    (funcionarioText && !funcionarioTextLooksEmail ? funcionarioText : undefined) ||
    funcionarioEmail ||
    responsavelFallback;

  return {
    id: String(idNumber || numero),
    numero,
    clienteId: clienteId ? String(clienteId) : undefined,
    clienteNome: String(item.clienteNome ?? clienteObj?.nome ?? '').trim() || undefined,
    funcionarioId: funcionarioId ? String(funcionarioId) : undefined,
    funcionarioNome,
    funcionarioEmail,
    veiculoId: item.veiculoId ? String(item.veiculoId) : undefined,
    dataAbertura: String(item.dataAbertura ?? item.dataCriacao ?? new Date().toISOString()),
    dataConclusao: item.dataConclusao ? String(item.dataConclusao) : undefined,
    status,
    defeito: descricao || undefined,
    observacoes: String(item.observacoes ?? item.descricao ?? '').trim() || undefined,
    servicos: servicosRaw as any[],
    valorTotal: valor,
    ownerEmail:
      pickString(item, ['ownerEmail', 'owner_email', 'responsavelEmail', 'responsavel_email']) ||
      pickString(ownerObj, ['email', 'mail', 'username', 'login']) ||
      undefined,
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

  const descricao = (ordem.observacoes || ordem.defeito || runtime?.descricao || 'Ordem de servico').trim();
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
