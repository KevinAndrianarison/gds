import axios from 'axios';
import NProgress from 'nprogress';
import { Notify } from 'notiflix';

// const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://gds.ongsahi.org/api';

axios.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

axios.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export const appartenaceService = {
  getAllAppartenances: async () => {
    try {
      const response = await axios.get(`${API_URL}/appartenances`);
      return response.data;
    } catch (error) {
      Notify.failure('Erreur lors du chargement des appartenances');
      throw error;
    }
  },

  getAppartenance: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/appartenances/${id}`);
      return response.data;
    } catch (error) {
      Notify.failure('Erreur lors du chargement de l\'appartenance');
      throw error;
    }
  },

  createAppartenance: async (appartenanceData) => {
    let token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/appartenances`, appartenanceData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Notify.success('Appartenance ajoutée avec succès');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => {
          Notify.warning(message);
        });
      } else {
        Notify.failure('Erreur lors de l\'ajout de l\'appartenance');
      }
      throw error;
    }
  },

  updateAppartenance: async (id, updateData) => {
    let token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/appartenances/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Notify.success('Appartenance mise à jour avec succès');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach(message => {
          Notify.warning(message);
        });
      } else {
        Notify.failure('Erreur lors de la mise à jour de l\'appartenance');
      }
      throw error;
    }
  },

  deleteAppartenance: async (id) => {
    let token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/appartenances/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Notify.success('Appartenance supprimée avec succès');
    } catch (error) {
      Notify.failure('Erreur lors de la suppression de l\'appartenance');
      throw error;
    }
  }
};
