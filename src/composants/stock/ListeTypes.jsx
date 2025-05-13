import React, { useContext, useState } from "react";
import ListeGenerique from "./ListeGenerique";
import { UrlContext } from "@/contexte/useUrl";
import { TypeContext } from "@/contexte/useType";
import axios from "@/api/axios";
import CategorieCombobox from "./CategorieCombobox";
import { notify } from "@/utils/notify";

export default function ListeTypes({ searchTerm = "" }) {
  const { types, isLoading, getAllTypes } = useContext(TypeContext);
  const { url } = useContext(UrlContext);
  const [selectedCategorieId, setSelectedCategorieId] = useState(null);

  const handleAdd = async (data) => {
    if (!selectedCategorieId) {
      notify.error('Veuillez sélectionner une catégorie');
      // Ne pas réinitialiser les champs si la validation échoue
      throw new Error('Catégorie requise');
    }

    try {
      await axios.post(`${url}/api/types-materiels`, {
        nom: data.nom,
        categorie_id: selectedCategorieId
      });
      getAllTypes();
      setSelectedCategorieId(null);
      notify.success('Type ajouté avec succès');
      return true; // Indiquer que l'ajout a réussi
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      notify.error(error.response?.data?.message || 'Erreur lors de l\'ajout du type');
      throw error; // Propager l'erreur pour empêcher la réinitialisation
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/types-materiels/${id}`);
      getAllTypes();
      notify.success('Type supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      notify.error(error.response?.data?.message || 'Erreur lors de la suppression du type');
    }
  };

  const handleEdit = async (id, data) => {
    try {
      // Récupérer le type actuel pour avoir sa catégorie
      const currentType = types.find(type => type.id === id);
      if (!currentType) {
        notify.error('Type non trouvé');
        return;
      }

      await axios.put(`${url}/api/types-materiels/${id}`, {
        nom: data.nom,
        categorie_id: currentType.categorie_id // Garder la même catégorie
      });
      getAllTypes();
      notify.success('Type modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      notify.error(error.response?.data?.message || 'Erreur lors de la modification du type');
    }
  };

  const handleMultipleDelete = async (ids) => {
    try {
      await axios.delete(`${url}/api/types-materiels/destroy-multiple`, { data: { ids: ids } });
      getAllTypes();
      notify.success('Types supprimés avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error);
      notify.error(error.response?.data?.message || 'Erreur lors de la suppression des types');
    }
  };

  return (
    <ListeGenerique
      items={types}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onMultipleDelete={handleMultipleDelete}
      itemName="type"
      searchTerm={searchTerm}
      isLoading={isLoading}
      ExtraField={
        <CategorieCombobox
          value={selectedCategorieId}
          onChange={setSelectedCategorieId}
          showAddButton={false}
        />
      }
      onExtraFieldChange={setSelectedCategorieId}
    />
  );
}
