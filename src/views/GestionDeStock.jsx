import React, { useState } from 'react'
import Entete from '@/composants/Entete'
import StatsCards from '@/composants/stock/StatsCards'
import SearchFilters from '@/composants/stock/SearchFilters'
import MaterielsTable from '@/composants/stock/MaterielsTable'

// Données temporaires pour la démo
const materiels = [
  {
    id: 1,
    numero: 'MAT001',
    categorie: 'Informatique',
    type: 'Ordinateur',
    marque: 'Dell',
    caracteristiques: 'i7, 16GB RAM',
    etat: 'Bon état',
    ville: 'Antananarivo',
    responsable: 'Jean Dupont',
  },
]

export default function GestionDeStock() {
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [categorie, setCategorie] = useState('')
  const [region, setRegion] = useState('')
  const [etat, setEtat] = useState('')

  return (
    <div className="w-[80vw] mx-auto">
      <Entete 
        titre="stocks" 
        description="gérez vos matériels et équipements"
      />

      <StatsCards />

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
      />

      <MaterielsTable materiels={materiels} />
    </div>
  )
}
