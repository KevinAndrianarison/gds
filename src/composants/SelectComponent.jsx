import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default function SelectComponent({width}) {
    return (
        <Select>
            <SelectTrigger className={`focus:outline-none border-2 border-blue-200 rounded p-2 ${width}`}
            >
                <SelectValue placeholder="Choisissez ici" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="acl">ACL</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
            </SelectContent>
        </Select>
    )
}
