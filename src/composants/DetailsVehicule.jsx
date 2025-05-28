import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import { useContext, useEffect, useState } from "react";
import TitreLabel from '@/composants/TitreLabel'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import Notiflix from 'notiflix'
import NProgress from 'nprogress'

function DetailsVehiculeContent() {
  const navigate = useNavigate();
  const { oneVehicule, getOneUtilisation, isLoadingUtilisation } =
    useMateriel();
  const { id } = useParams();
  const [editingUtilisationId, setEditingUtilisationId] = useState(null);
  const [editedUtilisation, setEditedUtilisation] = useState({});
  const [originalUtilisation, setOriginalUtilisation] = useState({});

  useEffect(() => {
    getOneUtilisation(id);
  }, [id]);

  const handleEditUtilisation = (utilisation) => {
    setEditingUtilisationId(utilisation.id);
    setEditedUtilisation({ ...utilisation });
    setOriginalUtilisation({ ...utilisation });
  };

  const handleDeleteUtilisation = (id) => {
    Notiflix.Confirm.show(
      'Confirmation de suppression',
      'Êtes-vous sûr de vouloir supprimer cette utilisation ?',
      'Oui',
      'Non',
      async () => {
        try {
          NProgress.start();
          // TODO: Implement delete functionality
          // await deleteUtilisation(id);
        } catch (error) {
          Notiflix.Notify.warning('Erreur lors de la suppression');
        } finally {
          NProgress.done();
        }
      }
    );
  };

  const handleSaveUtilisation = async (id, field, value) => {
    try {
      const newValue = value || editedUtilisation[field];
      const hasChanged =
        newValue !== originalUtilisation[field] &&
        newValue !== null &&
        newValue !== '';

      if (hasChanged) {
        const updateData = { [field]: newValue };
        
        // Calculate total_km if km_depart or km_arrivee changes
        if (field === 'km_depart' || field === 'km_arrivee') {
          const km_depart = field === 'km_depart' ? newValue : editedUtilisation.km_depart;
          const km_arrivee = field === 'km_arrivee' ? newValue : editedUtilisation.km_arrivee;
          if (km_depart && km_arrivee) {
            updateData.total_km = km_arrivee - km_depart;
          }
        }

        // Calculate montant if pu_ariary or qtt_litre changes
        if (field === 'pu_ariary' || field === 'qtt_litre') {
          const pu_ariary = field === 'pu_ariary' ? newValue : editedUtilisation.pu_ariary;
          const qtt_litre = field === 'qtt_litre' ? newValue : editedUtilisation.qtt_litre;
          if (pu_ariary && qtt_litre) {
            updateData.montant = pu_ariary * qtt_litre;
          }
        }

        // TODO: Implement update functionality
        // await updateUtilisation(id, updateData);
        
        setOriginalUtilisation(prev => ({
          ...prev,
          [field]: editedUtilisation[field],
          ...(updateData.total_km && { total_km: updateData.total_km }),
          ...(updateData.montant && { montant: updateData.montant })
        }));
      }
    } catch (error) {
      Notiflix.Notify.warning('Erreur lors de la mise à jour');
      setEditedUtilisation(prev => ({
        ...prev,
        [field]: originalUtilisation[field]
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUtilisation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-[80vw] mx-auto my-10">
      <button
        className=" border-2 cursor-pointer border-blue-500  flex items-center gap-2 text-blue-500 font-bold px-4 py-2 rounded-3xl"
        onClick={() => navigate("/gestion-de-vehicule")}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Retour
      </button>
      <div className="text-2xl flex gap-2 items-center font-bold text-gray-700 my-4">
        <p>Detail sur l'utilisation de :</p>
        {isLoadingUtilisation ? (
          <div className="h-6 bg-gray-200 w-20 rounded animate-pulse"></div>
        ) : (
          <div>
            <p className="uppercase text-gray-400">{oneVehicule?.type?.nom}</p>
            <b>{oneVehicule?.caracteristiques}</b>
          </div>
        )}
      </div>
      <div className="mt-4 overflow-x-auto border border-gray-200 rounded max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Date" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Chef missionnaire" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Lieu" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Activité" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Carburant" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Immatriculation" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Km départ" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Km arrivée" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Total Km" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Qté litre" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="PU (Ar)" /></th>
              <th className="px-6 py-4 text-left min-w-[150px]"><TitreLabel titre="Montant" /></th>
              <th className="px-4 py-3 text-center"><TitreLabel titre="Actions" /></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoadingUtilisation ? (
              <tr>
                <td colSpan="13" className="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} className="text-gray-500 text-2xl" spinPulse />
                </td>
              </tr>
            ) : !oneVehicule?.utilisations?.length ? (
              <tr>
                <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
                  Aucune utilisation enregistrée
                </td>
              </tr>
            ) : (
              oneVehicule.utilisations.map((utilisation) => (
                <tr key={utilisation.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{utilisation.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{utilisation.chef_missionnaire}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.lieu || ''}
                        onChange={(e) => handleInputChange('lieu', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'lieu')}
                      />
                    ) : (
                      utilisation.lieu
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{utilisation.activite}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.carburant || ''}
                        onChange={(e) => handleInputChange('carburant', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'carburant')}
                      />
                    ) : (
                      utilisation.carburant
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.immatriculation || ''}
                        onChange={(e) => handleInputChange('immatriculation', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'immatriculation')}
                      />
                    ) : (
                      utilisation.immatriculation
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.km_depart || ''}
                        onChange={(e) => handleInputChange('km_depart', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'km_depart')}
                      />
                    ) : (
                      utilisation.km_depart
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.km_arrivee || ''}
                        onChange={(e) => handleInputChange('km_arrivee', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'km_arrivee')}
                      />
                    ) : (
                      utilisation.km_arrivee
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{utilisation.total_km}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.qtt_litre || ''}
                        onChange={(e) => handleInputChange('qtt_litre', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'qtt_litre')}
                      />
                    ) : (
                      utilisation.qtt_litre
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.pu_ariary || ''}
                        onChange={(e) => handleInputChange('pu_ariary', e.target.value)}
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() => handleSaveUtilisation(utilisation.id, 'pu_ariary')}
                      />
                    ) : (
                      utilisation.pu_ariary
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">{utilisation.montant}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 justify-center">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-500 bg-red-200 p-2 rounded-full cursor-pointer"
                        onClick={() => handleDeleteUtilisation(utilisation.id)}
                      />
                      {editingUtilisationId !== utilisation.id && (
                        <FontAwesomeIcon
                          icon={faPen}
                          className="text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer"
                          onClick={() => handleEditUtilisation(utilisation)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DetailsVehicule() {
  return (
    <MaterielContextProvider>
      <DetailsVehiculeContent />
    </MaterielContextProvider>
  );
}
