import React, { useContext } from 'react';
import { CategorieContext } from '@/contexte/useCategorie';
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

export default function ListCategories({ searchTerm }) {
    const { categories, deleteCategorie } = useContext(CategorieContext);

    const filteredCategories = categories.filter(categorie =>
        categorie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (categorie.description && categorie.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id) => {
        try {
            await deleteCategorie(id);
            Notify.success('Catégorie supprimée avec succès');
        } catch (error) {
            console.error(error);
            Notify.failure('Erreur lors de la suppression de la catégorie');
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
                    {filteredCategories.map((categorie) => (
                        <TableRow key={categorie.id}>
                            <TableCell>{categorie.nom}</TableCell>
                            <TableCell>{categorie.description}</TableCell>
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
                                    onClick={() => handleDelete(categorie.id)}
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
