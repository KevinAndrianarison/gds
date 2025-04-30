import React from 'react'
import TitreLabel from './TitreLabel'
import InputOn from './InputOn'
import ButtonAdd from './ButtonAdd'

export default function FormRegion() {
    return (
        <div className='border-b-2 py-4 border-gray-100 flex justify-between'>
            <div className='border-r w-[75%] border-gray-100 flex'>
                <div className='flex flex-col gap-2'>
                    <TitreLabel titre='Région' />
                    <div className='flex items-center gap-2'>
                        <InputOn width="w-80" placeholder='Ecrire ici' />
                        <ButtonAdd label='AJOUTER' />
                    </div>
                </div>

            </div>
            <div className='border-l w-[25%] border-gray-100 px-4'>
                <TitreLabel titre='Nombre de région' />
                <p className='text-3xl text-gray-700'>10</p>
            </div>
        </div>)
}
