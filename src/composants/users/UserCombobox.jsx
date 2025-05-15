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
import { UserContext } from "@/contexte/useUser"

export default function UserCombobox({width, value, onChange}) {
  const [open, setOpen] = useState(false)
  const { users, isLoading, getAlluser } = useContext(UserContext)

  useEffect(() => {
    getAlluser()
  }, [])

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Chargement des responsables...
      </Button>
    )
  }

  if (!users || users.length === 0) {
    return (
      <Button
        variant="outline"
        className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
      >
        Aucun responsable disponible
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
          className={`focus:outline-none border-2 border-blue-200 rounded p-2 truncate ${width}`}
        >
          {value
            ? users.find((user) => user.id === value)?.name
            : "Sélectionner ici"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un responsable" className="h-9" />
          <CommandList>
            <CommandEmpty>Responsable introuvable.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    onChange(user.id);
                    setOpen(false);
                  }}
                >
                  {user.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value && value === user.id ? "opacity-100" : "opacity-0"
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
