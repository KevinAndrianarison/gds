import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { faEnvelope, faPhone, faCrown, faCircleCheck, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UserBlock({ user }) {
    return (
        <Popover>
            <PopoverTrigger>
                <div className='flex gap-2 items-center  justify-between bg-blue-50 w-68 p-5 hover:bg-blue-300/20 cursor-pointer rounded-3xl'>
                    <p className=' logoUtilisateur w-10 h-10 rounded-full'></p>
                    <div className=' text-xs w-40'>
                        <p className='font-bold text-gray-700 truncate text-left'>{user.name}</p>
                        <p className='text-blue-400 font-bold flex items-center gap-2 '>
                            {user.role === 'acl' && (
                                <FontAwesomeIcon icon={faCrown} className='text-yellow-500' />
                            )}
                            {user.role === 'user' && (
                                <FontAwesomeIcon icon={faCircleCheck} className=' text-green-500' />
                            )}
                            {user.role === 'user' ? 'Utilisateur' : 'ACL'}</p>
                        <div className='mt-4'>
                            <p className='underline truncate flex items-center gap-2 cursor-pointer hover:!text-blue-400'><FontAwesomeIcon icon={faEnvelope} />{user.email}</p>
                            <p className='  flex items-center gap-2 cursor-pointer'><FontAwesomeIcon icon={faPhone} />{user.numeros}</p>

                        </div>
                    </div>
                </div></PopoverTrigger>
            <PopoverContent className='flex flex-col w-40 text-sm  px-3 py-2'>
                <button className='text-left  cursor-pointer flex items-center py-1'><FontAwesomeIcon icon={faTrash} className='mr-2 bg-red-200 p-1 rounded-full text-red-500' />Supprimer</button>
                <button className='text-left flex items-center cursor-pointer border-t py-1'><FontAwesomeIcon icon={faPen} className='mr-2 bg-gray-200 p-1 rounded-full text-gray-500' />Modifier</button>
            </PopoverContent>
        </Popover>)
}
