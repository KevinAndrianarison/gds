import axios from 'axios';
import NProgress from 'nprogress';
import { Notify } from 'notiflix';

// const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://gds.ongsahi.org/api';

// Intercepteur pour montrer la progression
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

export const materielService = {

    getAllVehicules: async () => {
        try {
            const response = await axios.get(`${API_URL}/materiel/vehicule`);
            return response.data;
        } catch (error) {
            Notify.failure('Erreur lors du chargement des véhicules');
            throw error;
        }
    },


    getVehiculesParIdRegion: async (regionId) => {
        try {
            const response = await axios.get(`${API_URL}/vehicules/region/${regionId}`);
            return response.data;
        } catch (error) {
            Notify.failure('Erreur lors du chargement des véhicules par région');
            throw error;
        }
    },


    getMaterielParIdRegion: async (regionId) => {
        try {
            const response = await axios.get(`${API_URL}/materiels/region/${regionId}`);
            return response.data;
        } catch (error) {
            Notify.failure('Erreur lors du chargement des matériels par région');
            throw error;
        }
    },

    getAllMateriels: async () => {
        try {
            const response = await axios.get(`${API_URL}/materiels`);
            return response.data;
        } catch (error) {
            Notify.failure('Erreur lors du chargement des matériels');
            throw error;
        }
    },

    getMateriel: async (id) => {
        const response = await axios.get(`${API_URL}/materiels/${id}`);
        return response.data;
    },

    validateMateriel: (materiel) => {
        const requiredFields = {
            reference_id: 'Référence',
            categorie_id: 'Catégorie',
            type_id: 'Type',
            etat: 'État',
            region_id: 'Région',
            responsable_id: 'Responsable'
        };

        const missingFields = [];
        Object.entries(requiredFields).forEach(([field, label]) => {
            if (!materiel[field] || materiel[field] === '') {
                missingFields.push(label);
            }
        });

        if (missingFields.length > 0) {
            Notify.warning(
                `Veuillez remplir les champs obligatoires : ${missingFields.join(', ')}`,
                { timeout: 5000 }
            );
            return false;
        }

        return true;
    },

    // createMateriel: async (materiel) => {
    //     let token = localStorage.getItem('token');
    //     try {
    //         if (!materielService.validateMateriel(materiel)) {
    //             return null;
    //         }

    //         const data = {};
    //         Object.keys(materiel).forEach(key => {
    //             if (materiel[key] !== '') {
    //                 data[key] = materiel[key];
    //             }
    //         });

    //         const response = await axios.post(`${API_URL}/materiels`, data, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         Notify.success('Matériel ajouté avec succès');
    //         return response.data;
    //     } catch (error) {
    //         if (error.response?.status === 422) {
    //             const errors = error.response.data.errors;
    //             const errorMessages = Object.values(errors).flat();
    //             errorMessages.forEach(message => {
    //                 Notify.warning(message);
    //             });
    //         } else {
    //             Notify.failure('Erreur lors de l\'ajout du matériel');
    //         }
    //         throw error;
    //     }
    // },

    createMateriel: async (formData) => {
        let token = localStorage.getItem('token');
        try {
            const materiel = {};
            formData.forEach((value, key) => {
                if (key !== "photos[]") {
                    materiel[key] = value;
                }
            });
            if (!materielService.validateMateriel(materiel)) {
                return null;
            }
            const response = await axios.post(`${API_URL}/materiels`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            Notify.success('Matériel ajouté avec succès');
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                errorMessages.forEach(message => {
                    Notify.warning(message);
                });
            } else {
                Notify.failure('Erreur lors de l\'ajout du matériel');
            }
            throw error;
        }
    },
    

    updateMateriel: async (id, updateData) => {
        let token = localStorage.getItem('token');
        try {
            // Filtrer les champs pour n'envoyer que les champs définis
            const filteredData = Object.keys(updateData).reduce((acc, key) => {
                if (updateData[key] !== null && updateData[key] !== '') {
                    acc[key] = updateData[key];
                }
                return acc;
            }, {});

            // Ne pas faire de requête si aucun champ valide
            if (Object.keys(filteredData).length === 0) {
                return null;
            }

            const response = await axios.put(`${API_URL}/materiels/${id}`, filteredData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Notify.success('Champ mis à jour');
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                errorMessages.forEach(message => {
                    Notify.warning(message);
                });
            } else {
                Notify.failure('Erreur lors de la mise à jour');
            }
            throw error;
        }
    },

    updateUtilisation: async (id, updateData) => {
        let token = localStorage.getItem('token');
        try {
            const filteredData = Object.keys(updateData).reduce((acc, key) => {
                if (updateData[key] !== null && updateData[key] !== '') {
                    acc[key] = updateData[key];
                }
                return acc;
            }, {}); 

            if (Object.keys(filteredData).length === 0) {
                return null;
            }

            const response = await axios.put(`${API_URL}/vehicules/${id}`, filteredData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Notify.success('Utilisation mise à jour avec succès');
            return response.data;
        } catch (error) {
            Notify.failure('Erreur lors de la mise à jour de l\'utilisation');
            throw error;
        }
    },


    deleteMateriel: async (id) => {
        let token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/materiels/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Notify.success('Matériel supprimé avec succès');
        } catch (error) {
            Notify.failure('Erreur lors de la suppression du matériel');
            throw error;
        }
    },

    deleteUtilisation: async (id) => {
        let token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/vehicules/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Notify.success('Utilisation supprimée avec succès');
        } catch (error) {
            Notify.failure('Erreur lors de la suppression de l\'utilisation');
            throw error;
        }
    }
};
