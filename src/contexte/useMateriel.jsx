import { createContext, useContext, useState } from "react";
import nProgress from "nprogress";
import { materielService } from "@/services/materielService";
import Notiflix from "notiflix";
import { UrlContext } from "./useUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const MaterielContext = createContext({});

export function MaterielContextProvider({ children }) {
  const [materiels, setMateriels] = useState([]);
  const [materielsTemp, setMaterielsTemp] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicules, setVehicules] = useState([]);
  const [isLoadingVehicules, setIsLoadingVehicules] = useState(false);
  const [oneVehicule, setOneVehicule] = useState({});
  const { url } = useContext(UrlContext);
  const navigate = useNavigate();


  function getOneUtilisation(id) {
    nProgress.start();
    axios.get(`${url}/api/materiels/${id}`)
      .then((response) => {
        setOneVehicule(response.data);
        navigate(`/details-vehicule/${id}`);
        nProgress.done();
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure("Erreur lors du chargement des utilisations");
        nProgress.done();
      });
  }

  function getVehiculesParIdRegion(regionId) {
    setIsLoadingVehicules(true);
    return materielService
      .getVehiculesParIdRegion(regionId)
      .then((response) => {
        setVehicules(response);
        setIsLoadingVehicules(false);
        return response;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure(
          "Erreur lors du chargement des véhicules par région"
        );
        setIsLoadingVehicules(false);
        throw err;
      });
  }

  function getAllVehicules() {
    setIsLoadingVehicules(true);
    return materielService
      .getAllVehicules()
      .then((response) => {
        setVehicules(response);
        setIsLoadingVehicules(false);
        return response;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure("Erreur lors du chargement des véhicules");
        setIsLoadingVehicules(false);
        throw err;
      });
  }

  function getMaterielParIdRegion(regionId) {
    setIsLoading(true);
    return materielService
      .getMaterielParIdRegion(regionId)
      .then((response) => {
        setMateriels(response);
        setMaterielsTemp(response);
        setIsLoading(false);
        return response;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure(
          "Erreur lors du chargement des matériels par région"
        );
        setIsLoading(false);
        throw err;
      });
  }

  function getAllMateriels() {
    nProgress.start();
    setIsLoading(true);
    setMateriels([]);

    return materielService
      .getAllMateriels()
      .then((response) => {
        setMateriels(response);
        setMaterielsTemp(response);
        setIsLoading(false);
        nProgress.done();
        return response;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure("Erreur lors du chargement des matériels");
        setIsLoading(false);
        nProgress.done();
        throw err;
      });
  }

  function deleteMateriel(id) {
    return materielService
      .deleteMateriel(id)
      .then(() => {
        // Mettre à jour la liste locale en supprimant le matériel
        setMateriels((prev) => prev.filter((m) => m.id !== id));
        setMaterielsTemp((prev) => prev.filter((m) => m.id !== id));
        let region = JSON.parse(localStorage.getItem("region"));
        if (region) {
          getMaterielParIdRegion(region.id);
        } else {
          getAllMateriels();
        }
        return true;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure("Erreur lors de la suppression du matériel");
        throw err;
      });
  }

  function createMateriel(materielData) {
    return materielService
      .createMateriel(materielData)
      .then((newMateriel) => {
        // Ajouter le nouveau matériel à la liste locale
        setMateriels((prev) => [...prev, newMateriel]);
        setMaterielsTemp((prev) => [...prev, newMateriel]);
        return newMateriel;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure("Erreur lors de la création du matériel");
        throw err;
      });
  }

  function updateMateriel(id, updateData) {
    return materielService
      .updateMateriel(id, updateData)
      .then((updatedMateriel) => {
        // Mettre à jour le matériel dans la liste locale
        setMateriels((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updatedMateriel } : m))
        );
        setMaterielsTemp((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updatedMateriel } : m))
        );
        return updatedMateriel;
      })
      .catch((err) => {
        console.error(err);
        Notiflix.Notify.failure("Erreur lors de la mise à jour du matériel");
        throw err;
      });
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <MaterielContext.Provider
      value={{
        materiels,
        isLoading,
        isModalOpen,
        materielsTemp,
        isLoadingVehicules,
        vehicules,
        oneVehicule,
        getOneUtilisation,
        setMateriels,
        setIsLoading,
        getAllMateriels,
        deleteMateriel,
        createMateriel,
        updateMateriel,
        getMaterielParIdRegion,
        setIsModalOpen,
        closeModal,
        setMaterielsTemp,
        getAllVehicules,
        getVehiculesParIdRegion,
        setOneVehicule,
      }}
    >
      {children}
    </MaterielContext.Provider>
  );
}

export const useMateriel = () => useContext(MaterielContext);
