import api from './api';

export const dashboardService = {
  async getMetrics() {
    return await api.get('/dashboard');
  }
};
