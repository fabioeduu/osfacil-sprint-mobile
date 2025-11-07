import { api } from './api';

export interface DadosLogin {
  email: string;
  password: string;
}

export interface TokenResponseDTO {
  tokenAcesso: string;
  nome: string;
  email: string;
}

export async function login(dados: DadosLogin): Promise<TokenResponseDTO> {
  const response = await api.post<TokenResponseDTO>('/login', dados);
  return response.data;
}

export interface RegisterDTO {
  email: string;
  password: string;
  nome: string;
  telefone: string;
  endereco: string;
  cpf: string;
}

export async function register(dados: RegisterDTO): Promise<void> {
  await api.post('/register', dados);
}
