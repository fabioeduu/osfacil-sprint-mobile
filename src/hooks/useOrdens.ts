import { useCallback, useEffect, useState } from 'react';
import { OrdemServico } from '../types';
import { getOrdensServico, postOrdemServico, putOrdemServico, deleteOrdemServico } from '../api/ordemServico';

export function useOrdens() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdensServico();
      setOrdens(Array.isArray(data) ? data.reverse() : []);
    } catch (err: any) {
      console.error('Erro ao carregar ordens de serviço:', err);
      setError(err.response?.status === 403 ? 'Acesso negado à API' : 'Erro ao carregar ordens de serviço');
      setOrdens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (p: Partial<OrdemServico>) => {
    try {
      const novaOrdem = await postOrdemServico(p as Omit<OrdemServico, 'id'>);
      await load();
      return novaOrdem;
    } catch (err: any) {
      console.error('Erro ao criar ordem de serviço:', err);
      setError('Erro ao criar ordem de serviço');
      throw err;
    }
  }, [load]);

  const atualizar = useCallback(async (o: OrdemServico) => {
    try {
      await putOrdemServico({
        id: o.id,
        numero: o.numero,
        clienteId: o.clienteId,
        veiculoId: o.veiculoId,
        dataAbertura: o.dataAbertura,
        dataConclusao: o.dataConclusao,
        status: o.status,
        defeito: o.defeito,
        observacoes: o.observacoes,
        servicos: o.servicos,
        valorTotal: o.valorTotal,
      });
      await load();
    } catch (err: any) {
      console.error('Erro ao atualizar ordem de serviço:', err);
      setError('Erro ao atualizar ordem de serviço');
      throw err;
    }
  }, [load]);

  const remover = useCallback(async (id: string) => {
    try {
      await deleteOrdemServico(id);
      await load();
    } catch (err: any) {
      console.error('Erro ao remover ordem de serviço:', err);
      setError('Erro ao remover ordem de serviço');
      throw err;
    }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return { ordens, loading, error, load, criar, atualizar, remover };
}
