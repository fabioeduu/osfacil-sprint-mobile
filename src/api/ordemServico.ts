import { api } from './api';
import { OrdemServico } from '../types';

export async function getOrdensServico(): Promise<OrdemServico[]> {
  const response = await api.get<any>('/ordem-servicos');
  console.log('[ordemServico.ts] Response:', JSON.stringify(response.data, null, 2));
  
  let data = response.data;
  
  if (data?.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  if (data?._embedded?.ordemServicos) {
    return data._embedded.ordemServicos;
  }
  
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data?.ordemServicos && Array.isArray(data.ordemServicos)) {
    return data.ordemServicos;
  }
  
  console.warn('[ordemServico.ts] Resposta em formato inesperado:', data);
  return [];
}

export async function getOrdemServico(id: string): Promise<OrdemServico> {
  const response = await api.get<OrdemServico>(`/ordem-servicos/${id}`);
  return response.data;
}

export async function postOrdemServico(novaOrdem: Omit<OrdemServico, 'id'>): Promise<OrdemServico> {
  console.log('[ordemServico.ts] POST Payload:', JSON.stringify(novaOrdem));
  const response = await api.post<OrdemServico>('/ordem-servicos', novaOrdem);
  console.log('[ordemServico.ts] POST Response:', JSON.stringify(response.data));
  return response.data;
}

export async function putOrdemServico(params: {
  id: string;
  numero?: number;
  clienteId?: string;
  veiculoId?: string;
  dataAbertura: string;
  dataConclusao?: string;
  status: string;
  defeito?: string;
  observacoes?: string;
  servicos?: any[];
  valorTotal?: number;
}): Promise<OrdemServico> {
  const { id, ...body } = params;
  const response = await api.put<OrdemServico>(`/ordem-servicos/${id}`, body);
  return response.data;
}

export async function deleteOrdemServico(id: string): Promise<void> {
  await api.delete(`/ordem-servicos/${id}`);
}
