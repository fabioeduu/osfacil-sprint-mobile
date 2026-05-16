import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cliente } from '../types';
import { ClientePayloadDTO, getClientes, postCliente, putCliente, deleteCliente } from '../api/cliente';

const CLIENTES_QUERY_KEY = ['clientes'];

export function useClientes() {
  const queryClient = useQueryClient();

  const clientesQuery = useQuery({
    queryKey: CLIENTES_QUERY_KEY,
    queryFn: getClientes,
    select: (data) => (Array.isArray(data) ? [...data].reverse() : []),
  });

  const criarMutation = useMutation({
    mutationFn: (payload: ClientePayloadDTO) => postCliente(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: (c: Cliente) =>
      putCliente({
        id: c.id,
        nome: c.nome,
        cpf: c.cpf || '',
        email: c.email || '',
        senha: c.senha || '',
        telefone: c.telefone || '',
        endereco: c.endereco || '',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY });
    },
  });

  const removerMutation = useMutation({
    mutationFn: (id: string) => deleteCliente(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY });
    },
  });

  const error = useMemo(() => {
    if (!clientesQuery.error) return null;
    return 'Erro ao carregar clientes';
  }, [clientesQuery.error]);

  return {
    clientes: clientesQuery.data ?? [],
    loading: clientesQuery.isLoading,
    error,
    load: clientesQuery.refetch,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    remover: removerMutation.mutateAsync,
    saving: criarMutation.isPending || atualizarMutation.isPending || removerMutation.isPending,
  };
}
