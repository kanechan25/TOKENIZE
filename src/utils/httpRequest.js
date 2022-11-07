import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://api.binance.com/',
});

export { httpRequest };
