import api from './api';

export const projectService = {
  async getProjects(params = {}) {
    return await api.get('/projects', { params });
  },

  async getProjectById(id) {
    return await api.get(`/projects/${id}`);
  },

  async createProject(data) {
    return await api.post('/projects', data);
  },

  async updateProject(id, data) {
    return await api.put(`/projects/${id}`, data);
  },

  async deleteProject(id) {
    return await api.delete(`/projects/${id}`);
  }
};
