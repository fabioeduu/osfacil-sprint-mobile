import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'https://osfacil.onrender.com', //api de java
});


api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Erro ao recuperar token:', error);
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            
            await AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
    }
);

export default api;
