import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'https://osfacil.onrender.com',
    timeout: 60000,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@osfacil:token');
    if (token) {
        const normalizedToken = token.startsWith('Bearer ')
            ? token.replace(/^Bearer\s+/i, '')
            : token;

        config.headers.Authorization = `Bearer ${normalizedToken}`;
    }
    return config;
});

export { api };
