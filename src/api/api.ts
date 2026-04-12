import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'https://osfacil.onrender.com',
    timeout: 50000,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@osfacil:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { api };
