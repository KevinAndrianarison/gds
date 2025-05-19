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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppartenanceContext } from "@/contexte/useAppartenance";
import { ShowContext } from "@/contexte/useShow";
import ListeAppartenances from "./ListeAppartenances";

export default function AppartenaceCombobox({ value, onChange, error }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const { appartenances, isLoading, getAllAppartenances } =
    useContext(AppartenanceContext);
  const { isAdmin } = useContext(ShowContext);

  useEffect(() => {
    getAllAppartenances();
  }, []);

  const selectedAppartenance =
    appartenances &&
    appartenances.find((appartenance) => appartenance.id === value);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="select"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className={cn(error ? "border-red-500" : "border-2 rounded")}
          >
            {isLoading
              ? "Chargement..."
              : selectedAppartenance
              ? selectedAppartenance.nom
              : "Sélectionner une appartenance"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Rechercher une appartenance..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty>Aucune appartenance trouvée.</CommandEmpty>
            <CommandGroup>
              {appartenances
                .filter(
                  (appartenance) =>
                    !searchTerm ||
                    appartenance.nom
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((appartenance) => (
                  <CommandItem
                    key={appartenance.id}
                    value={appartenance.id}
                    onSelect={() => {
                      onChange(appartenance.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === appartenance.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {appartenance.nom}
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
            <DialogTitle className="text-sm uppercase">
              Les appartenances
            </DialogTitle>
          </DialogHeader>
          <ListeAppartenances searchTerm={searchTerm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
