import React, { useState, useContext, useEffect } from "react"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ReferenceContext } from "@/contexte/useReference"
import TitreLabel from "../TitreLabel"
import InputOn from "../InputOn"
import ButtonAdd from "../ButtonAdd"
import { Notify } from "notiflix"

export function ReferenceCombobox({width, value, onChange}) {
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newReferenceName, setNewReferenceName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { references, isLoading, getAllReferences, addReference, deleteReference } = useContext(ReferenceContext)

  useEffect(() => {
    getAllReferences()
  }, [])

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Chargement des références...
      </Button>
    )
  }

  if (!references || references.length === 0) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Aucune référence disponible
      </Button>
    )
  }

  const handleAddReference = async () => {
    if (!newReferenceName.trim()) {
      Notify.warning("Le nom de la référence est requis");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReference({ nom: newReferenceName });
      setNewReferenceName("");
      setIsModalOpen(false);
      Notify.success("Référence ajoutée avec succès");
    } catch (error) {
      console.error(error);
      Notify.failure("Erreur lors de l'ajout de la référence");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReference = async (id) => {
    try {
      await deleteReference(id);
      if (value === id) {
        onChange("");
      }
      Notify.success("Référence supprimée avec succès");
    } catch (error) {
      console.error(error);
      Notify.failure("Erreur lors de la suppression de la référence");
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
          >
            {value
              ? references.find((ref) => ref.id === value)?.nom
              : "Sélectionner une référence"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <div className="flex items-center justify-between p-2">
              <CommandInput placeholder="Rechercher une référence" className="h-9" />
              <Button
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <CommandList>
              <CommandEmpty>Référence introuvable.</CommandEmpty>
              <CommandGroup>
                {references.map((ref) => (
                  <CommandItem
                    key={ref.id}
                    value={ref.id}
                    onSelect={() => {
                      onChange(ref.id);
                      setOpen(false);
                    }}
                    className="flex justify-between"
                  >
                    <span>{ref.nom}</span>
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2",
                          value === ref.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReference(ref.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle référence</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <TitreLabel titre="Nom" required />
              <InputOn
                width="w-full"
                value={newReferenceName}
                onChange={setNewReferenceName}
              />
            </div>
            <div className="flex justify-end">
              <ButtonAdd
                isLoad={isSubmitting}
                label="ENREGISTRER"
                onClick={handleAddReference}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
