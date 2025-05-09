import React from 'react'
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Entete({ titre, description }) {
    return (
        <div className='border-b-2 border-gray-100 py-2'>
            <h1 className='text-3xl font-bold text-gray-700 mt-10'>Gestion des <b className='text-gray-400 uppercase'>{titre}</b></h1>
            <p className='flex items-center mt-4 gap-1 text-gray-700'><FontAwesomeIcon icon={faThumbtack} className="text-yellow-500" /> « <b>Ajouter, modifier ou supprimer</b> » {description}</p>
        </div>)
}
