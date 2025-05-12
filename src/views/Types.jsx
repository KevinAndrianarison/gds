import React, { useContext, useEffect, useState } from 'react';
import Entete from '@/composants/Entete';
import ButtonAdd from '@/composants/ButtonAdd';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypeContext } from '@/contexte/useType';
import AddType from '@/composants/types/AddType';
import ListTypes from '@/composants/types/ListTypes';
import InputSearch from '@/composants/InputSearch';

export default function Types() {
  const { getAllTypes } = useContext(TypeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllTypes();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='w-[60vw] mx-auto'>
      <Entete titre='types' description='Gérez les types de matériels.' />
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className='my-2'>
            <ButtonAdd label='Ajouter un type' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau type</DialogTitle>
            <AddType onSuccess={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className='flex mt-8 flex-col gap-2'>
        <InputSearch 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <ListTypes searchTerm={searchTerm} />
      </div>
    </div>
  );
}
