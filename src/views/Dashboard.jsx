import NavBar from '@/composants/NavBar'
import RouterComponent from '@/composants/RouterComponent'
import React from 'react'


export default function Dashboard() {
    return (
        <div className='h-[100vh]'>
            <NavBar />
            <RouterComponent/>
        </div>
    )
}
