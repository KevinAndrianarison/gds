import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ButtonAdd from '@/composants/ButtonAdd';
import AddEditModal from '@/composants/common/AddEditModal';
import ListItems from '@/composants/common/ListItems';
import axios from '@/api/axios';

export default function SourceManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({});
  const [sources, setSources] = useState([]);

  const fields = [
    { name: 'nom', label: 'Nom', required: true },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/sources', values);
      Notify.success('Source ajoutée avec succès');
      setIsModalOpen(false);
      setValues({});
      fetchSources();
    } catch (error) {
      Notify.failure('Erreur lors de l\'ajout de la source');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/sources/${id}`);
      Notify.success('Source supprimée avec succès');
      fetchSources();
    } catch (error) {
      Notify.failure('Erreur lors de la suppression de la source');
    }
  };

  const fetchSources = async () => {
    try {
      const response = await axios.get('/api/sources');
      setSources(response.data);
    } catch (error) {
      Notify.failure('Erreur lors du chargement des sources');
    }
  };

  React.useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestion des sources</h2>
        <ButtonAdd onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une source
        </ButtonAdd>
      </div>

      <ListItems items={sources} onDelete={handleDelete} />

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValues({});
        }}
        title="Ajouter une source"
        fields={fields}
        values={values}
        onChange={(name, value) => setValues({ ...values, [name]: value })}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
