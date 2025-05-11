import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputOn from "@/composants/InputOn";
import TitreLabel from "@/composants/TitreLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ButtonAdd from "@/composants/ButtonAdd";

export default function AddMaterielModal({ isOpen, onClose }) {
  const [numero, setNumero] = useState("");
  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState("");
  const [marque, setMarque] = useState("");
  const [caracteristiques, setCaracteristiques] = useState("");
  const [etat, setEtat] = useState("");
  const [ville, setVille] = useState("");
  const [responsable, setResponsable] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implémenter l'ajout du matériel

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un matériel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <TitreLabel titre="Numéro" />
            <InputOn
              width="w-full"
              value={numero}
              onChange={setNumero}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <TitreLabel titre="Catégorie" />
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informatique">Informatique</SelectItem>
                  <SelectItem value="mobilier">Mobilier</SelectItem>
                  <SelectItem value="vehicule">Véhicule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <TitreLabel titre="Type" />
              <InputOn
                width="w-full"
                value={type}
                onChange={setType}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <TitreLabel titre="Marque" />
              <InputOn
                width="w-full"
                value={marque}
                onChange={setMarque}
              />
            </div>

            <div className="space-y-2">
              <TitreLabel titre="État" />
              <Select value={etat} onValueChange={setEtat}>
                <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bon">Bon état</SelectItem>
                  <SelectItem value="moyen">État moyen</SelectItem>
                  <SelectItem value="mauvais">Mauvais état</SelectItem>
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
              <TitreLabel titre="Ville" />
              <Select value={ville} onValueChange={setVille}>
                <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-full">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antananarivo">Antananarivo</SelectItem>
                  <SelectItem value="toamasina">Toamasina</SelectItem>
                  <SelectItem value="mahajanga">Mahajanga</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <TitreLabel titre="Responsable" />
              <InputOn
                width="w-full"
                value={responsable}
                onChange={setResponsable}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <ButtonAdd label="AJOUTER" isLoad={isSubmitting} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
