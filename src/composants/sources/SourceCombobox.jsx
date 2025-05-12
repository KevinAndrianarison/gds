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
import { SourceContext } from "@/contexte/useSource"
import TitreLabel from "../TitreLabel"
import InputOn from "../InputOn"
import ButtonAdd from "../ButtonAdd"
import { Notify } from "notiflix"

export function SourceCombobox({width, value, onChange}) {
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSourceName, setNewSourceName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sources, isLoading, getAllSources, addSource, deleteSource } = useContext(SourceContext)

  useEffect(() => {
    getAllSources()
  }, [])

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Chargement des sources...
      </Button>
    )
  }

  if (!sources || sources.length === 0) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Aucune source disponible
      </Button>
    )
  }

  const handleAddSource = async () => {
    if (!newSourceName.trim()) {
      Notify.warning("Le nom de la source est requis");
      return;
    }

    setIsSubmitting(true);
    try {
      await addSource({ nom: newSourceName });
      setNewSourceName("");
      setIsModalOpen(false);
      Notify.success("Source ajoutée avec succès");
    } catch (error) {
      console.error(error);
      Notify.failure("Erreur lors de l'ajout de la source");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSource = async (id) => {
    try {
      await deleteSource(id);
      if (value === id) {
        onChange("");
      }
      Notify.success("Source supprimée avec succès");
    } catch (error) {
      console.error(error);
      Notify.failure("Erreur lors de la suppression de la source");
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
              ? sources.find((source) => source.id === value)?.nom
              : "Sélectionner une source"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <div className="flex items-center justify-between p-2">
              <CommandInput placeholder="Rechercher une source" className="h-9" />
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
              <CommandEmpty>Source introuvable.</CommandEmpty>
              <CommandGroup>
                {sources.map((source) => (
                  <CommandItem
                    key={source.id}
                    value={source.id}
                    onSelect={() => {
                      onChange(source.id);
                      setOpen(false);
                    }}
                    className="flex justify-between"
                  >
                    <span>{source.nom}</span>
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2",
                          value === source.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSource(source.id);
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
            <DialogTitle>Ajouter une nouvelle source</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <TitreLabel titre="Nom" required />
              <InputOn
                width="w-full"
                value={newSourceName}
                onChange={setNewSourceName}
              />
            </div>
            <div className="flex justify-end">
              <ButtonAdd
                isLoad={isSubmitting}
                label="ENREGISTRER"
                onClick={handleAddSource}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
