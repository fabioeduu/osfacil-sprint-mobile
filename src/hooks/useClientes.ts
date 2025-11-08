import { useCallback, useEffect, useState } from 'react';
import { Cliente } from '../types';
import { getClientes, postCliente, putCliente, deleteCliente } from '../api/cliente';

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data.reverse() : []);
    } catch (err: any) {
      console.error('Erro ao carregar clientes:', err);
      setError(err.response?.status === 403 ? 'Acesso negado à API' : 'Erro ao carregar clientes');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (p: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    try {
      const novoCliente = await postCliente(p);
      await load();
      return novoCliente;
    } catch (err: any) {
      console.error('Erro ao criar cliente:', err);
      setError('Erro ao criar cliente');
      throw err;
    }
  }, [load]);

  const atualizar = useCallback(async (c: Cliente) => {
    try {
      await putCliente({
        id: c.id,
        nome: c.nome,
        email: c.email,
        telefone: c.telefone,
        endereco: c.endereco,
      });
      await load();
    } catch (err: any) {
      console.error('Erro ao atualizar cliente:', err);
      setError('Erro ao atualizar cliente');
      throw err;
    }
  }, [load]);

  const remover = useCallback(async (id: string) => {
    try {
      await deleteCliente(id);
      await load();
    } catch (err: any) {
      console.error('Erro ao remover cliente:', err);
      setError('Erro ao remover cliente');
      throw err;
    }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return { clientes, loading, error, load, criar, atualizar, remover };
}
