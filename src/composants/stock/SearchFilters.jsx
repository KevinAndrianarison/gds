import React, { useContext, useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
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
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories, getAllCategories } = useContext(CategorieContext);
  const { regions, getAllRegion } = useContext(RegionContext);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllCategories(), getAllRegion()]);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <InputSearch
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Rechercher un matériel..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 ${
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
        <div className="mt-2 p-4">
          <div className="grid gap-2 md:grid-cols-3">
            <Select value={categorie} onValueChange={setCategorie}>
              <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
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

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
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

            <Select value={etat} onValueChange={setEtat}>
              <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="Bon état">Bon état</SelectItem>
                  <SelectItem value="État moyen">État moyen</SelectItem>
                  <SelectItem value="Mauvais état">Mauvais état</SelectItem>
                  <SelectItem value="Hors service">Hors service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
