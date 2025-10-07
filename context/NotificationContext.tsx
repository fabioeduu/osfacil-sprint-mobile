import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useApp } from './AppContext';

export interface Notificacao {
  id: string;
  tipo: 'urgente' | 'vencida' | 'prazo' | 'nova' | 'concluida';
  titulo: string;
  mensagem: string;
  osId?: string;
  data: string;
  lida: boolean;
}

interface NotificationContextType {
  notificacoes: Notificacao[];
  naoLidas: number;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  removerNotificacao: (id: string) => void;
  limparNotificacoes: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  

  useEffect(() => {
    const verificarNotificacoes = () => {
      const novasNotificacoes: Notificacao[] = [];
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      state.ordensServico.forEach(os => {
        const dataAbertura = new Date(os.dataAbertura);
        dataAbertura.setHours(0, 0, 0, 0);
        
        

        if (os.prioridade === 'urgente' && os.status !== 'concluida' && os.status !== 'cancelada') {
          const existeUrgente = notificacoes.some(n => 
            n.osId === os.id && n.tipo === 'urgente'
          );
          
          if (!existeUrgente) {
            novasNotificacoes.push({
              id: `urgente-${os.id}`,
              tipo: 'urgente',
              titulo: 'OS Urgente Pendente',
              mensagem: `OS #${os.numero} marcada como URGENTE precisa de atenção`,
              osId: os.id,
              data: new Date().toISOString(),
              lida: false
            });
          }
        }

        
        
        if (os.dataPrevisao && os.status !== 'concluida' && os.status !== 'cancelada') {
          const dataPrevista = new Date(os.dataPrevisao);
          dataPrevista.setHours(0, 0, 0, 0);
          
          if (dataPrevista < hoje) {
            const existeVencida = notificacoes.some(n => 
              n.osId === os.id && n.tipo === 'vencida'
            );
            
            if (!existeVencida) {
              const diasAtraso = Math.floor((hoje.getTime() - dataPrevista.getTime()) / (1000 * 60 * 60 * 24));
              novasNotificacoes.push({
                id: `vencida-${os.id}`,
                tipo: 'vencida',
                titulo: 'OS Vencida',
                mensagem: `OS #${os.numero} está ${diasAtraso} dia(s) em atraso`,
                osId: os.id,
                data: new Date().toISOString(),
                lida: false
              });
            }
          }
          
          


          const amanha = new Date(hoje);
          amanha.setDate(amanha.getDate() + 1);
          
          if (dataPrevista.getTime() === amanha.getTime()) {
            const existePrazo = notificacoes.some(n => 
              n.osId === os.id && n.tipo === 'prazo'
            );
            
            if (!existePrazo) {
              novasNotificacoes.push({
                id: `prazo-${os.id}`,
                tipo: 'prazo',
                titulo: 'OS Próxima do Prazo',
                mensagem: `OS #${os.numero} vence amanhã`,
                osId: os.id,
                data: new Date().toISOString(),
                lida: false
              });
            }
          }
        }

        

        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
        
        if (dataAbertura < seteDiasAtras && os.status === 'aberta') {
          const existeParada = notificacoes.some(n => 
            n.osId === os.id && n.tipo === 'nova' && n.titulo.includes('sem movimento')
          );
          
          if (!existeParada) {
            novasNotificacoes.push({
              id: `parada-${os.id}`,
              tipo: 'nova',
              titulo: 'OS Sem Movimento',
              mensagem: `OS #${os.numero} está aberta há mais de 7 dias`,
              osId: os.id,
              data: new Date().toISOString(),
              lida: false
            });
          }
        }
      });

      if (novasNotificacoes.length > 0) {
        setNotificacoes(prev => [...prev, ...novasNotificacoes]);
        
        


        const criticas = novasNotificacoes.filter(n => n.tipo === 'urgente' || n.tipo === 'vencida');
        if (criticas.length > 0) {
          Alert.alert(
            'Atenção Necessária',
            `Você tem ${criticas.length} OS que precisam de atenção imediata`,
            [{ text: 'OK' }]
          );
        }
      }
    };

    
    
    verificarNotificacoes();
    const interval = setInterval(verificarNotificacoes, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.ordensServico, notificacoes]);

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(n => ({ ...n, lida: true }))
    );
  };

  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <NotificationContext.Provider
      value={{
        notificacoes,
        naoLidas,
        marcarComoLida,
        marcarTodasComoLidas,
        removerNotificacao,
        limparNotificacoes
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};