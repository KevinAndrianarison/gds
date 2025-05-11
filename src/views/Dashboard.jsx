import NavBar from '@/composants/NavBar'
import React from 'react'
import Application from './Application'

export default function Dashboard() {
    return (
        <div className='h-[100vh]'>
            <NavBar />
            <div className='text-sm p-2 h-full'>
                <Application />
            </div>
        </div>
    )
}
