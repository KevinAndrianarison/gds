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
import { TypeContext } from "@/contexte/useType";
import ListeTypes from "./ListeTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShowContext } from "@/contexte/useShow";

export default function TypeCombobox({ value, onChange, error }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { types, isLoading, getAllTypes } = useContext(TypeContext);
  const { isAdmin } = useContext(ShowContext);

  useEffect(() => {
    getAllTypes();
  }, []);

  const selectedType = types.find((type) => type.id === value);

  return (
    <div className="flex gap-2 w-60">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="select"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className={cn(
              error ? "border-red-500" : "border-2 rounded"
            )}
          >
            {isLoading
              ? "Chargement..."
              : selectedType
              ? selectedType.nom
              : "Sélectionner un type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput placeholder="Rechercher un type" />
            <CommandEmpty>Aucun type trouvé.</CommandEmpty>
            <CommandGroup>
              {types.map((type) => (
                <CommandItem
                  key={type.id}
                  onSelect={() => {
                    onChange(type.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === type.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {type.nom}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {!isLoading && isAdmin && (
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
            <DialogTitle className="text-sm uppercase">Les types</DialogTitle>
          </DialogHeader>
          <ListeTypes searchTerm={searchTerm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
