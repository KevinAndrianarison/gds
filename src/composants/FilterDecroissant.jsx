import React from 'react'
import { faArrowUpZA } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FilterDecroissant({ isActive = true }) {
    return (
        <FontAwesomeIcon icon={faArrowUpZA} className={`text-blue-400 p-2 text-xl rounded-md cursor-pointer ${isActive ? 'bg-gray-100' : "bg-white"}`} />
    )
}
