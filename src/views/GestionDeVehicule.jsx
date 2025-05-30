import React, { useEffect, useContext } from "react";
import Entete from "@/composants/Entete";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import InputSearch from "@/composants/InputSearch";
import { faCarSide, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Empty from "@/composants/Empty";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ShowContext } from "@/contexte/useShow";
import { RegionContext } from "@/contexte/useRegion";
import { useState } from "react";
import TitreLabel from "@/composants/TitreLabel";
import ButtonPdf from "@/composants/ButtonPdf";
import ButtonExcel from "@/composants/ButtonExcel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UtiliseVehicule from "@/composants/UtiliseVehicule";
import { useNavigate } from "react-router-dom";

function GestionDeVehiculeContent() {
  const {
    getAllVehicules,
    vehicules,
    isLoadingVehicules,
  } = useMateriel();
  const navigate = useNavigate();
  const [region, setRegion] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const { isAdmin } = useContext(ShowContext);
  const { regions, getAllRegion } = useContext(RegionContext);
  const [filteredVehicules, setFilteredVehicules] = useState([]);

  useEffect(() => {
    getAllRegion();
    getAllVehicules();
  }, []);

  // Initialiser filteredVehicules avec vehicules
  useEffect(() => {
    setFilteredVehicules(vehicules);
  }, [vehicules]);

  // Effet pour gérer la recherche et le filtrage par région
  useEffect(() => {
    let filtered = [...vehicules];

    // Filtre par région
    if (region && region !== 'all') {
      filtered = filtered.filter(vehicule => vehicule.region.id === region);
    }

    // Filtre par recherche
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(vehicule =>
        vehicule.type?.nom?.toLowerCase().includes(searchLower) ||
        vehicule.caracteristiques?.toLowerCase().includes(searchLower) ||
        vehicule.categorie?.nom?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredVehicules(filtered);
  }, [searchValue, vehicules, region]);

  return (
    <div className="w-[80vw] mx-auto">
      <Entete titre="des véhicules" description="gérer vos véhicules" />
      <div className="my-2">
        <InputSearch value={searchValue} onChange={setSearchValue} />
        <div className="mt-4 flex justify-between items-center">
          {isAdmin && (
            <div className="flex gap-2 flex-col gap-2">
              <TitreLabel titre="Filtrer par région :" />
              <div>
                {isAdmin && (
                  <Select
                    value={region}
                    onValueChange={(value) => {
                      setRegion(value);
                    }}
                  >
                    <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded-3xl p-2 w-40 px-4">
                      <SelectValue placeholder="Région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tout</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
          <div>
            <TitreLabel titre="Effectif :" />
            {isLoadingVehicules ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin"
                pulse
              />
            ) : (
              <p className="text-sm font-bold uppercase text-gray-500">
                {filteredVehicules.length}
              </p>
            )}
          </div>
        </div>
      </div>
      {isLoadingVehicules && filteredVehicules.length === 0 ? (
        <div className="mt-4 max-h-[500px] overflow-y-auto">
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
      ) : !isLoadingVehicules && filteredVehicules.length === 0 ? (
        <div className="my-10">
          <Empty titre="Aucun véhicule n'a été trouvé" />
        </div>
      ) : (
        <div className="mt-4 max-h-[500px] overflow-y-auto">
          {filteredVehicules.map((vehicule) => (
            <div
              key={vehicule.id}
              onDoubleClick={() => {
                navigate(`/details-vehicule/${vehicule.id}`);
              }}
              className="shadow-xs cursor-pointer hover:bg-blue-50 hover:border-white bg-gray-50 rounded-md p-2 flex justify-between items-center"
            >
              <div className="flex items-center gap-10">
                <FontAwesomeIcon
                  className="text-blue-500 bg-blue-100 rounded-full p-4"
                  icon={faCarSide}
                />
                <div>
                  <h1 className="text-lg flex items-center gap-2 font-bold">
                    <p className="uppercase ">{vehicule.type.nom}</p>
                    <p className='text-gray-500 text-sm'>{vehicule.caracteristiques &&
                      `(${vehicule.caracteristiques})`}</p>
                  </h1>
                  <p className="text-xs font-bold uppercase text-gray-500">
                    {vehicule.categorie.nom}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Popover>
                  <PopoverTrigger onClick={(e) => e.stopPropagation()} className="bg-blue-500 text-white px-8 py-2 rounded cursor-pointer">
                    Utiliser
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px]">
                    <UtiliseVehicule vehicule={vehicule} status='utiliser' />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger onClick={(e) => e.stopPropagation()} className="bg-gray-300 text-black text-gray-700 font-bold px-8 py-2 rounded cursor-pointer">
                    Assigner
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px]">
                    <UtiliseVehicule vehicule={vehicule} status='assigner' />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredVehicules.length > 0 && (
        <div className="mt-4 flex gap-2">
          <ButtonPdf />
          <ButtonExcel />
        </div>
      )}
    </div>
  );
}

export default function GestionDeVehicule() {
  return (
    <MaterielContextProvider>
      <GestionDeVehiculeContent />
    </MaterielContextProvider>
  );
}
