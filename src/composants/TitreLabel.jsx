import React from 'react'

export default function TitreLabel({ titre, as: Component = 'h1' }) {
    return (
        <Component className='font-bold text-gray-900/50 uppercase text-xs'>{titre}</Component>
    )
}
