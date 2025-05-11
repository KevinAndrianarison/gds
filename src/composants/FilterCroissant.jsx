import React from 'react'
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FilterCroissant({ isActive = false, onClick }) {
    return (
        <FontAwesomeIcon 
            icon={faArrowUpAZ} 
            className={`text-blue-400 p-2 text-xl rounded-md cursor-pointer ${isActive ? 'bg-gray-100' : "bg-white"}`} 
            onClick={onClick}
        />
    )
}
