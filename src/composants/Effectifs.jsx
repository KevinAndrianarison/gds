import React from 'react'
import UserBlockEffectif from './UserBlockEffectif'

export default function Effectifs() {
    return (
        <div>
            <h1 className='uppercase text-xs font-bold mt-8'>Effectifs</h1>
            <div className='flex flex-wrap gap-4 mt-4'>
                <UserBlockEffectif role='ACL(s)' effectif={2} imgClassName='logoACL' />
                <UserBlockEffectif role='Utilisateurs' effectif={10} imgClassName='logoUtilisateur' />
            </div>
        </div>)
}
