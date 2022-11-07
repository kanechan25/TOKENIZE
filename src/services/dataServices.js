import { httpRequest } from '../utils/httpRequest';

const getPendingOrders = (symbol, limit) => {
    return httpRequest.get(`api/v3/depth?symbol=${symbol}&limit=${limit}`);
};

export { getPendingOrders };
