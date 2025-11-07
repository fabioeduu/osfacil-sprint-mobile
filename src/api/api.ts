import axios from 'axios';

const api = axios.create({
    baseURL: 'https://osfacil.onrender.com',
    timeout: 10000,
});

export { api };
