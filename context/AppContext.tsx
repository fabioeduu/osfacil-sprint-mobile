import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrdemServico, Cliente, Veiculo, Servico } from '../types';


interface AppState {
  ordensServico: OrdemServico[];
  clientes: Cliente[];
  veiculos: Veiculo[];
  servicos: Servico[];
  loading: boolean;
  error: string | null;
}


type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATA'; payload: { ordensServico: OrdemServico[]; clientes: Cliente[]; veiculos: Veiculo[]; servicos: Servico[] } }
  | { type: 'ADD_OS'; payload: OrdemServico }
  | { type: 'UPDATE_OS'; payload: OrdemServico }
  | { type: 'DELETE_OS'; payload: string }
  | { type: 'ADD_CLIENTE'; payload: Cliente }
  | { type: 'UPDATE_CLIENTE'; payload: Cliente }
  | { type: 'DELETE_CLIENTE'; payload: string }
  | { type: 'ADD_VEICULO'; payload: Veiculo }
  | { type: 'UPDATE_VEICULO'; payload: Veiculo }
  | { type: 'DELETE_VEICULO'; payload: string }
  | { type: 'ADD_SERVICO'; payload: Servico }
  | { type: 'UPDATE_SERVICO'; payload: Servico }
  | { type: 'DELETE_SERVICO'; payload: string };


const initialState: AppState = {
  ordensServico: [],
  clientes: [],
  veiculos: [],
  servicos: [],
  loading: false,
  error: null,
};


function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOAD_DATA':
      return {
        ...state,
        ordensServico: action.payload.ordensServico,
        clientes: action.payload.clientes,
        veiculos: action.payload.veiculos,
        servicos: action.payload.servicos,
      };
    
    case 'ADD_OS':
      return {
        ...state,
        ordensServico: [...state.ordensServico, action.payload],
      };
    
    case 'UPDATE_OS':
      return {
        ...state,
        ordensServico: state.ordensServico.map(os =>
          os.id === action.payload.id ? action.payload : os
        ),
      };
    
    case 'DELETE_OS':
      return {
        ...state,
        ordensServico: state.ordensServico.filter(os => os.id !== action.payload),
      };
    
    case 'ADD_CLIENTE':
      return {
        ...state,
        clientes: [...state.clientes, action.payload],
      };
    
    case 'UPDATE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.map(cliente =>
          cliente.id === action.payload.id ? action.payload : cliente
        ),
      };
    
    case 'DELETE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.filter(cliente => cliente.id !== action.payload),
      };
    
    case 'ADD_VEICULO':
      return {
        ...state,
        veiculos: [...state.veiculos, action.payload],
      };
    
    case 'UPDATE_VEICULO':
      return {
        ...state,
        veiculos: state.veiculos.map(veiculo =>
          veiculo.id === action.payload.id ? action.payload : veiculo
        ),
      };
    
    case 'DELETE_VEICULO':
      return {
        ...state,
        veiculos: state.veiculos.filter(veiculo => veiculo.id !== action.payload),
      };
    
    case 'ADD_SERVICO':
      return {
        ...state,
        servicos: [...state.servicos, action.payload],
      };
    
    case 'UPDATE_SERVICO':
      return {
        ...state,
        servicos: state.servicos.map(servico =>
          servico.id === action.payload.id ? action.payload : servico
        ),
      };
    
    case 'DELETE_SERVICO':
      return {
        ...state,
        servicos: state.servicos.filter(servico => servico.id !== action.payload),
      };
    
    default:
      return state;
  }
}


