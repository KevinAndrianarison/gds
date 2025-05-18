import React, { useState, useEffect, useContext } from "react";
import Entete from "@/composants/Entete";
import StatsCards from "@/composants/stock/StatsCards";
import SearchFilters from "@/composants/stock/SearchFilters";
import MaterielsTable from "@/composants/stock/MaterielsTable";
import AddMaterielModal from "@/composants/stock/AddMaterielModal";
import Empty from "@/composants/Empty";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { ShowContext } from "@/contexte/useShow";
import ButtonExcel from "@/composants/ButtonExcel";
import ButtonPdf from "@/composants/ButtonPdf";

export default function GestionDeStock() {
  return (
    <MaterielContextProvider>
      <GestionDeStockContent />
    </MaterielContextProvider>
  );
}

function GestionDeStockContent() {
  const {
    materiels,
    getAllMateriels,
    isLoading,
    deleteMateriel,
    getMaterielParIdRegion,
  } = useMateriel();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categorie, setCategorie] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [etat, setEtat] = useState("");
  const [showAll, setShowAll] = useState(false);
  const nomRegion = JSON.parse(localStorage.getItem("region"))?.nom;
  const { isACL } = useContext(ShowContext);

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.region_id) {
        getMaterielParIdRegion(user.region_id);
      } else {
        getAllMateriels();
      }
    } else {
      getAllMateriels();
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?"))
      return;
    try {
      await deleteMateriel(id);
      await getAllMateriels();
    } catch (err) {
      setError("Erreur lors de la suppression du matériel");
      console.error(err);
    }
  };

  const filteredMateriels = materiels.filter((materiel) => {
    const matchesSearch =
      (materiel.categorie.nom &&
        materiel.categorie.nom
          .toLowerCase()
          .includes(searchValue.toLowerCase())) ||
      (materiel.type.nom &&
        materiel.type.nom.toLowerCase().includes(searchValue.toLowerCase()));

    const matchesCategorie = !categorie || materiel.categorie_id === categorie;
    const matchesRegion = !region || materiel.region_id === region;
    const matchesEtat = !etat || materiel.etat === etat;

    return matchesSearch && matchesCategorie && matchesRegion && matchesEtat;
  });

  return (
    <div className="w-[80vw] mx-auto">
      <Entete titre="stocks" description="gérez vos matériels et équipements" />

      <StatsCards
        total={isLoading ? null : materiels.length}
        inGoodCondition={
          isLoading
            ? null
            : materiels.filter(
                (m) => m.etat === "Bon état" || m.etat === "État moyen"
              ).length
        }
        inBadCondition={
          isLoading
            ? null
            : materiels.filter(
                (m) => m.etat === "Mauvais état" || m.etat === "Hors service"
              ).length
        }
        isLoading={isLoading}
      />
      {isACL && (
        <p className="flex items-center text-lg gap-2 text-gray-700 my-4">
          <FontAwesomeIcon className="text-blue-500" icon={faGlobe} />
          {nomRegion}
        </p>
      )}

      <SearchFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categorie={categorie}
        setCategorie={setCategorie}
        region={region}
        setRegion={setRegion}
        etat={etat}
        setEtat={setEtat}
        showAll={showAll}
        setShowAll={setShowAll}
      />
      {isLoading ? (
        <div className="mt-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className=" rounded mb-4 p-4">
              <div className="grid grid-cols-8 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : materiels.length === 0 ? (
        <Empty titre="Aucun matériel n'a été trouvé" />
      ) : (
        <MaterielsTable
          materiels={showAll ? materiels : filteredMateriels}
          onDelete={handleDelete}
          onEdit={() => setShowAddModal(true)}
        />
      )}
      {(filteredMateriels.length > 0 || (showAll && materiels.length > 0)) && (
        <div className="flex gap-2 my-4">
          <ButtonPdf />
          <ButtonExcel />
        </div>
      )}

      <AddMaterielModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
        }}
      />
    </div>
  );
}
