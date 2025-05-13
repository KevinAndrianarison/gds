import React, { useState, useContext, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CategorieContext } from "@/contexte/useCategorie";
import InputSearch from "@/composants/InputSearch";
import ListeCategories from "./ListeCategories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategorieCombobox({ value, onChange, error, disabled = false, showAddButton = true }) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { categories, isLoading, getAllCategories } =
    useContext(CategorieContext);

  useEffect(() => {
    getAllCategories();
  }, []);

  const selectedCategorie = categories.find(
    (categorie) => categorie.id === value
  );

  return (
    <div className="flex gap-2 w-60">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="select"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading || disabled}
            className={cn(
              error ? "border-red-500" : "border-2 rounded",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {disabled ? "Catégorie" : "Sélectionner une catégorie"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput placeholder="Rechercher une catégorie" />
            <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
            <CommandGroup>
              {categories.map((categorie) => (
                <CommandItem
                  key={categorie.id}
                  onSelect={() => {
                    onChange(categorie.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 ",
                      value === categorie.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {categorie.nom}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {!isLoading && showAddButton && (
        <Button
          type="button"
          variant="addIcon"
          size="icon"
          disabled={isLoading}
          className="rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase text-sm">
              Les catégories
            </DialogTitle>
          </DialogHeader>
          <ListeCategories searchTerm={searchTerm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
