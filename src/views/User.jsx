import ButtonAdd from '@/composants/ButtonAdd';
import Effectifs from '@/composants/Effectifs';
import Entete from '@/composants/Entete';
import InputSearch from '@/composants/InputSearch';
import React, { useContext, useEffect, useState } from 'react';
import ListUser from '@/composants/ListUser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddUser from '@/composants/AddUser';
import { UserContext } from '@/contexte/useUser';

export default function User() {
  const { getAlluser, isModalOpen, setIsModalOpen, closeModal } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAlluser();
  }, []);

  return (
    <div className='w-[60vw] mx-auto'>
      <Entete titre='utilisateurs' description='les utilisateurs de votre entreprise.' />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className='my-2'>
            <ButtonAdd label='Ajouter un utilisateur' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau utilisateur</DialogTitle>
            <AddUser onSuccess={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Effectifs />
      <div className='flex mt-8 flex-col gap-2'>
        <InputSearch value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <ListUser searchTerm={searchTerm} />
      </div>
    </div>
  );
}
