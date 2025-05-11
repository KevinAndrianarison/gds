import React, { useContext, useEffect, useState } from "react";
import FormRegion from "@/composants/FormRegion";
import InputSearch from "@/composants/InputSearch";
import FilterCroissant from "@/composants/FilterCroissant";
import FilterDecroissant from "@/composants/FilterDecroissant";
import Entete from "@/composants/Entete";
import { RegionContext } from "@/contexte/useRegion";
import ListeRegion from "@/composants/ListeRegion";


export default function Region() {
  const { regions, getAllRegion } = useContext(RegionContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedRegions = [...regions].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.nom.localeCompare(b.nom);
    } else {
      return b.nom.localeCompare(a.nom);
    }
  });

  useEffect(() => {
    getAllRegion();
  }, []);

  return (
    <div className=" w-[60vw] mx-auto">
      <Entete
        titre="régions"
        description="les régions où se trouvent vos
          bureaux"
      />
      <FormRegion />
      <div className="mt-4 flex items-center gap-2">
        <InputSearch 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <FilterCroissant 
          onClick={() => setSortOrder('asc')} 
          isActive={sortOrder === 'asc'} 
        />
        <FilterDecroissant 
          onClick={() => setSortOrder('desc')} 
          isActive={sortOrder === 'desc'} 
        />
      </div>
      <div className=" p-4 text-gray-700">
        <ListeRegion 
          searchTerm={searchTerm} 
          regions={sortedRegions} 
        />
      </div>
    </div>
  );
}
