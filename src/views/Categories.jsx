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
import { CategorieContext } from '@/contexte/useCategorie';
import AddCategorie from '@/composants/categories/AddCategorie';
import ListCategories from '@/composants/categories/ListCategories';
import InputSearch from '@/composants/InputSearch';

export default function Categories() {
  const { getAllCategories } = useContext(CategorieContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllCategories();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='w-[60vw] mx-auto'>
      <Entete titre='catégories' description='Gérez les catégories de matériels.' />
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className='my-2'>
            <ButtonAdd label='Ajouter une catégorie' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
            <AddCategorie onSuccess={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className='flex mt-8 flex-col gap-2'>
        <InputSearch 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <ListCategories searchTerm={searchTerm} />
      </div>
    </div>
  );
}
