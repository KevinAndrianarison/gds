import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function ButtonAdd({ width, label, isLoad = false }) {
    return (
        <button className={`bg-yellow-500 py-2 px-4 flex items-center gap-2 text-white font-bold cursor-pointer rounded-xs ${width}`}>
            {!isLoad && (
                <FontAwesomeIcon icon={faPlus} />
            )}
            {isLoad && (
                <FontAwesomeIcon icon={faSpinner} pulse />
            )}
            {label}</button>
            )
}