interface AppContextType {
  state: AppState;
  addOrdemServico: (os: Omit<OrdemServico, 'id'>) => Promise<string>;
  updateOrdemServico: (os: OrdemServico) => Promise<void>;
  deleteOrdemServico: (id: string) => Promise<void>;
  getOrdemServico: (id: string) => OrdemServico | undefined;
  addCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  updateCliente: (cliente: Cliente) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  getCliente: (id: string) => Cliente | undefined;
  addVeiculo: (veiculo: Omit<Veiculo, 'id'>) => Promise<void>;
  updateVeiculo: (veiculo: Veiculo) => Promise<void>;
  deleteVeiculo: (id: string) => Promise<void>;
  getVeiculo: (id: string) => Veiculo | undefined;
  getVeiculosByCliente: (clienteId: string) => Veiculo[];
  addServico: (servico: Omit<Servico, 'id'>) => Promise<void>;
  updateServico: (servico: Servico) => Promise<void>;
  deleteServico: (id: string) => Promise<void>;
  getServico: (id: string) => Servico | undefined;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


const STORAGE_KEYS = {
  ORDENS_SERVICO: '@osfacil:ordensServico',
  CLIENTES: '@osfacil:clientes',
  VEICULOS: '@osfacil:veiculos',
  SERVICOS: '@osfacil:servicos',
};


interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  
  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  
  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [ordensServicoData, clientesData, veiculosData, servicosData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ORDENS_SERVICO),
        AsyncStorage.getItem(STORAGE_KEYS.CLIENTES),
        AsyncStorage.getItem(STORAGE_KEYS.VEICULOS),
        AsyncStorage.getItem(STORAGE_KEYS.SERVICOS),
      ]);

      const ordensServico = ordensServicoData ? JSON.parse(ordensServicoData) : [];
      const clientes = clientesData ? JSON.parse(clientesData) : [];
      const veiculos = veiculosData ? JSON.parse(veiculosData) : [];
      const servicos = servicosData ? JSON.parse(servicosData) : [];

      dispatch({
        type: 'LOAD_DATA',
        payload: { ordensServico, clientes, veiculos, servicos },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ORDENS_SERVICO, JSON.stringify(state.ordensServico)),
        AsyncStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(state.clientes)),
        AsyncStorage.setItem(STORAGE_KEYS.VEICULOS, JSON.stringify(state.veiculos)),
        AsyncStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(state.servicos)),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao salvar dados' });
    }
  };


  const addOrdemServico = async (osData: Omit<OrdemServico, 'id'>) => {
    const id = generateId();
    const os: OrdemServico = { ...osData, id };
    dispatch({ type: 'ADD_OS', payload: os });
    await saveData();
    return id;
  };

  const updateOrdemServico = async (os: OrdemServico) => {
    dispatch({ type: 'UPDATE_OS', payload: os });
    await saveData();
  };

  const deleteOrdemServico = async (id: string) => {
    dispatch({ type: 'DELETE_OS', payload: id });
    await saveData();
  };

  const getOrdemServico = (id: string): OrdemServico | undefined => {
    return state.ordensServico.find(os => os.id === id);
  };


  const addCliente = async (clienteData: Omit<Cliente, 'id'>) => {
    const cliente: Cliente = { ...clienteData, id: generateId() };
    dispatch({ type: 'ADD_CLIENTE', payload: cliente });
    await saveData();
  };

  const updateCliente = async (cliente: Cliente) => {
    dispatch({ type: 'UPDATE_CLIENTE', payload: cliente });
    await saveData();
  };

  const deleteCliente = async (id: string) => {
    dispatch({ type: 'DELETE_CLIENTE', payload: id });
    await saveData();
  };

  const getCliente = (id: string): Cliente | undefined => {
    return state.clientes.find(cliente => cliente.id === id);
  };



  const addVeiculo = async (veiculoData: Omit<Veiculo, 'id'>) => {
    const veiculo: Veiculo = { ...veiculoData, id: generateId() };
    dispatch({ type: 'ADD_VEICULO', payload: veiculo });
    await saveData();
  };

  const updateVeiculo = async (veiculo: Veiculo) => {
    dispatch({ type: 'UPDATE_VEICULO', payload: veiculo });
    await saveData();
  };

  const deleteVeiculo = async (id: string) => {
    dispatch({ type: 'DELETE_VEICULO', payload: id });
    await saveData();
  };

  const getVeiculo = (id: string): Veiculo | undefined => {
    return state.veiculos.find(veiculo => veiculo.id === id);
  };

  const getVeiculosByCliente = (clienteId: string): Veiculo[] => {
    return state.veiculos.filter(veiculo => veiculo.clienteId === clienteId);
  };

  
  


  const addServico = async (servicoData: Omit<Servico, 'id'>) => {
    const servico: Servico = { ...servicoData, id: generateId() };
    dispatch({ type: 'ADD_SERVICO', payload: servico });
    await saveData();
  };

  const updateServico = async (servico: Servico) => {
    dispatch({ type: 'UPDATE_SERVICO', payload: servico });
    await saveData();
  };

  const deleteServico = async (id: string) => {
    dispatch({ type: 'DELETE_SERVICO', payload: id });
    await saveData();
  };

  const getServico = (id: string): Servico | undefined => {
    return state.servicos.find(servico => servico.id === id);
  };

 

  useEffect(() => {
    loadData();
  }, []);

  const contextValue: AppContextType = {
    state,
    addOrdemServico,
    updateOrdemServico,
    deleteOrdemServico,
    getOrdemServico,
    addCliente,
    updateCliente,
    deleteCliente,
    getCliente,
    addVeiculo,
    updateVeiculo,
    deleteVeiculo,
    getVeiculo,
    getVeiculosByCliente,
    addServico,
    updateServico,
    deleteServico,
    getServico,
    loadData,
    saveData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}




export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}