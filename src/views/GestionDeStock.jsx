import React, { useState, useEffect } from 'react'
import Entete from '@/composants/Entete'
import StatsCards from '@/composants/stock/StatsCards'
import SearchFilters from '@/composants/stock/SearchFilters'
import MaterielsTable from '@/composants/stock/MaterielsTable'
import AddMaterielModal from '@/composants/stock/AddMaterielModal'
import Empty from '@/composants/Empty'
import { MaterielContextProvider, useMateriel } from '@/contexte/useMateriel'

export default function GestionDeStock() {
  return (
    <MaterielContextProvider>
      <GestionDeStockContent />
    </MaterielContextProvider>
  )
}

function GestionDeStockContent() {
  const { materiels, getAllMateriels, isLoading, deleteMateriel } = useMateriel();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categorie, setCategorie] = useState('');
  const [region, setRegion] = useState('');
  const [etat, setEtat] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllMateriels()
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) return
    try {
      await deleteMateriel(id)
      await getAllMateriels()
    } catch (err) {
      setError('Erreur lors de la suppression du matériel')
      console.error(err)
    }
  }

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

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className=" rounded mb-4 p-4">
              <div className="grid grid-cols-8 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : materiels.length === 0 ? (
        <Empty 
          titre="Aucun matériel n'a encore été créé"
        />
      ) : (
        <MaterielsTable 
          materiels={materiels} 
          onDelete={handleDelete}
          onEdit={() => setShowAddModal(true)}
        />
      )}

      <AddMaterielModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
           setShowAddModal(false)
        }}
      />
    </div>
  )
}
