import React, { useState, useContext } from 'react';
import TitreLabel from '../TitreLabel';
import InputOn from '../InputOn';
import ButtonAdd from '../ButtonAdd';
import { Notify } from 'notiflix';
import { TypeContext } from '@/contexte/useType';

export default function AddType({ onSuccess }) {
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addType } = useContext(TypeContext);

    const handleSubmit = async () => {
        if (!nom.trim()) {
            Notify.warning('Le nom du type est requis');
            return;
        }

        setIsSubmitting(true);
        try {
            await addType({ nom, description });
            Notify.success('Type ajouté avec succès');
            onSuccess?.();
        } catch (error) {
            console.error(error);
            Notify.failure('Erreur lors de l\'ajout du type');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Nom' required />
                <InputOn
                    width="w-full"
                    value={nom}
                    onChange={setNom}
                />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Description' />
                <InputOn
                    width="w-full"
                    value={description}
                    onChange={setDescription}
                />
            </div>
            <div className='mt-4 flex justify-end'>
                <ButtonAdd
                    isLoad={isSubmitting}
                    label='ENREGISTRER'
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
