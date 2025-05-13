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
import { SourceContext } from "@/contexte/useSource";
import InputSearch from "@/composants/InputSearch";
import ListeSources from "./ListeSources";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SourceCombobox({ value, onChange, error }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sources, isLoading, getAllSources } = useContext(SourceContext);

  useEffect(() => {
    getAllSources();
  }, []);

  const selectedSource = sources.find((source) => source.id === value);

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
              : selectedSource
              ? selectedSource.nom
              : "Sélectionner une source"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une source" />
            <CommandEmpty>Aucune source trouvée.</CommandEmpty>
            <CommandGroup>
              {sources.map((source) => (
                <CommandItem
                  key={source.id}
                  onSelect={() => {
                    onChange(source.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === source.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {source.nom}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {!isLoading && (
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
            <DialogTitle className="text-sm uppercase">Les sources</DialogTitle>
          </DialogHeader>
          <ListeSources searchTerm={searchTerm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
