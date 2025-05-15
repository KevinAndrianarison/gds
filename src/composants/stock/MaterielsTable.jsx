import React, { useState, useContext } from 'react'
import TitreLabel from '@/composants/TitreLabel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import { MaterielContext } from '@/contexte/useMateriel'
import Notiflix from 'notiflix'
import NProgress from 'nprogress'

export default function   MaterielsTable({ materiels }) {
  const { deleteMateriel, updateMateriel } = useContext(MaterielContext);
  const [editingMaterielId, setEditingMaterielId] = useState(null);
  const [editedMateriel, setEditedMateriel] = useState({});
  const [originalMateriel, setOriginalMateriel] = useState({});

  const handleEditMateriel = (materiel) => {
    setEditingMaterielId(materiel.id);
    setEditedMateriel({ ...materiel });
    setOriginalMateriel({ ...materiel });
  };

  const handleDeleteMateriel = (id) => {
    Notiflix.Confirm.show(
      'Confirmation de suppression',
      'Êtes-vous sûr de vouloir supprimer ce matériel ?',
      'Oui',
      'Non',
      async () => {
        try {
          NProgress.start();
          await deleteMateriel(id);
        } catch (error) {
          Notiflix.Notify.warning('Erreur lors de la suppression du matériel');
        } finally {
          NProgress.done();
        }
      }
    );
  };

  const handleSaveMateriel = async (id, field) => {
    try {
      const hasChanged = 
        editedMateriel[field] !== originalMateriel[field] && 
        editedMateriel[field] !== null && 
        editedMateriel[field] !== '';

      if (hasChanged) {
        const updateData = { [field]: editedMateriel[field] };
        await updateMateriel(id, updateData);
        
        // Mettre à jour l'original avec la nouvelle valeur
        setOriginalMateriel(prev => ({
          ...prev,
          [field]: editedMateriel[field]
        }));
      }
    } catch (error) {
      Notiflix.Notify.warning('Erreur lors de la mise à jour');
      // Restaurer la valeur originale
      setEditedMateriel(prev => ({
        ...prev,
        [field]: originalMateriel[field]
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedMateriel(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <div className="mt-6 overflow-x-auto border border-gray-200 rounded">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 whitespace-nowrap">
          <tr>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="N°" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Catégorie" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Type" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Marque" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Caractéristiques" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="État" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Montant (Ar)" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="N° Série" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="N° IMEI" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Région" /></th>
            <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Responsable" /></th>
            <th className="px-4 py-3 text-center"><TitreLabel titre="Actions" /></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y cursor-pointer divide-gray-200">
          {materiels.map((materiel) => (
            <tr key={materiel.id}>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, 'numero')}
                    autoFocus
                  />
                ) : (
                  materiel.numero
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{materiel.categorie?.nom || '...'}</td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{materiel.type?.nom || '...'}</td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.marque || ''}
                    onChange={(e) => handleInputChange('marque', e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, 'marque')}
                  />
                ) : (
                  materiel.marque || '...'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.caracteristiques || ''}
                    onChange={(e) => handleInputChange('caracteristiques', e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, 'caracteristiques')}
                  />
                ) : (
                  materiel.caracteristiques || '...'
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-3xl text-white text-xs font-medium ${
                  materiel.etat === 'Bon état' 
                    ? 'bg-green-400' 
                    : materiel.etat === 'État moyen' 
                    ? 'bg-yellow-400' 
                    : materiel.etat === 'Mauvais état' 
                    ? 'bg-red-400' 
                    : 'bg-gray-400'
                }`}>
                  {materiel.etat}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="number"
                    value={editedMateriel.montant || ''}
                    onChange={(e) => handleInputChange('montant', e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, 'montant')}
                  />
                ) : (
                  materiel.montant || '...'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.numero_serie || ''}
                    onChange={(e) => handleInputChange('numero_serie', e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, 'numero_serie')}
                  />
                ) : (
                  materiel.numero_serie || '...'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                {editingMaterielId === materiel.id ? (
                  <input
                    type="text"
                    value={editedMateriel.numero_imei || ''}
                    onChange={(e) => handleInputChange('numero_imei', e.target.value)}
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveMateriel(materiel.id, 'numero_imei')}
                  />
                ) : (
                  materiel.numero_imei || '...'
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{materiel.region?.nom || '...'}</td>
              <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{materiel.responsable?.name || 'Non assigné'}</td>
              <td className="px-4 py-3 text-sm flex items-center justify-center">
                <div className="flex items-center gap-2 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 bg-red-200 p-2 rounded-full cursor-pointer"
                    onClick={() => handleDeleteMateriel(materiel.id)}
                  />
                  {editingMaterielId !== materiel.id && (
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer"
                      onClick={() => handleEditMateriel(materiel)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
