import React, { useContext, useEffect, useState } from "react";
import { Filter } from "lucide-react";
import InputSearch from "@/composants/InputSearch";
import ButtonAdd from "@/composants/ButtonAdd";
import AddMaterielModal from "./AddMaterielModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorieContext } from "@/contexte/useCategorie";
import { RegionContext } from "@/contexte/useRegion";
import { ShowContext } from "@/contexte/useShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faXmark, faFilter } from "@fortawesome/free-solid-svg-icons";

export default function SearchFilters({
  searchValue,
  setSearchValue,
  showFilters,
  setShowFilters,
  categorie,
  setCategorie,
  region,
  setRegion,
  etat,
  setEtat,
  showAll,
  setShowAll,
  setSelectedCategoryName,
  setSelectedRegionName,
  setMateriels,
  materielsTemp,
  setFilteredMateriels,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories, getAllCategories } = useContext(CategorieContext);
  const { regions, getAllRegion } = useContext(RegionContext);
  const { isAdmin } = useContext(ShowContext);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllCategories(), getAllRegion()]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!showAll) {
      setSearchValue("");
      setCategorie("");
      setRegion("");
      setEtat("");
    }
  }, [showAll]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex-1">
          <InputSearch
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Rechercher un matériel..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center p-2 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors duration-200 ${
            showFilters ? "bg-blue-100" : "bg-blue-50"
          }`}
        >
          <Filter className="h-4 w-4 text-blue-400" />
        </button>
        <ButtonAdd
          label="Ajouter un matériel"
          onClick={() => setIsModalOpen(true)}
        />

        <AddMaterielModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      {showFilters && (
        <div className="mt-2 bg-gray-50 rounded-lg border-gray-100 absolute right-5 z-10 border shadow-lg">
          <div className="flex justify-end pt-1 pr-1">
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => setShowFilters(false)}
              className="text-red-500 bg-red-100 rounded-full p-1 px-1.5 cursor-pointer"
            />
          </div>
          <div className="flex items-center text-gray-500 text-sm font-bold px-8 gap-2 uppercase">
            <FontAwesomeIcon icon={faFilter} /> <p>Filtrage par </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 px-8 pt-4 pb-8">
            <Select
              value={categorie}
              onValueChange={(value) => {
                setCategorie(value);
                setSelectedCategoryName(
                  categories.find((cat) => cat.id === value)?.nom || ""
                );
              }}
            >
              <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded-3xl p-2 w-full px-4">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((categorie) => (
                  <SelectItem key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAdmin && (
              <Select
                value={region}
                onValueChange={(value) => {
                  setRegion(value);
                  setSelectedRegionName(
                    regions.find((reg) => reg.id === value)?.nom || ""
                  );
                }}
              >
                <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded-3xl p-2 w-full px-4">
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={etat} onValueChange={setEtat}>
              <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded-3xl p-2 px-4 w-full">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bon état">Bon état</SelectItem>
                <SelectItem value="État moyen">État moyen</SelectItem>
                <SelectItem value="Mauvais état">Mauvais état</SelectItem>
                <SelectItem value="Hors service">Hors service</SelectItem>
              </SelectContent>
            </Select>
            <button
              className={`flex items-center justify-center rounded gap-2 p-2 w-40 ${
                showAll ? "bg-gray-500 text-white" : "bg-blue-400 text-white"
              }`}
              onClick={() => {
                setShowAll(!showAll);
                setFilteredMateriels(materielsTemp);
                setMateriels(materielsTemp);
              }}
            >
              <FontAwesomeIcon icon={faEye} />
              <p>{showAll ? "Afficher filtrés" : "Tout afficher"}</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
