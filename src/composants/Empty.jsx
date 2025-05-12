import React from 'react'
import '../styles/User.css'


export default function Empty({ titre }) {
    return (
        <div className="flex flex-col w-full items-center justify-center gap-2 mt-4">
            <p className='w-20 h-20 emptyUtilisateur'></p>
            <p className='text-sm'> {titre}</p>
        </div>)
}
