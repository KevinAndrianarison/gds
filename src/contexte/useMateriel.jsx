import { createContext, useContext, useState } from 'react';
import { UrlContext } from './useUrl';
import nProgress from 'nprogress';
import { materielService } from '@/services/materielService';
import Notiflix from 'notiflix';

export const MaterielContext = createContext({});

export function MaterielContextProvider({ children }) {
    const [materiels, setMateriels] = useState([]);
    const [filteredMateriels, setFilteredMateriels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterMateriels = (searchValue) => {
        if (!searchValue || typeof searchValue !== 'string' || !searchValue.trim()) {
            setFilteredMateriels(materiels);
            return;
        }
        
        const searchLower = searchValue.toLowerCase();
        const filtered = materiels.filter(materiel => {
            const matchNumero = materiel.numero?.toLowerCase().includes(searchLower);
            const matchCategorie = materiel.categorie?.nom?.toLowerCase().includes(searchLower);
            const matchType = materiel.type?.nom?.toLowerCase().includes(searchLower);
            return matchNumero || matchCategorie || matchType;
        });
        
        setFilteredMateriels(filtered);
    };

    function getAllMateriels() {
        nProgress.start();
        setIsLoading(true);
        setMateriels([]);

        return materielService.getAllMateriels()
            .then((response) => {
                setMateriels(response);
                setFilteredMateriels(response);
                setIsLoading(false);
                nProgress.done();
                return response;
            })
            .catch((err) => {
                console.error(err);
                Notiflix.Notify.failure('Erreur lors du chargement des matériels');
                setIsLoading(false);
                nProgress.done();
                throw err;
            });
    }

    function deleteMateriel(id) {
        return materielService.deleteMateriel(id)
            .then(() => {
                // Mettre à jour la liste locale en supprimant le matériel
                setMateriels(prev => prev.filter(m => m.id !== id));
                return true;
            })
            .catch((err) => {
                console.error(err);
                Notiflix.Notify.failure('Erreur lors de la suppression du matériel');
                throw err;
            });
    }

    function createMateriel(materielData) {
        return materielService.createMateriel(materielData)
            .then((newMateriel) => {
                // Ajouter le nouveau matériel à la liste locale
                setMateriels(prev => [...prev, newMateriel]);
                return newMateriel;
            })
            .catch((err) => {
                console.error(err);
                Notiflix.Notify.failure('Erreur lors de la création du matériel');
                throw err;
            });
    }

    function updateMateriel(id, updateData) {
        return materielService.updateMateriel(id, updateData)
            .then((updatedMateriel) => {
                // Mettre à jour le matériel dans la liste locale
                setMateriels(prev => 
                    prev.map(m => m.id === id ? { ...m, ...updatedMateriel } : m)
                );
                return updatedMateriel;
            })
            .catch((err) => {
                console.error(err);
                Notiflix.Notify.failure('Erreur lors de la mise à jour du matériel');
                throw err;
            });
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <MaterielContext.Provider
            value={{
                materiels: filteredMateriels,
                allMateriels: materiels,
                isLoading,
                getAllMateriels,
                deleteMateriel,
                createMateriel,
                updateMateriel,
                isModalOpen,
                setIsModalOpen,
                filterMateriels,
                closeModal
            }}
        >
            {children}
        </MaterielContext.Provider>
    );
}

export const useMateriel = () => useContext(MaterielContext);
