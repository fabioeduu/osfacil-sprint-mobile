import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:8080/api', // aqui vai api de java
    timeout: 10000,
});

export default api;
