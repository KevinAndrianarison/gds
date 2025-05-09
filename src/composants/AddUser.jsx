import React from 'react'
import TitreLabel from './TitreLabel'
import InputOn from './InputOn'
import SelectComponent from './SelectComponent'
import { ComboboxComponent } from './ComboboxComponent'
import ButtonAdd from './ButtonAdd'


export default function AddUser() {
    return (
        <div>
            <div className='flex justify-between gap-2 flex-wrap'>
                <div className='flex flex-col gap-2 mt-4'>
                    <TitreLabel titre='Rôle' />
                    <SelectComponent width="w-52" />
                </div>
                <div className='flex flex-col gap-2 mt-4'>
                    <TitreLabel titre='Région' />
                    <ComboboxComponent width="w-52" />
                </div>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Nom comlet' />
                <InputOn width="w-full" />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Adresse email' />
                <InputOn width="w-full" />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Contact téléphonique' />
                <InputOn type='number' width="w-full" />
            </div>
            <div className='mt-4 flex justify-end'>
                <ButtonAdd label='ENREGISTRER' />
            </div>
        </div>
    )
}
