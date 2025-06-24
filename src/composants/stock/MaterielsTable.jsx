import React, { useState, useContext } from "react";
import TitreLabel from "@/composants/TitreLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faShare,
  faCarSide,
  faImages,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { MaterielContext } from "@/contexte/useMateriel";
import Notiflix from "notiflix";
import NProgress from "nprogress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ShareMateriel from "@/composants/ShareMateriel";
import ListeImage from "@/composants/ListeImage";

export default function MaterielsTable({ materiels }) {
  const {
    deleteMateriel,
    updateMateriel,
    getMaterielParIdRegion,
    getAllMateriels,
  } = useContext(MaterielContext);
  const [editingMaterielId, setEditingMaterielId] = useState(null);
  const [editedMateriel, setEditedMateriel] = useState({});
  const [originalMateriel, setOriginalMateriel] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleEditMateriel = (materiel) => {
    setEditingMaterielId(materiel.id);
    setEditedMateriel({ ...materiel });
    setOriginalMateriel({ ...materiel });
  };

  const handleDeleteMateriel = (id) => {
    Notiflix.Confirm.show(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer ce matériel ?",
      "Oui",
      "Non",
      async () => {
        try {
          NProgress.start();
          await deleteMateriel(id);
        } catch (error) {
          Notiflix.Notify.warning("Erreur lors de la suppression du matériel");
        } finally {
          NProgress.done();
        }
      }
    );
  };

  const handleSaveMateriel = async (id, field, value) => {
    try {
      const newValue = value || editedMateriel[field];
      const hasChanged =
        newValue !== originalMateriel[field] &&
        newValue !== null &&
        newValue !== "";

      if (hasChanged) {
        const updateData = { [field]: newValue };
        await updateMateriel(id, updateData);
        // Mettre à jour l'original avec la nouvelle valeur
        setOriginalMateriel((prev) => ({
          ...prev,
          [field]: editedMateriel[field],
        }));
        let region = JSON.parse(localStorage.getItem("region"));
        if (region) {
          getMaterielParIdRegion(region.id);
        } else {
          getAllMateriels();
        }
      }
    } catch (error) {
      Notiflix.Notify.warning("Erreur lors de la mise à jour");
      setEditedMateriel((prev) => ({
        ...prev,
        [field]: originalMateriel[field],
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedMateriel((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <div className="mt-4 overflow-x-auto border border-gray-200 rounded max-h-[500px] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 whitespace-nowrap">
          <tr>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Source" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="N° Référence" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Catégorie" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Caractéristiques" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Type" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Marque" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="État" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Appartenance" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Montant (Ar)" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="N° Série" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="N° IMEI" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Date d'acquisition" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Région" />
            </th>
            <th className="px-6 py-4 text-left min-w-[150px]">
              <TitreLabel titre="Responsable" />
            </th>
            <th className="px-4 py-3 text-center">
              <TitreLabel titre="Actions" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y cursor-pointer divide-gray-200">
          {materiels.map((materiel) => (
            <tr key={materiel.id}>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.source?.nom}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, "source")}
                    autoFocus
                  />
                ) : (
                  materiel.source?.nom || "..."
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.numero}
                    onChange={(e) =>
                      handleInputChange("numero", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, "numero")}
                    autoFocus
                  />
                ) : (
                  materiel.numero
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px] flex items-center gap-2">
                {(materiel.categorie.isVehicule === 1 ||
                materiel.categorie.isVehicule === "1") ? (
                  <FontAwesomeIcon
                    icon={faCarSide}
                    className="text-blue-500 bg-blue-200 p-1 rounded-full"
                  />
                ) : (
                  ""
                )}{" "}
                {materiel.categorie?.nom || "..."}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.caracteristiques || ""}
                    onChange={(e) =>
                      handleInputChange("caracteristiques", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() =>
                      handleSaveMateriel(materiel.id, "caracteristiques")
                    }
                  />
                ) : (
                  materiel.caracteristiques || "..."
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {materiel.type?.nom || "..."}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.marque || ""}
                    onChange={(e) =>
                      handleInputChange("marque", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, "marque")}
                  />
                ) : (
                  materiel.marque || "..."
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-3xl text-white text-xs font-medium ${
                    materiel.etat === "Bon état"
                      ? "bg-green-400"
                      : materiel.etat === "État moyen"
                      ? "bg-yellow-400"
                      : materiel.etat === "Mauvais état"
                      ? "bg-red-400"
                      : "bg-gray-400"
                  }`}
                >
                  {materiel.etat}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {materiel.appartenance?.nom || "..."}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="number"
                    value={editedMateriel.montant || ""}
                    onChange={(e) =>
                      handleInputChange("montant", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, "montant")}
                  />
                ) : (
                  <div>
                    <p>
                      {materiel.montant}{" "}
                      <b className="text-blue-500 text-xs">
                        {materiel.taux_amortissement && (
                          <span>({materiel.taux_amortissement}%)</span>
                        )}
                      </b>
                    </p>
                    {materiel.valeur_net && <p>Net : {materiel.valeur_net}</p>}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.numero_serie || ""}
                    onChange={(e) =>
                      handleInputChange("numero_serie", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() =>
                      handleSaveMateriel(materiel.id, "numero_serie")
                    }
                  />
                ) : (
                  materiel.numero_serie || "..."
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.numero_imei || ""}
                    onChange={(e) =>
                      handleInputChange("numero_imei", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() =>
                      handleSaveMateriel(materiel.id, "numero_imei")
                    }
                  />
                ) : (
                  materiel.numero_imei || "..."
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="date"
                    value={editedMateriel.date_acquisition || ""}
                    onChange={(e) => {
                      handleInputChange("date_acquisition", e.target.value);
                      handleSaveMateriel(
                        materiel.id,
                        "date_acquisition",
                        e.target.value
                      );
                    }}
                    className="p-2 text-black flex-grow border rounded w-full"
                  />
                ) : (
                  materiel.date_acquisition || "..."
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {materiel.region?.nom || "..."}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {materiel.responsable?.name || "Non assigné"}
              </td>
              <td className="px-4 py-3 text-sm flex items-center justify-center">
                <div className="flex items-center gap-2 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 bg-red-200 p-2 rounded-full cursor-pointer"
                    onClick={() => handleDeleteMateriel(materiel.id)}
                  />
                  {editingMaterielId !== materiel.id && (
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer"
                      onClick={() => handleEditMateriel(materiel)}
                    />
                  )}
                  <Popover>
                    <PopoverTrigger>
                      <FontAwesomeIcon
                        icon={faShare}
                        className="text-gray-500 bg-gray-200 p-2 rounded-full cursor-pointer mt-1"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px]">
                      <ShareMateriel materiel={materiel} status="materiel" />
                    </PopoverContent>
                  </Popover>
                  {materiel.photos.length !== 0 && (
                    <FontAwesomeIcon
                      icon={faImages}
                      onClick={() => {
                        setPhotos(materiel.photos);
                        setIsOpen(true);
                      }}
                      className="text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-sm p-2"
          >
            <div className="flex justify-end">
              <FontAwesomeIcon
                icon={faXmark}
                className="text-gray-700 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <ListeImage photos={photos} setPhotos={setPhotos} />
          </div>
        </div>
      )}
    </div>
  );
}
