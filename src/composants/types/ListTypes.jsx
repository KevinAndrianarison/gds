import React, { useContext } from 'react';
import { TypeContext } from '@/contexte/useType';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Notify } from 'notiflix';

export default function ListTypes({ searchTerm }) {
    const { types, deleteType } = useContext(TypeContext);

    const filteredTypes = types.filter(type =>
        type.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id) => {
        try {
            await deleteType(id);
            Notify.success('Type supprimé avec succès');
        } catch (error) {
            console.error(error);
            Notify.failure('Erreur lors de la suppression du type');
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTypes.map((type) => (
                        <TableRow key={type.id}>
                            <TableCell>{type.nom}</TableCell>
                            <TableCell>{type.description}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {/* TODO: Implement edit */}}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(type.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
