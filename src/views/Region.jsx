import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';


export default function Region() {
  return (
    <div className=' w-[60vw] mx-auto'>
      <div className='border-b py-2'>
        <h1 className='text-3xl font-bold text-gray-700 mt-10'>Gestion des <b className='text-gray-400 uppercase'>région</b></h1>
        <p className='flex items-center gap-1 text-gray-700'><FontAwesomeIcon icon={faThumbtack} className="text-yellow-500" /> « <b>Ajouter, modifier ou supprimer</b> » les régions où se trouvent vos bureaux.</p>
      </div>
    </div>
  )
}
