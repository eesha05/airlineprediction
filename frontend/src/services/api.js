import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOverview = () => api.get('/overview').then(res => res.data);
export const getDatasetSummary = () => api.get('/dataset/summary').then(res => res.data);
export const getDatasetRecords = (params) => api.get('/dataset', { params }).then(res => res.data);
export const getDemographics = (params) => api.get('/eda/demographics', { params }).then(res => res.data);
export const getTravelAnalysis = (params) => api.get('/eda/travel', { params }).then(res => res.data);
export const getServiceAnalysis = () => api.get('/eda/services').then(res => res.data);
export const getSatisfactionAnalysis = () => api.get('/eda/satisfaction').then(res => res.data);
export const getModelMetrics = () => api.get('/model/metrics').then(res => res.data);
export const getModelCoefficients = () => api.get('/model/coefficients').then(res => res.data);
export const predictPassenger = (payload) => api.post('/predict', payload).then(res => res.data);

export default api;
