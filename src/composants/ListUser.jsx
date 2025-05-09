import React from 'react'
import UserBlock from './UserBlock'

export default function ListUser() {
    return (
        <div>
            <h1 className='uppercase text-xs font-bold mt-8'>Liste des utilisateurs</h1>
            <div className='flex flex-wrap overflow-y-auto max-h-[50vh] gap-4 mt-4'>
                <UserBlock />
                <UserBlock />
            </div>
            <div class="flex flex-row gap-2 mt-4">
                <div class="animate-pulse bg-gray-300 w-12 h-12 rounded-full"></div>
                <div class="flex flex-col gap-2">
                    <div class="animate-pulse bg-gray-300 w-28 h-5 rounded-full"></div>
                    <div class="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
                </div>
            </div>
        </div>)
}
