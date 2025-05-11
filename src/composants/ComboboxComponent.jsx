
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
import { RegionContext } from "@/contexte/useRegion"

export function ComboboxComponent({width, value, onChange}) {
  const [open, setOpen] = useState(false)
  const { regions, isLoading, getAllRegion } = useContext(RegionContext)


  useEffect(() => {
    getAllRegion()
  }, [])

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Chargement des régions...
      </Button>
    )
  }

  if (!regions || regions.length === 0) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Aucune région disponible
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
            ? regions.find((region) => region.id === value)?.nom
            : "Sélectionne une région"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une région" className="h-9" />
          <CommandList>
            <CommandEmpty>Région introuvable.</CommandEmpty>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.id}
                  value={region.id}
                  onSelect={() => {
                    onChange(region.id);
                    setOpen(false);
                  }}
                >
                  {region.nom}
                  <Check
                    className={cn(
                      "ml-auto",
                      value && value === region.id ? "opacity-100" : "opacity-0"
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
