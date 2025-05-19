import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InputOn from "@/composants/InputOn";
import ButtonAdd from "@/composants/ButtonAdd";
import ListeAppartenances from "./ListeAppartenances";

export default function ModalAppartenance({ isOpen, onClose }) {
  const { searchTerm } = useContext(AppartenanceContext);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase">
            Les appartenances
          </DialogTitle>
        </DialogHeader>
        <ListeAppartenances searchTerm={searchTerm} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <InputOn
              width="w-full"
              value={nom}
              onChange={setNom}
              placeholder="Entrez le nom de l'appartenance"
            />
          </div>

          <div className="flex justify-end">
            <ButtonAdd
              onClick={handleSubmit}
              label="AJOUTER"
              isLoad={isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
