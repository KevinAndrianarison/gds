import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { SupplyContext } from "../contexte/useSupply";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { useState } from "react";

export default function DetailsSupply({ supply }) {
  const { getAllSupply } = useContext(SupplyContext);
  const { url } = useContext(UrlContext);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editedDetail, setEditedDetail] = useState({});
  const [originalDetail, setOriginalDetail] = useState({});

  const handleInputChange = (field, value) => {
    setEditedDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDetail = async (id, field) => {
    try {
      const newValue = editedDetail[field] || originalDetail[field];
      const hasChanged =
        newValue !== originalDetail[field] && newValue !== null;
        
      if (hasChanged) {
        nProgress.start();
        try {
          await axios.put(`${url}/api/details-supplies/${id}`, { [field]: newValue, supply_id: supply.id });
          getAllSupply();
          Notiflix.Notify.success("Détail modifié avec succès");
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

  const handleDeleteDetail = (id) => {
    nProgress.start();
    axios
      .delete(`${url}/api/details-supplies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        getAllSupply();
        nProgress.done();
        Notiflix.Notify.success("Détail supprimé avec succès");
      })
      .catch((err) => {
        console.error(err);
        nProgress.done();
        Notiflix.Notify.failure(
          err.response.data.message || " Erreur lors de la suppression"
        );
      });
  };


  const handleEditDetail = (detail) => {
    setEditingDetailId(detail.id);
    setEditedDetail({...detail});
    setOriginalDetail({...detail});
  };
  return (
    <div>
      <h1 className="text-lg font-bold">
        Details des <b className="text-blue-500">ENTRER - SORTIE</b>
      </h1>
      <p className="flex items-center text-sm gap-2 text-gray-500">
        <FontAwesomeIcon icon={faThumbTack} className="text-yellow-500" />{" "}
        {supply.nom}
      </p>
      <div className="mt-4 text-sm">
        <div className="flex gap-2 bg-gray-100 py-2 uppercase font-bold text-gray-500 rounded-t-sm">
          <h1 className="w-[14%] px-4">Rubrique</h1>
          <h1 className="w-[10%]">Lieu</h1>
          <h1 className="w-[14%]">Transporteur</h1>
          <h1 className="w-[14%]">Réceptionnaire</h1>
          <h1 className="w-[10%]">Numeros B.E</h1>
          <h1 className="w-[14%]">Observations</h1>
          <h1 className="w-[5%]">E/S</h1>
          <h1 className="w-[10%]">Date</h1>
          <div className="w-[9%] text-center">Actions</div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {supply.details_supply.map((detail) => (
            <div key={detail.id} className="flex gap-2 py-2">
              <h1 className="w-[14%] truncate px-4">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.rubrique}
                    onChange={(e) =>
                      handleInputChange("rubrique", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "rubrique")}
                    autoFocus
                  />
                ) : (
                  detail?.rubrique
                )}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.lieu_destination}
                    onChange={(e) =>
                      handleInputChange("lieu_destination", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "lieu_destination")}
                    autoFocus
                  />
                ) : (
                  detail?.lieu_destination
                )}
              </h1>
              <h1 className="w-[14%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.transporteur}
                    onChange={(e) =>
                      handleInputChange("transporteur", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "transporteur")}
                    autoFocus
                  />
                ) : (
                  detail?.transporteur
                )}
              </h1>
              <h1 className="w-[14%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.receptionnaire}
                    onChange={(e) =>
                      handleInputChange("receptionnaire", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "receptionnaire")}
                    autoFocus
                  />
                ) : (
                  detail?.receptionnaire
                )}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.numero_be}
                    onChange={(e) =>
                      handleInputChange("numero_be", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "numero_be")}
                    autoFocus
                  />
                ) : (
                  detail?.numero_be
                )}
              </h1>
              <h1 className="w-[14%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.observation}
                    onChange={(e) =>
                      handleInputChange("observation", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "observation")}
                    autoFocus
                  />
                ) : (
                  detail?.observation
                )}
              </h1>
              <h1
                className={`w-[5%] truncate font-bold ${
                  detail?.entree ? "text-green-500" : "text-red-500"
                }`}
              >
                {detail?.entree || detail?.sortie}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "date")}
                    autoFocus
                  />
                ) : (
                  detail?.date
                )}
              </h1>
              <div className="w-[9%] flex gap-1 justify-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleDeleteDetail(detail.id)}
                  className="text-red-500 border-2 text-xs border-red-500 cursor-pointer rounded-full p-1"
                />
                <FontAwesomeIcon
                  icon={faPen}
                  onClick={() => handleEditDetail(detail)}
                  className="text-yellow-500 border-2 text-xs border-yellow-500 cursor-pointer rounded-full p-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
