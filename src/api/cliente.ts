import { api } from './api';
import { Cliente } from '../types';

export type ClientePayloadDTO = {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
};

export async function getClientes(): Promise<Cliente[]> {
  const response = await api.get<any>('/clientes');
  console.log('[cliente.ts] Response:', JSON.stringify(response.data, null, 2));
  
  let data = response.data;
  
  if (data?.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  if (data?._embedded?.clientes) {
    return data._embedded.clientes;
  }
  
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data?.clientes && Array.isArray(data.clientes)) {
    return data.clientes;
  }
  
  console.warn('[cliente.ts] Resposta em formato inesperado:', data);
  return [];
}

export async function getCliente(id: string): Promise<Cliente> {
  const response = await api.get<Cliente>(`/clientes/${id}`);
  return response.data;
}

export async function postCliente(novoCliente: ClientePayloadDTO): Promise<Cliente> {
  console.log('[cliente.ts] POST Payload:', JSON.stringify(novoCliente));
  try {
    const response = await api.post<Cliente>('/clientes', novoCliente);
    console.log('[cliente.ts] POST Response:', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 403) {
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
      throw new Error(backendMessage || 'Sem permissão para criar cliente. Faça login com um perfil autorizado.');
    }

    throw error;
  }
}

export async function putCliente(params: {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
}): Promise<Cliente> {
  const { id, ...body } = params;
  const response = await api.put<Cliente>(`/clientes/${id}`, body);
  return response.data;
}

export async function deleteCliente(id: string): Promise<void> {
  await api.delete(`/clientes/${id}`);
}
