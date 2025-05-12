import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ButtonAdd from '@/composants/ButtonAdd';
import AddEditModal from '@/composants/common/AddEditModal';
import ListItems from '@/composants/common/ListItems';
import axios from '@/api/axios';

export default function ReferenceManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({});
  const [references, setReferences] = useState([]);

  const fields = [
    { name: 'nom', label: 'Nom', required: true },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/references', values);
      Notify.success('Référence ajoutée avec succès');
      setIsModalOpen(false);
      setValues({});
      fetchReferences();
    } catch (error) {
      Notify.failure('Erreur lors de l\'ajout de la référence');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/references/${id}`);
      Notify.success('Référence supprimée avec succès');
      fetchReferences();
    } catch (error) {
      Notify.failure('Erreur lors de la suppression de la référence');
    }
  };

  const fetchReferences = async () => {
    try {
      const response = await axios.get('/api/references');
      setReferences(response.data);
    } catch (error) {
      Notify.failure('Erreur lors du chargement des références');
    }
  };

  React.useEffect(() => {
    fetchReferences();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestion des références</h2>
        <ButtonAdd onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une référence
        </ButtonAdd>
      </div>

      <ListItems items={references} onDelete={handleDelete} />

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValues({});
        }}
        title="Ajouter une référence"
        fields={fields}
        values={values}
        onChange={(name, value) => setValues({ ...values, [name]: value })}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
