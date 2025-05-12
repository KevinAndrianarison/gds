import React from 'react'

export default function TitreLabel({ titre, as: Component = 'h1', required }) {
    return (
        <Component className='font-bold text-gray-900/50 uppercase text-xs'>
            {titre}
            {required && <span className="text-red-500 ml-1">*</span>}
        </Component>
    )
}
