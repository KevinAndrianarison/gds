import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { SupplyContext } from "../contexte/useSupply";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { useState } from "react";
import TitreLabel from "./TitreLabel";
import ButtonPdf from "./ButtonPdf";
import ButtonExcel from "./ButtonExcel";

export default function DetailsSupply({ supply }) {
  const { getAllSupply, getSupplyParIdRegion } = useContext(SupplyContext);
  const { url } = useContext(UrlContext);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editedDetail, setEditedDetail] = useState({});
  const [originalDetail, setOriginalDetail] = useState({});

  const handleInputChange = (field, value) => {
    setEditedDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDetail = async (id, field, value) => {
    let token = localStorage.getItem('token');
    try {
      const newValue = value || editedDetail[field];
      const hasChanged =
        newValue !== originalDetail[field] && newValue !== null && newValue !== '';

      if (hasChanged) {
        nProgress.start();
        try {
          await axios.put(`${url}/api/details-supplies/${id}`, { [field]: newValue, supply_id: supply.id }, {
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
    let token = localStorage.getItem('token');
    nProgress.start();
    axios
      .delete(`${url}/api/details-supplies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        let region = JSON.parse(localStorage.getItem("region"));
        if (region) {
          getSupplyParIdRegion(region.id);
        } else {
          getAllSupply();
        }
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
    setEditedDetail({ ...detail });
    setOriginalDetail({ ...detail });
  };
  return (
    <div>
      <h1 className="text-lg">
        <b className="text-gray-700">Entrer - Sortie</b>
      </h1>
      <p className="flex items-center text-xs font-bold gap-2 text-gray-500">
        <FontAwesomeIcon icon={faThumbTack} className="text-yellow-500" />{" "}
        {supply.nom}
      </p>
      <div className="mt-4 text-sm border rounded-sm">
        <div className="flex gap-2 bg-gray-100 py-2 rounded-t-sm">
          <div className="w-[14%] px-4"><TitreLabel titre="Rubrique" /></div>
          <div className="w-[10%]"><TitreLabel titre="Lieu" /></div>
          <div className="w-[14%]"><TitreLabel titre="Transporteur" /></div>
          <div className="w-[14%]"><TitreLabel titre="Réceptionnaire" /></div>
          <div className="w-[10%]"><TitreLabel titre="Numeros B.E" /></div>
          <div className="w-[14%]"><TitreLabel titre="Observations" /></div>
          <div className="w-[5%]"><TitreLabel titre="E/S" /></div>
          <div className="w-[10%]"><TitreLabel titre="Date" /></div>
          <div className="w-[9%] text-center"><TitreLabel titre="Actions" /></div>
        </div>
        <div className="max-h-80 overflow-y-auto border-t">
          {supply.details_supply.map((detail) => (
            <div key={detail.id} className="flex gap-2 py-2">
              <h1 className="w-[14%] truncate px-4">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.rubrique}
                    onChange={(e) => {
                      handleInputChange("rubrique", e.target.value);
                      handleSaveDetail(detail.id, "rubrique", e.target.value);
                    }}
                    className="p-2 text-black flex-grow border rounded w-full"
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
                className={`w-[5%] truncate font-bold ${detail?.entree ? "text-green-500" : "text-red-500"
                  }`}
              >
                {detail?.entree || detail?.sortie}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="date"
                    value={editedDetail.date}
                    onChange={(e) => {
                      handleInputChange("date", e.target.value);
                      handleSaveDetail(detail.id, "date", e.target.value);
                    }}
                    className="p-2 text-black flex-grow border rounded w-full"
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
                {(editingDetailId !== detail.id ||
                  editedDetail.id === null) && (
                    <FontAwesomeIcon
                      icon={faPen}
                      onClick={() => handleEditDetail(detail)}
                      className="text-yellow-500 border-2 text-xs border-yellow-500 cursor-pointer rounded-full p-1"
                    />
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 text-sm mt-4">
        <ButtonPdf />
        <ButtonExcel />
      </div>
    </div>
  );
}
