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
import ListeCategories from "./ListeCategories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShowContext } from "@/contexte/useShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";

export default function CategorieCombobox({
  value,
  onChange,
  error,
  disabled = false,
  showAddButton = true,
}) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { categories, isLoading, getAllCategories } =
    useContext(CategorieContext);
  const { isAdmin } = useContext(ShowContext);

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
            {disabled
              ? selectedCategorie
                ? selectedCategorie.nom
                : "Catégorie"
              : selectedCategorie
              ? selectedCategorie.nom
              : "Sélectionner une catégorie"}
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
                  {categorie.nom} {(categorie.isVehicule === 1 || categorie.isVehicule === "1") && <FontAwesomeIcon icon={faCarSide} className="ml-2 text-blue-500 p-1 rounded-full bg-blue-100" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {!isLoading && showAddButton && isAdmin && (
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
