import React, { useContext } from 'react'
import UserBlock from './UserBlock'
import { UserContext } from '@/contexte/useUser';
import Empty from './Empty';

export default function ListUser({ searchTerm }) {
    const { isLoading, users } = useContext(UserContext);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className='uppercase text-xs font-bold mt-8'>Liste des utilisateurs</h1>
            {(!isLoading && filteredUsers.length !== 0) && (
                <div className='flex flex-wrap overflow-y-auto max-h-[50vh] gap-4 mt-4'>
                    {filteredUsers.map((user) => (
                        <UserBlock key={user.id} user={user} />
                    ))}
                </div>
            )}
            {isLoading && (
                <div className="flex flex-row gap-2 mt-4">
                    <div className="animate-pulse bg-gray-300 w-12 h-12 rounded-full"></div>
                    <div className="flex flex-col gap-2">
                        <div className="animate-pulse bg-gray-300 w-28 h-5 rounded-full"></div>
                        <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
                    </div>
                </div>
            )}
            {(!isLoading && filteredUsers.length === 0) && (
                <Empty titre='Aucun utilisateur n’a été trouvé' />
            )}
        </div>
    )
}
