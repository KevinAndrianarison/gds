import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function InputSearch({ width = "w-80", value, onChange }) {
    return (
        <div className={`flex items-center border-2 border-blue-200 rounded-3xl px-3 py-2 ${width} bg-white`}>
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
            <input
                type="search"
                className="outline-none w-full text-sm"
                placeholder="Rechercher"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
