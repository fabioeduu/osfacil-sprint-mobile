import { api } from './api';
import { Veiculo } from '../types';

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
  console.log('[veiculo.ts] POST Payload:', JSON.stringify(novoVeiculo));
  const response = await api.post<Veiculo>('/veiculos', novoVeiculo);
  console.log('[veiculo.ts] POST Response:', JSON.stringify(response.data));
  return response.data;
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
  const response = await api.put<Veiculo>(`/veiculos/${id}`, body);
  return response.data;
}

export async function deleteVeiculo(id: string): Promise<void> {
  await api.delete(`/veiculos/${id}`);
}
