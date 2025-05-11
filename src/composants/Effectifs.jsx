import React, { useContext, useEffect } from 'react'
import UserBlockEffectif from './UserBlockEffectif'
import { UserContext } from '@/contexte/useUser'

export default function Effectifs() {
    const { users, getAlluser } = useContext(UserContext);

    useEffect(() => {
        getAlluser();
    }, []);

    const aclCount = users ? users.filter(user => user.role === 'acl').length : 0;
    const userCount = users ? users.filter(user => user.role === 'user').length : 0;

    return (
        <div>
            <h1 className='uppercase text-xs font-bold mt-8'>Effectifs</h1>
            <div className='flex flex-wrap gap-4 mt-4'>
                <UserBlockEffectif role='ACL(s)' effectif={aclCount} imgClassName='logoACL' />
                <UserBlockEffectif role='Utilisateurs' effectif={userCount} imgClassName='logoUtilisateur' />
            </div>
        </div>)
}
