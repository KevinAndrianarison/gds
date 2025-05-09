import ButtonAdd from '@/composants/ButtonAdd'
import Effectifs from '@/composants/Effectifs'
import Entete from '@/composants/Entete'
import InputSearch from '@/composants/InputSearch'
import React from 'react'
import ListUser from '@/composants/ListUser'



export default function User() {
  return (
    <div className=' w-[60vw] mx-auto'>
      <Entete titre='utilisateurs' description='les utilisateurs de votre entreprise.' />
      <div className='my-2'>
        <ButtonAdd label='Ajouter un utilisateur' />
      </div>
      < Effectifs />
      <div className='flex mt-8 flex-col gap-2'>
        <InputSearch />
        <ListUser />
      </div>
    </div>
  )
}
