import { api } from './api';
import { Veiculo } from '../types';

type VeiculoDTO = {
  clienteId: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
};

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function toVeiculoDTO(payload: Omit<Veiculo, 'id' | 'dataCadastro'>): VeiculoDTO {
  const clienteId = toNumber(payload.clienteId);
  const ano = toNumber(payload.ano);

  if (!clienteId) throw new Error('Cliente obrigatorio para salvar veiculo.');
  if (!ano) throw new Error('Ano obrigatorio para salvar veiculo.');

  return {
    clienteId,
    marca: String(payload.marca || '').trim(),
    modelo: String(payload.modelo || '').trim(),
    placa: String(payload.placa || '').trim(),
    ano,
    cor: String(payload.cor || '').trim(),
  };
}

export async function getVeiculos(): Promise<Veiculo[]> {
  const response = await api.get<any>('/veiculos');
  console.log('[veiculo.ts] Response:', JSON.stringify(response.data, null, 2));
  
  let data = response.data;
  
  if (data?.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  if (data?._embedded?.veiculos) {
    return data._embedded.veiculos;
  }
  
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data?.veiculos && Array.isArray(data.veiculos)) {
    return data.veiculos;
  }
  
  console.warn('[veiculo.ts] Resposta em formato inesperado:', data);
  return [];
}

export async function getVeiculo(id: string): Promise<Veiculo> {
  const response = await api.get<Veiculo>(`/veiculos/${id}`);
  return response.data;
}

export async function postVeiculo(novoVeiculo: Omit<Veiculo, 'id' | 'dataCadastro'>): Promise<Veiculo> {
  const dto = toVeiculoDTO(novoVeiculo);
  
  try {
    const response = await api.post<Veiculo>('/veiculos', dto);
    return response.data;
  } catch (error: any) {
    console.error('[veiculo.ts] Erro ao criar veículo:', error?.response?.data?.message || error?.message);
    throw error;
  }
}

export async function putVeiculo(params: {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: string;
  cor?: string;
  clienteId: string;
}): Promise<Veiculo> {
  const { id, ...body } = params;
  const dto = toVeiculoDTO(body as Omit<Veiculo, 'id' | 'dataCadastro'>);
  const response = await api.put<Veiculo>(`/veiculos/${id}`, dto);
  return response.data;
}

export async function deleteVeiculo(id: string): Promise<void> {
  await api.delete(`/veiculos/${id}`);
}
