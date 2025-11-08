import { useCallback, useEffect, useState } from 'react';
import { Veiculo } from '../types';
import { getVeiculos, postVeiculo, putVeiculo, deleteVeiculo } from '../api/veiculo';

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVeiculos();
      setVeiculos(Array.isArray(data) ? data.reverse() : []);
    } catch (err: any) {
      console.error('Erro ao carregar veículos:', err);
      setError(err.response?.status === 403 ? 'Acesso negado à API' : 'Erro ao carregar veículos');
      setVeiculos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (p: Omit<Veiculo, 'id' | 'dataCadastro'>) => {
    try {
      const novoVeiculo = await postVeiculo(p);
      await load();
      return novoVeiculo;
    } catch (err: any) {
      console.error('Erro ao criar veículo:', err);
      setError('Erro ao criar veículo');
      throw err;
    }
  }, [load]);

  const atualizar = useCallback(async (v: Veiculo) => {
    try {
      await putVeiculo({
        id: v.id,
        marca: v.marca,
        modelo: v.modelo,
        placa: v.placa,
        ano: v.ano,
        cor: v.cor,
        clienteId: v.clienteId,
      });
      await load();
    } catch (err: any) {
      console.error('Erro ao atualizar veículo:', err);
      setError('Erro ao atualizar veículo');
      throw err;
    }
  }, [load]);

  const remover = useCallback(async (id: string) => {
    try {
      await deleteVeiculo(id);
      await load();
    } catch (err: any) {
      console.error('Erro ao remover veículo:', err);
      setError('Erro ao remover veículo');
      throw err;
    }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return { veiculos, loading, error, load, criar, atualizar, remover };
}
