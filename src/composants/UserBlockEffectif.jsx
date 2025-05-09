import React from 'react'
import '../styles/User.css'

export default function UserBlockEffectif({ role, effectif, imgClassName }) {
    return (
        <div>
            <div className='bg-blue-50 w-32 flex items-center flex-col rounded-xl py-4 gap-2'>
                <div className={`${imgClassName} w-20 h-20`}></div>
                <p className='font-bold text-xs text-gray-700'>{role} ({effectif})</p>
            </div>
        </div>)
}
