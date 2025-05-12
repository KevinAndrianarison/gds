import React from 'react'
import TitreLabel from '@/composants/TitreLabel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function MaterielsTable({ materiels, onDelete, onEdit }) {
  return (
    <div className="mt-6 overflow-hidden border rounded">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left"><TitreLabel titre="N°" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Catégorie" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Type" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Marque" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Caractéristiques" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="État" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Ville" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Responsable" /></th>
            <th className="px-4 py-3 text-left"><TitreLabel titre="Actions" /></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {materiels.map((materiel) => (
            <tr key={materiel.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.numero}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.categorie}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.type}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.marque}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.caracteristiques}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-3xl text-white text-xs font-medium ${
                  materiel.etat === 'Bon état' 
                    ? 'bg-green-400' 
                    : materiel.etat === 'État moyen' 
                    ? 'bg-yellow-400' 
                    : 'bg-red-400'
                }`}>
                  {materiel.etat}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.ville}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{materiel.responsable}</td>
              <td className="px-4 py-3 text-sm space-x-2">
                <button
                  onClick={() => onEdit(materiel.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button
                  onClick={() => onDelete(materiel.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
