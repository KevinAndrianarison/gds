import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import InputSearch from '@/composants/InputSearch'
import ButtonAdd from '@/composants/ButtonAdd'
import AddMaterielModal from './AddMaterielModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  setEtat
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
          className={`flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 ${showFilters ? 'bg-blue-100' : 'bg-blue-50'}`}
        >
          <Filter className="h-4 w-4 text-blue-400" />
        </button>
        <ButtonAdd 
          label='Ajouter un matériel'
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
                <SelectItem value="informatique">Informatique</SelectItem>
                <SelectItem value="mobilier">Mobilier</SelectItem>
                <SelectItem value="vehicule">Véhicule</SelectItem>
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="antananarivo">Antananarivo</SelectItem>
                <SelectItem value="toamasina">Toamasina</SelectItem>
                <SelectItem value="mahajanga">Mahajanga</SelectItem>
              </SelectContent>
            </Select>

            <Select value={etat} onValueChange={setEtat}>
              <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bon">Bon état</SelectItem>
                <SelectItem value="moyen">État moyen</SelectItem>
                <SelectItem value="mauvais">Mauvais état</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
