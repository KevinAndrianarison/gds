import React, { useState } from "react";
import { materielService } from "@/services/materielService";
import { notify } from "@/utils/notify";
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
import ButtonAdd from "@/composants/ButtonAdd";

export default function AddMaterielModal({ isOpen, onClose, onSuccess }) {
  const [numero, setNumero] = useState("");
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState(null);

  const validateForm = () => {
    const formData = {
      numero,
      categorie_id,
      type_id,
      etat,
      region_id,
      responsable_id,
    };

    const requiredFields = {
      numero: "Numéro",
      categorie_id: "Catégorie",
      type_id: "Type",
      etat: "État",
      region_id: "Région",
      responsable_id: "Responsable",
    };

    const missingFields = [];
    Object.entries(formData).forEach(([field, value]) => {
      if (!value || (typeof value === 'string' && value.trim() === "")) {
        missingFields.push(requiredFields[field]);
      }
    });

    if (missingFields.length > 0) {
      notify.error({
        message: `Veuillez remplir tous les champs obligatoires : ${missingFields.join(
          ", "
        )}`,
        timeout: 5000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const materielData = {
        numero,
        categorie_id: parseInt(categorie_id),
        type_id: parseInt(type_id),
        marque,
        caracteristiques,
        etat: parseInt(etat),
        region_id: parseInt(region_id),
        responsable_id: parseInt(responsable_id),
        numero_serie,
        numero_imei,
        montant: montant ? parseFloat(montant) : null,
        date_acquisition,
        lieu_affectation,
        source_id: source_id ? parseInt(source_id) : null,
        reference_id: reference_id ? parseInt(reference_id) : null,
      };

      await materielService.createMateriel(materielData);
      notify.success("Matériel ajouté avec succès");
      onSuccess?.();
    } catch (err) {
      if (err.response?.data?.message) {
        notify.error(err.response.data.message);
      } else {
        notify.error(error);
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
          <div className="space-y-2">
            <TitreLabel titre="Numéro" required />
            <InputOn width="w-full" value={numero} onChange={setNumero} />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 w-80">
              <TitreLabel titre="Catégorie" required />
              <CategorieCombobox
                width="w-full"
                value={categorie_id}
                onChange={setCategorieId}
              />
            </div>

            <div className="space-y-2 w-80">
              <TitreLabel titre="Type" required />
              <TypeCombobox
                width="w-full"
                value={type_id}
                onChange={setTypeId}
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
              <TitreLabel titre="Référence" />
              <ReferenceCombobox
                width="w-full"
                value={reference_id}
                onChange={setReferenceId}
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
                  <SelectItem value="1">Neuf</SelectItem>
                  <SelectItem value="2">Bon état</SelectItem>
                  <SelectItem value="3">État moyen</SelectItem>
                  <SelectItem value="4">Mauvais état</SelectItem>
                  <SelectItem value="5">Hors service</SelectItem>
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
            <div className="space-y-2">
              <TitreLabel titre="Région" required />
              <ComboboxComponent
                width="w-full"
                value={region_id}
                onChange={setRegionId}
              />
            </div>

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
                <TitreLabel titre="Montant" />
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
        </div>
        <div className="flex justify-end pt-2">
          <ButtonAdd onClick={handleSubmit} label="AJOUTER" isLoad={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
