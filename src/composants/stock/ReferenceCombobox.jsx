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
import { ReferenceContext } from "@/contexte/useReference";
import ListeReferences from "./ListeReferences";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShowContext } from "@/contexte/useShow";

export default function ReferenceCombobox({ value, onChange, error }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { references, isLoading, getAllReferences } =
    useContext(ReferenceContext);
  const { isAdmin } = useContext(ShowContext);

  useEffect(() => {
    getAllReferences();
  }, []);

  const selectedReference = references.find(
    (reference) => reference.id === value
  );

  return (
    <div className="flex gap-2">
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
              : selectedReference
              ? selectedReference.nom
              : "Sélectionner une référence"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une référence" />
            <CommandEmpty>Aucune référence trouvée.</CommandEmpty>
            <CommandGroup>
              {references.map((reference) => (
                <CommandItem
                  key={reference.id}
                  onSelect={() => {
                    onChange(reference.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === reference.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {reference.nom}
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
              Les références
            </DialogTitle>
          </DialogHeader>
          <ListeReferences searchTerm={searchTerm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
