import React, { useState, useContext, useEffect } from "react";
import { materielService } from "@/services/materielService";
import { MaterielContext } from "@/contexte/useMateriel";
import Notiflix from "notiflix";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputOn from "@/composants/InputOn";
import TitreLabel from "@/composants/TitreLabel";
import { ComboboxComponent } from "@/composants/ComboboxComponent";
import CategorieCombobox from "@/composants/stock/CategorieCombobox";
import TypeCombobox from "@/composants/stock/TypeCombobox";
import UserCombobox from "@/composants/users/UserCombobox";
import SourceCombobox from "@/composants/stock/SourceCombobox";
import ReferenceCombobox from "@/composants/stock/ReferenceCombobox";
import AppartenaceCombobox from "@/composants/stock/AppartenaceCombobox";
import ButtonAdd from "@/composants/ButtonAdd";
import { TypeContext } from "@/contexte/useType";
import { ShowContext } from "@/contexte/useShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AddMaterielModal({ isOpen, onClose }) {
  const [categorie_id, setCategorieId] = useState("");
  const [type_id, setTypeId] = useState("");
  const [marque, setMarque] = useState("");
  const [caracteristiques, setCaracteristiques] = useState("");
  const [etat, setEtat] = useState("");
  const [region_id, setRegionId] = useState("");
  const [responsable_id, setResponsableId] = useState("");
  const [numero_serie, setNumeroSerie] = useState("");
  const [numero_imei, setNumeroImei] = useState("");
  const [montant, setMontant] = useState("");
  const [date_acquisition, setDateAcquisition] = useState("");
  const [lieu_affectation, setLieuAffectation] = useState("");
  const [source_id, setSourceId] = useState("");
  const [reference_id, setReferenceId] = useState("");
  const [appartenance_id, setAppartenanceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, isACL } = useContext(ShowContext);
  const [error, setError] = useState(null);
  const { types, filterTypesByCategorie } = useContext(TypeContext);
  const { getAllMateriels, getMaterielParIdRegion } =
    useContext(MaterielContext);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    if (isACL) {
      const storedRegionId = JSON.parse(localStorage.getItem("region"))?.id;
      setRegionId(storedRegionId);
    }
  }, [isACL]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);

      const previews = selectedFiles.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      });

      Promise.all(previews).then((results) => {
        setFilePreviews(results);
      });
    }
  };

  const validateForm = () => {
    const formData = {
      reference_id,
      categorie_id,
      type_id,
      etat,
      region_id,
      responsable_id,
    };

    const requiredFields = {
      reference_id: "Référence",
      categorie_id: "Catégorie",
      type_id: "Type",
      etat: "État",
      region_id: "Région",
      responsable_id: "Responsable",
    };

    const missingFields = [];
    Object.entries(formData).forEach(([field, value]) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        missingFields.push(requiredFields[field]);
      }
    });

    if (missingFields.length > 0) {
      Notiflix.Notify.warning(
        `Veuillez remplir tous les champs obligatoires : ${missingFields.join(
          ", "
        )}`,
        { timeout: 5000 }
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("reference_id", parseInt(reference_id));
      formData.append("categorie_id", parseInt(categorie_id));
      formData.append("type_id", parseInt(type_id));
      formData.append("marque", marque);
      formData.append("caracteristiques", caracteristiques);
      formData.append("etat", etat);
      formData.append("region_id", parseInt(region_id));
      formData.append("responsable_id", parseInt(responsable_id));
      formData.append("numero_serie", numero_serie);
      formData.append("numero_imei", numero_imei);
      if (montant) {
        formData.append("montant", parseFloat(montant));
      }
      formData.append("date_acquisition", date_acquisition);
      formData.append("lieu_affectation", lieu_affectation);
      if (source_id) {
        formData.append("source_id", parseInt(source_id));
      }
      if (appartenance_id) {
        formData.append("appartenance_id", parseInt(appartenance_id));
      }
      files.forEach((file) => {
        formData.append("photos[]", file);
      });

      await materielService.createMateriel(formData);
      onClose();
      if (isAdmin) {
        getAllMateriels();
      } else {
        getMaterielParIdRegion(region_id);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        Notiflix.Notify.failure(err.response.data.message);
      } else {
        Notiflix.Notify.failure("Erreur lors de la création du matériel");
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un matériel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <TitreLabel titre="Catégorie" required />
              <CategorieCombobox
                width="w-full"
                value={categorie_id}
                disabled={true}
                onChange={(categorieId) => {
                  setCategorieId(categorieId);
                  filterTypesByCategorie(categorieId);
                  setTypeId("");
                }}
                onTypeFilterChange={filterTypesByCategorie}
              />
            </div>

            <div className="space-y-2">
              <TitreLabel titre="Type" required />
              <TypeCombobox
                width="w-full"
                value={type_id}
                onChange={(typeId) => {
                  setTypeId(typeId);
                  const selectedType = types.find((type) => type.id === typeId);
                  if (selectedType) {
                    setCategorieId(selectedType.categorie_id);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <TitreLabel titre="Lieu d'affectation" />
            <InputOn
              width="w-full"
              value={lieu_affectation}
              onChange={setLieuAffectation}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 w-80">
              <TitreLabel titre="Source" />
              <SourceCombobox
                width="w-full"
                value={source_id}
                onChange={setSourceId}
              />
            </div>

            <div className="space-y-2 w-80">
              <TitreLabel titre="Référence" required />
              <ReferenceCombobox
                width="w-full"
                value={reference_id}
                onChange={setReferenceId}
              />
            </div>

            <div className="space-y-2 w-80">
              <TitreLabel titre="Appartenance" />
              <AppartenaceCombobox
                value={appartenance_id}
                onChange={setAppartenanceId}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <TitreLabel titre="Marque" />
              <InputOn width="w-full" value={marque} onChange={setMarque} />
            </div>

            <div className="space-y-2">
              <TitreLabel titre="État" required />
              <Select value={etat} onValueChange={setEtat}>
                <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bon état">Bon état</SelectItem>
                  <SelectItem value="État moyen">État moyen</SelectItem>
                  <SelectItem value="Mauvais état">Mauvais état</SelectItem>
                  <SelectItem value="Hors service">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <TitreLabel titre="Caractéristiques" />
            <InputOn
              width="w-full"
              value={caracteristiques}
              onChange={setCaracteristiques}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isAdmin && (
              <div className="space-y-2 ">
                <TitreLabel titre="Région" required />
                <ComboboxComponent
                  width="w-full"
                  value={region_id}
                  onChange={setRegionId}
                />
              </div>
            )}

            <div className="space-y-2">
              <TitreLabel titre="Responsable" required />
              <UserCombobox
                width="w-full"
                value={responsable_id}
                onChange={setResponsableId}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <TitreLabel titre="Numéro de série" />
                <InputOn
                  width="w-full"
                  value={numero_serie}
                  onChange={setNumeroSerie}
                />
              </div>

              <div className="space-y-2">
                <TitreLabel titre="IMEI" />
                <InputOn
                  width="w-full"
                  value={numero_imei}
                  onChange={setNumeroImei}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <TitreLabel titre="Montant (Ariary)" />
                <InputOn
                  width="w-full"
                  type="number"
                  value={montant}
                  onChange={setMontant}
                />
              </div>

              <div className="space-y-2">
                <TitreLabel titre="Date d'acquisition" />
                <InputOn
                  width="w-full"
                  type="date"
                  value={date_acquisition}
                  onChange={setDateAcquisition}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <TitreLabel titre="Télécharger des fichiers" />
            <div className="flex items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer bg-gray-100 text-gray-600 px-4 py-2 rounded"
              >
                Choisir des fichiers
              </label>
              {filePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      {preview.startsWith("data:image") ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200">
                          <span className="text-gray-600">
                            File {index + 1}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const newFiles = [...files];
                          const newPreviews = [...filePreviews];
                          newFiles.splice(index, 1);
                          newPreviews.splice(index, 1);
                          setFiles(newFiles);
                          setFilePreviews(newPreviews);
                        }}
                        className="absolute -top-2 cursor-pointer -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <ButtonAdd
            onClick={handleSubmit}
            label="AJOUTER"
            isLoad={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
