import ButtonAdd from '@/composants/ButtonAdd'
import Effectifs from '@/composants/Effectifs'
import Entete from '@/composants/Entete'
import InputSearch from '@/composants/InputSearch'
import React from 'react'
import ListUser from '@/composants/ListUser'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddUser from '@/composants/AddUser'



export default function User() {
  return (
    <div className=' w-[60vw] mx-auto'>
      <Entete titre='utilisateurs' description='les utilisateurs de votre entreprise.' />
      <Dialog>
        <DialogTrigger >
          <div className='my-2'>
            <ButtonAdd label='Ajouter un utilisateur' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau utilisateur</DialogTitle>
            <AddUser />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      < Effectifs />
      <div className='flex mt-8 flex-col gap-2'>
        <InputSearch />
        <ListUser />
      </div>
    </div>
  )
}
