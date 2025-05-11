import React, { useContext, useEffect, useState } from "react";
import { faTrash, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RegionContext } from "@/contexte/useRegion";
import { UrlContext } from "@/contexte/useUrl";
import { RegionSkeleton } from "@/contexte/useRegion";
import Empty from "./Empty";
import axios from "axios";
import Notiflix from "notiflix";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ListeRegion({ searchTerm = '', regions: propRegions = null }) {
  const { regions: contextRegions, isLoading, getAllRegion } = useContext(RegionContext);
  const { url } = useContext(UrlContext);
  const [editingRegionId, setEditingRegionId] = useState(null);
  const [editedRegions, setEditedRegions] = useState({});
  const [selectedRegions, setSelectedRegions] = useState([]);

  const regions = propRegions || contextRegions;

  const filteredRegions = regions.filter(region => 
    region.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRegion = (regionId) => {
    setSelectedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleSelectAllRegions = () => {
    if (selectedRegions.length === filteredRegions.length) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions(filteredRegions.map(region => region.id));
    }
  };

  const handleDeleteSelectedRegions = () => {
    if (selectedRegions.length === 0) return;

    Notiflix.Confirm.show(
      'Confirmation',
      `Êtes-vous sûr de vouloir supprimer ${selectedRegions.length} région(s) ?`,
      'Oui',
      'Non',
      async () => {
        try {
          NProgress.start();
          await axios.post(`${url}/api/regions/destroy-multiple`, { region_ids: selectedRegions });
          Notiflix.Notify.success(`${selectedRegions.length} région(s) supprimée(s) avec succès`);
          setSelectedRegions([]);
          getAllRegion();
        } catch (error) {
          Notiflix.Notify.failure('Erreur lors de la suppression des régions');
        } finally {
          NProgress.done();
        }
      }
    );
  };

  const handleEditRegion = (regionId) => {
    setEditingRegionId(regionId);
    const regionToEdit = regions.find(r => r.id === regionId);
    setEditedRegions(prev => ({
      ...prev,
      [regionId]: regionToEdit.nom
    }));
  };

  const handleSaveRegion = async (regionId) => {
    try {
      NProgress.start();
      const newName = editedRegions[regionId];
      await axios.put(`${url}/api/regions/${regionId}`, { nom: newName });
      Notiflix.Notify.success('Région mise à jour avec succès');
      setEditingRegionId(null);
      getAllRegion();
    } catch (error) {
      Notiflix.Notify.warning('Erreur lors de la mise à jour de la région');
    } finally {
      NProgress.done();
    }
  };


  const handleDeleteRegion = (regionId) => {
    Notiflix.Confirm.show(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette région ?',
      'Oui',
      'Non',
      async () => {
        try {
          NProgress.start();
          await axios.delete(`${url}/api/regions/${regionId}`);
          Notiflix.Notify.success('Région supprimée avec succès');
          getAllRegion();
        } catch (error) {
          Notiflix.Notify.warning('Erreur lors de la suppression de la région');
        } finally {
          NProgress.done();
        }
      }
    );
  };

  useEffect(() => {
    getAllRegion();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="uppercase text-xs font-bold mt-8">Liste des régions</h1>
        {selectedRegions.length > 0 && (
          <div className="flex items-center gap-2 text-white bg-red-400  rounded-full px-4 py-1 cursor-pointer"
            onClick={handleDeleteSelectedRegions}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
            />
            <span className="text-sm">
              Supprimer {selectedRegions.length} région(s)
            </span>
          </div>
        )}
      </div>
      
      {(!isLoading && filteredRegions.length !== 0) && (
        <div className="bg-gray-50 max-h-[50vh] overflow-y-auto rounded mt-2 py-2 px-4 flex flex-col gap-4">
          {filteredRegions.map((region) => (
            <div key={region.id} className="flex justify-between items-center w-full border-b pb-2 last:border-b-0">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedRegions.includes(region.id)}
                  onChange={() => handleSelectRegion(region.id)}
                />
                {editingRegionId === region.id ? (
                  <input 
                    type="text" 
                    value={editedRegions[region.id] || ''} 
                    onChange={(e) => setEditedRegions(prev => ({
                      ...prev,
                      [region.id]: e.target.value
                    }))}
                    className="p-2 text-black flex-grow border rounded"
                    onBlur={() => handleSaveRegion(region.id)}
                    autoFocus
                  />
                ) : (
                  <input type="text" value={region.nom} className="p-2 text-black flex-grow" readOnly />
                )}
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 bg-red-200 p-2 rounded-full cursor-pointer"
                  onClick={() => handleDeleteRegion(region.id)}
                />
                {editingRegionId !== region.id && (
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer"
                    onClick={() => handleEditRegion(region.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && <RegionSkeleton />}

      {(!isLoading && filteredRegions.length === 0) && (
        <Empty titre={"Aucune région n'a été trouvée"} />
      )}
    </div>
  );
}
