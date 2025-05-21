import InputSearch from "./InputSearch";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegionContext } from "@/contexte/useRegion";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark, faTrash, faPen, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import TitreLabel from '@/composants/TitreLabel';
import { SupplyContext } from "@/contexte/useSupply";
import axios from "axios";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { UrlContext } from "@/contexte/useUrl";
// Données de test

function SupplyTable({ showFilters, setShowFilters }) {
  const [searchValue, setSearchValue] = useState("");
  const [region, setRegion] = useState("");
  const { regions, getAllRegion } = useContext(RegionContext);
  const { supplies, getAllSupply } = useContext(SupplyContext);
  const { url } = useContext(UrlContext);

  useEffect(() => {
    const fetchData = async () => {
      await getAllRegion();
    };
    fetchData();
  }, []);

  const handleDeleteSupply = async (id) => {
    Notiflix.Confirm.show(
      'Confirmation de suppression',
      'Êtes-vous sûr de vouloir supprimer ce matériel ?',
      'Oui',
      'Non',
      async () => {
        nProgress.start();
        try {
          await axios.delete(`${url}/api/supplies/${id}`);
          getAllSupply();
          Notiflix.Notify.success('Matériel supprimé avec succès');
        } catch (error) {
          console.error(error);
          Notiflix.Notify.failure('Erreur lors de la suppression');
        } finally {
          nProgress.done();
        }
      }
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="my-2">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center justify-center p-2 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors duration-200 ${showFilters ? "bg-blue-100" : "bg-blue-50"
          }`}
      >
        <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-blue-400" />
      </button>
      {showFilters && (
        <div className="bg-gray-50 flex flex-col rounded-lg border absolute shadow-lg">
          <div className="flex items-center justify-end px-1 py-1">
            <FontAwesomeIcon
              onClick={() => setShowFilters(false)}
              icon={faXmark}
              className="text-red-400 cursor-pointer bg-red-100 rounded-full py-1 px-1.5"
            />
          </div>
          <p className="flex items-center text-sm gap-2 text-gray-700 font-semibold uppercase px-4">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
            Filtrer par
          </p>
          <div className="flex items-center gap-2 px-4 mb-6 mt-2">
            <InputSearch
              height="h-9"
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Rechercher"
              width="w-46"
            />
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
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto border border-gray-200 rounded max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Matériel" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Région" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Stock initial" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Rubrique" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Lieux destination" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Numéros B.E" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Date" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Transporteur" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Observations" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Réceptionnaire" /></th>
              <th className="px-4 py-3 text-center"><TitreLabel titre="Actions" /></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y cursor-pointer divide-gray-200">
            {supplies.map((supply) => (
              <tr key={supply.id}>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.region.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.stock_initial}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.rubrique}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.lieu_destination}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.numero_be}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.transporteur}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.observation}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{supply.receptionnaire}</td>
                <td className="px-4 py-3 text-sm flex items-center justify-center">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDeleteSupply(supply.id)}
                      className="text-red-500 bg-red-200 p-1 rounded-full cursor-pointer"
                    />
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-blue-500 bg-blue-200 p-1 rounded-full cursor-pointer"
                    />
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-blue-500 bg-blue-200 p-1 rounded-full cursor-pointer"
                    />
                    <FontAwesomeIcon
                      icon={faMinus}
                      className="text-yellow-500 bg-yellow-200  p-1 rounded-full cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupplyTable;
