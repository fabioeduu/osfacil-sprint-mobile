import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Veiculo } from '../types';
import { getVeiculos, postVeiculo, putVeiculo, deleteVeiculo } from '../api/veiculo';

const VEICULOS_QUERY_KEY = ['veiculos'];

export function useVeiculos() {
  const queryClient = useQueryClient();

  const veiculosQuery = useQuery({
    queryKey: VEICULOS_QUERY_KEY,
    queryFn: getVeiculos,
    select: (data) => (Array.isArray(data) ? [...data].reverse() : []),
  });

  const criarMutation = useMutation({
    mutationFn: (payload: Omit<Veiculo, 'id' | 'dataCadastro'>) => postVeiculo(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VEICULOS_QUERY_KEY });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: (v: Veiculo) =>
      putVeiculo({
        id: v.id,
        marca: v.marca,
        modelo: v.modelo,
        placa: v.placa,
        ano: v.ano,
        cor: v.cor,
        clienteId: v.clienteId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VEICULOS_QUERY_KEY });
    },
  });

  const removerMutation = useMutation({
    mutationFn: (id: string) => deleteVeiculo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: VEICULOS_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!veiculosQuery.error) return null;
    return 'Erro ao carregar veículos';
  }, [veiculosQuery.error]);

  return {
    veiculos: veiculosQuery.data ?? [],
    loading: veiculosQuery.isLoading,
    error,
    load: veiculosQuery.refetch,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    remover: removerMutation.mutateAsync,
    saving: criarMutation.isPending || atualizarMutation.isPending || removerMutation.isPending,
  };
}
