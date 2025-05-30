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
import {
  faFilter,
  faXmark,
  faTrash,
  faPen,
  faPlus,
  faMinus,
  faEye,
  faShare
} from "@fortawesome/free-solid-svg-icons";
import TitreLabel from "@/composants/TitreLabel";
import { SupplyContext } from "@/contexte/useSupply";
import axios from "axios";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { UrlContext } from "@/contexte/useUrl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PlusSupply from "./PlusSupply";
import MinusSupply from "./MinusSupply";
import DetailsSupply from "./DetailsSupply";
import { ShowContext } from "@/contexte/useShow";
import ShareMateriel from "./ShareMateriel";
// Données de test

function SupplyTable({ showFilters, setShowFilters }) {
  const [searchValue, setSearchValue] = useState("");
  const { isACL, isAdmin } = useContext(ShowContext);
  const [region, setRegion] = useState("all");
  const { regions, getAllRegion } = useContext(RegionContext);
  const { supplies, getAllSupply } = useContext(SupplyContext);
  const { url } = useContext(UrlContext);
  const [editingSupplyId, setEditingSupplyId] = useState(null);
  const [editedSupply, setEditedSupply] = useState({});
  const [originalSupply, setOriginalSupply] = useState({});
  const [filteredSupplies, setFilteredSupplies] = useState([]);

  const handleEditSupply = (supply) => {
    setEditingSupplyId(supply.id);
    setEditedSupply({ ...supply });
    setOriginalSupply({ ...supply });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllRegion();
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...supplies];

    if (region && region !== 'all') {
      filtered = filtered.filter(supply => supply.region.id === region);
    }

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(supply => 
        supply.nom?.toLowerCase().includes(searchLower) ||
        supply.rubrique?.toLowerCase().includes(searchLower) ||
        supply.lieu_destination?.toLowerCase().includes(searchLower) ||
        supply.numero_be?.toLowerCase().includes(searchLower) ||
        supply.transporteur?.toLowerCase().includes(searchLower) ||
        supply.observation?.toLowerCase().includes(searchLower) ||
        supply.receptionnaire?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSupplies(filtered);
  }, [searchValue, supplies, region]);

  const handleInputChange = (field, value) => {
    setEditedSupply((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSupply = async (id, field, value) => {
    let token = localStorage.getItem('token');
    try {
      const newValue = value || editedSupply[field];
      const hasChanged =
        newValue !== originalSupply[field] && newValue !== null && newValue !== '';

      if (hasChanged) {
        nProgress.start();
        try {
          await axios.put(`${url}/api/supplies/${id}`, { [field]: newValue }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          let region = JSON.parse(localStorage.getItem("region"));
          if (region) {
            getSupplyParIdRegion(region.id);
          } else {
            getAllSupply();
          }
          Notiflix.Notify.success("Matériel modifié avec succès");
        } catch (error) {
          console.error(error);
          Notiflix.Notify.failure("Erreur lors de la modification");
        } finally {
          nProgress.done();
        }
      }
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure("Erreur lors de la modification");
    } finally {
      nProgress.done();
    }
  };

  const handleDeleteSupply = async (id) => {
    let token = localStorage.getItem('token');
    Notiflix.Confirm.show(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer ce matériel ?",
      "Oui",
      "Non",
      async () => {
        nProgress.start();
        try {
          await axios.delete(`${url}/api/supplies/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          let region = JSON.parse(localStorage.getItem("region"));
          if (region) {
            getSupplyParIdRegion(region.id);
          } else {
            getAllSupply();
          }
          Notiflix.Notify.success("Matériel supprimé avec succès");
        } catch (error) {
          console.error(error);
          Notiflix.Notify.failure("Erreur lors de la suppression");
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
              className="text-red-500 cursor-pointer bg-red-100 rounded-full py-1 px-1.5"
            />
          </div>
          <p className="flex items-center text-sm gap-2 text-gray-700 font-semibold uppercase px-4">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
            Filtrage
          </p>
          <div className="flex items-center gap-2 px-4 mb-6 mt-2">
            <InputSearch
              height="h-9"
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Rechercher"
              width="w-46"
            />
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

      <div className="mt-2 overflow-x-auto border border-gray-200 rounded max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Matériel" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Région" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Stock initial" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Stock final" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Rubrique" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Lieux destination" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Numéros B.E" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Date" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Transporteur" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Observations" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Réceptionnaire" />
              </th>
              <th className="px-4 py-3 text-center">
                <TitreLabel titre="Actions" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y cursor-pointer divide-gray-200">
            {filteredSupplies.map((supply) => (
              <tr key={supply.id}>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="text"
                      value={editedSupply.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className="p-2 text-black flex-grow border rounded w-full"
                      onBlur={() => handleSaveSupply(supply.id, "nom")}
                      autoFocus
                    />
                  ) : (
                    supply.nom
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {supply.region.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {supply.stock_initial}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {supply.stock_final}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="text"
                      value={editedSupply.rubrique}
                      onChange={(e) =>
                        handleInputChange("rubrique", e.target.value)
                      }
                      className="p-2 text-black flex-grow border rounded w-full"
                      onBlur={() => handleSaveSupply(supply.id, "rubrique")}
                      autoFocus
                    />
                  ) : (
                    supply.rubrique
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="text"
                      value={editedSupply.lieu_destination}
                      onChange={(e) =>
                        handleInputChange("lieu_destination", e.target.value)
                      }
                      className="p-2 text-black flex-grow border rounded w-full"
                      onBlur={() =>
                        handleSaveSupply(supply.id, "lieu_destination")
                      }
                      autoFocus
                    />
                  ) : (
                    supply.lieu_destination
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="text"
                      value={editedSupply.numero_be}
                      onChange={(e) =>
                        handleInputChange("numero_be", e.target.value)
                      }
                      className="p-2 text-black flex-grow border rounded w-full"
                      onBlur={() => handleSaveSupply(supply.id, "numero_be")}
                      autoFocus
                    />
                  ) : (
                    supply.numero_be
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="date"
                      value={editedSupply.date}
                      onChange={(e) => {
                        handleInputChange("date", e.target.value);
                        handleSaveSupply(supply.id, "date", e.target.value);
                      }}
                      className="p-2 text-black flex-grow border rounded w-full"
                    />
                  ) : (
                    supply.date
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="text"
                      value={editedSupply.transporteur}
                      onChange={(e) =>
                        handleInputChange("transporteur", e.target.value)
                      }
                      className="p-2 text-black flex-grow border rounded w-full"
                      onBlur={() => handleSaveSupply(supply.id, "transporteur")}
                      autoFocus
                    />
                  ) : (
                    supply.transporteur
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {editingSupplyId === supply.id ? (
                    <input
                      type="text"
                      value={editedSupply.observation}
                      onChange={(e) =>
                        handleInputChange("observation", e.target.value)
                      }
                      className="p-2 text-black flex-grow border rounded w-full"
                      onBlur={() => handleSaveSupply(supply.id, "observation")}
                      autoFocus
                    />
                  ) : (
                    supply.observation
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                  {supply.receptionnaire}
                </td>
                <td className="px-4 py-3 text-sm flex items-center justify-center">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDeleteSupply(supply.id)}
                      className="text-red-500 bg-red-200 p-1 rounded-full cursor-pointer"
                    />

                    {(editingSupplyId !== supply.id ||
                      editedSupply.id === null) && (
                        <FontAwesomeIcon
                          icon={faPen}
                          onClick={() => handleEditSupply(supply)}
                          className="text-blue-500 bg-blue-200 p-1 rounded-full cursor-pointer"
                        />
                      )}

                    <Popover>
                      <PopoverTrigger>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-blue-500 bg-blue-200 p-1 rounded-full mt-1 cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PlusSupply supply={supply} />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger>
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="text-yellow-500 bg-yellow-200 mt-1 p-1 rounded-full cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <MinusSupply supply={supply} />
                      </PopoverContent>
                    </Popover>
                    {supply.details_supply.length > 0 && (
                      <Popover>
                        <PopoverTrigger>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-gray-500 bg-gray-200 mt-1 p-1 rounded-full cursor-pointer"
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-[80vw]">
                          <DetailsSupply supply={supply} />
                        </PopoverContent>
                      </Popover>
                    )}
                    <Popover>
                      <PopoverTrigger>
                        <FontAwesomeIcon
                          icon={faShare}
                          className="text-gray-500 bg-gray-200 mt-1 p-1 rounded-full cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px]">
                        <ShareMateriel supply={supply} status="supply" />
                      </PopoverContent>
                    </Popover>
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
