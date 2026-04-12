import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrdemServico } from '../types';
import { getOrdensServico, postOrdemServico, putOrdemServico, deleteOrdemServico } from '../api/ordemServico';

const ORDENS_QUERY_KEY = ['ordens-servico'];

export function useOrdens() {
  const queryClient = useQueryClient();

  const ordensQuery = useQuery({
    queryKey: ORDENS_QUERY_KEY,
    queryFn: getOrdensServico,
    select: (data) => (Array.isArray(data) ? [...data].reverse() : []),
  });

  const criarMutation = useMutation({
    mutationFn: (payload: Partial<OrdemServico>) => postOrdemServico(payload as Omit<OrdemServico, 'id'>),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDENS_QUERY_KEY });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: (o: OrdemServico) =>
      putOrdemServico({
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
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDENS_QUERY_KEY });
    },
  });

  const removerMutation = useMutation({
    mutationFn: (id: string) => deleteOrdemServico(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDENS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!ordensQuery.error) return null;
    return 'Erro ao carregar ordens de serviço';
  }, [ordensQuery.error]);

  return {
    ordens: ordensQuery.data ?? [],
    loading: ordensQuery.isLoading,
    error,
    load: ordensQuery.refetch,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    remover: removerMutation.mutateAsync,
    saving: criarMutation.isPending || atualizarMutation.isPending || removerMutation.isPending,
  };
}
