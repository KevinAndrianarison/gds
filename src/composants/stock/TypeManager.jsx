import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ButtonAdd from '@/composants/ButtonAdd';
import AddEditModal from '@/composants/common/AddEditModal';
import ListItems from '@/composants/common/ListItems';
import axios from '@/api/axios';

export default function TypeManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({});
  const [types, setTypes] = useState([]);

  const fields = [
    { name: 'nom', label: 'Nom', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/types', values);
      Notify.success('Type ajouté avec succès');
      setIsModalOpen(false);
      setValues({});
      fetchTypes();
    } catch (error) {
      Notify.failure('Erreur lors de l\'ajout du type');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/types/${id}`);
      Notify.success('Type supprimé avec succès');
      fetchTypes();
    } catch (error) {
      Notify.failure('Erreur lors de la suppression du type');
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get('/api/types');
      setTypes(response.data);
    } catch (error) {
      Notify.failure('Erreur lors du chargement des types');
    }
  };

  React.useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestion des types</h2>
        <ButtonAdd onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un type
        </ButtonAdd>
      </div>

      <ListItems items={types} onDelete={handleDelete} />

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValues({});
        }}
        title="Ajouter un type"
        fields={fields}
        values={values}
        onChange={(name, value) => setValues({ ...values, [name]: value })}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
