import React, { useState, useContext, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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
import { TypeContext } from "@/contexte/useType"

export function TypeCombobox({width, value, onChange}) {
  const [open, setOpen] = useState(false)
  const { types, isLoading, getAllTypes } = useContext(TypeContext)

  useEffect(() => {
    getAllTypes()
  }, [])

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Chargement des types...
      </Button>
    )
  }

  if (!types || types.length === 0) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Aucun type disponible
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
        >
          {value
            ? types.find((type) => type.id === value)?.nom
            : "Sélectionner un type"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un type" className="h-9" />
          <CommandList>
            <CommandEmpty>Type introuvable.</CommandEmpty>
            <CommandGroup>
              {types.map((type) => (
                <CommandItem
                  key={type.id}
                  value={type.id}
                  onSelect={() => {
                    onChange(type.id);
                    setOpen(false);
                  }}
                >
                  {type.nom}
                  <Check
                    className={cn(
                      "ml-auto",
                      value && value === type.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
