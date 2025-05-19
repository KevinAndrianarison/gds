import { createContext, useContext, useState } from 'react';
import nProgress from 'nprogress';
import { appartenaceService } from '@/services/appartenaceService';
import Notiflix from 'notiflix';

export const AppartenanceContext = createContext({});

export function AppartenanceContextProvider({ children }) {
  const [appartenances, setAppartenances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function getAllAppartenances() {
    setIsLoading(true);
    return appartenaceService.getAllAppartenances()
      .then((response) => {
        setAppartenances(response);
        setIsLoading(false);
        return response;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure('Erreur lors du chargement des appartenances');
        setIsLoading(false);
        throw err;
      });
  }

  return (
    <AppartenanceContext.Provider
      value={{
        appartenances,
        isLoading,
        getAllAppartenances
      }}
    >
      {children}
    </AppartenanceContext.Provider>
  );
}

export const useAppartenance = () => useContext(AppartenanceContext);
