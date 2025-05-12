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
import { CategorieContext } from "@/contexte/useCategorie"

export function CategorieCombobox({width, value, onChange}) {
  const [open, setOpen] = useState(false)
  const { categories, isLoading, getAllCategories } = useContext(CategorieContext)

  useEffect(() => {
    getAllCategories()
  }, [])

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Chargement des catégories...
      </Button>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Aucune catégorie disponible
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
            ? categories.find((categorie) => categorie.id === value)?.nom
            : "Sélectionner une catégorie"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une catégorie" className="h-9" />
          <CommandList>
            <CommandEmpty>Catégorie introuvable.</CommandEmpty>
            <CommandGroup>
              {categories.map((categorie) => (
                <CommandItem
                  key={categorie.id}
                  value={categorie.id}
                  onSelect={() => {
                    onChange(categorie.id);
                    setOpen(false);
                  }}
                >
                  {categorie.nom}
                  <Check
                    className={cn(
                      "ml-auto",
                      value && value === categorie.id ? "opacity-100" : "opacity-0"
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
