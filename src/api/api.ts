import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: 'https://osfacil.onrender.com',
    timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
    try {
        if (!config.url?.includes('/login') && !config.url?.includes('/register')) {
            const token = await AsyncStorage.getItem('@osfacil:token');
            console.log('[API Interceptor] Token:', token ? 'Encontrado' : 'Não encontrado');
            console.log('[API Interceptor] Endpoint:', config.url);
            console.log('[API Interceptor] Method:', config.method?.toUpperCase());
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[API Interceptor] Bearer Token adicionado:', `${token.substring(0, 20)}...`);
            }
        }
    } catch (error) {
        console.error('Erro ao recuperar token:', error);
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        console.log('[API Interceptor] Response Success:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        if (error.response?.status === 403) {
            console.error('[API Interceptor] 403 Forbidden:', error.response.config.url);
            console.error('[API Interceptor] Response Data:', JSON.stringify(error.response.data));
        }
        if (error.response?.status === 401) {
            console.log('[API Interceptor] 401 - Removendo token inválido');
            await AsyncStorage.removeItem('@osfacil:token');
            await AsyncStorage.removeItem('@osfacil:profile');
        }
        return Promise.reject(error);
    }
);

export { apiClient };
