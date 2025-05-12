import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ButtonAdd from '@/composants/ButtonAdd';
import AddEditModal from '@/composants/common/AddEditModal';
import ListItems from '@/composants/common/ListItems';
import axios from '@/api/axios';

export default function CategorieManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({});
  const [categories, setCategories] = useState([]);

  const fields = [
    { name: 'nom', label: 'Nom', required: true },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/categories', values);
      Notify.success('Catégorie ajoutée avec succès');
      setIsModalOpen(false);
      setValues({});
      fetchCategories();
    } catch (error) {
      Notify.failure('Erreur lors de l\'ajout de la catégorie');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      Notify.success('Catégorie supprimée avec succès');
      fetchCategories();
    } catch (error) {
      Notify.failure('Erreur lors de la suppression de la catégorie');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      Notify.failure('Erreur lors du chargement des catégories');
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestion des catégories</h2>
        <ButtonAdd onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une catégorie
        </ButtonAdd>
      </div>

      <ListItems items={categories} onDelete={handleDelete} />

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValues({});
        }}
        title="Ajouter une catégorie"
        fields={fields}
        values={values}
        onChange={(name, value) => setValues({ ...values, [name]: value })}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
