import React, { useState, useContext, useEffect } from 'react';
import TitreLabel from './TitreLabel';
import InputOn from './InputOn';
import SelectComponent from './SelectComponent';
import { ComboboxComponent } from './ComboboxComponent';
import ButtonAdd from './ButtonAdd';
import Notiflix from 'notiflix';
import axios from 'axios';
import nProgress from 'nprogress';
import { UrlContext } from '@/contexte/useUrl';
import { UserContext } from '@/contexte/useUser';

export default function AddUser({ onSuccess }) {
    const [role, setRole] = useState('');
    const [region, setRegion] = useState('');
    const [nomComplet, setNomComplet] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [isPost, setIsPost] = useState(false);
    const { url } = useContext(UrlContext);
    const { getAlluser } = useContext(UserContext);

    useEffect(() => {
    }, [region]);

    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const resetForm = () => {
        setRole('');
        setRegion('');
        setNomComplet('');
        setEmail('');
        setContact('');
    };

const handleSubmit = () => {
    if (!role || !nomComplet || !email || !contact) {
        Notiflix.Notify.warning('Veuillez remplir tous les champs.');
        return;
    }

    if (role === 'acl' && !region) {
        Notiflix.Notify.warning('Veuillez sélectionner une région.');
        return;
    }

    const formData = {
        role,
        name: nomComplet,
        email,
        numeros: Number(contact),
        ...(role === 'acl' && { region_id: region }),
        ...(role !== 'user' && { password: generateRandomString(10) })
    };
    

    nProgress.start();
    setIsPost(true);
    axios
        .post(`${url}/api/register`, formData)
        .then(() => {
            getAlluser();
            Notiflix.Report.success(
                'Succès',
                'Utilisateur enregistré avec succès!',
                'OK'
            );
        })
        .catch((err) => {
            console.error(err);
            Notiflix.Report.failure(
                'Erreur',
                'Erreur lors de l\'enregistrement de l\'utilisateur.',
                'OK'
            );
        })
        .finally(() => {
            setIsPost(false);
            resetForm();
            onSuccess();
            nProgress.done();
        });
};



    return (
        <div>
            <div className='flex justify-between gap-2 flex-wrap'>
                <div className='flex flex-col gap-2 mt-4'>
                    <TitreLabel titre='Rôle' />
                    <SelectComponent width="w-52" value={role} onChange={setRole} />
                </div>
                {role === 'acl' && (
                    <div className='flex flex-col gap-2 mt-4'>
                        <TitreLabel titre='Région' />
                        <ComboboxComponent 
                            width="w-52" 
                            onChange={setRegion} 
                            value={region}
                        />
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Nom complet' />
                <InputOn width="w-full" value={nomComplet} onChange={setNomComplet} />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Adresse email' />
                <InputOn width="w-full" value={email} onChange={setEmail} />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <TitreLabel titre='Contact téléphonique' />
                <InputOn type='number' width="w-full" value={contact} onChange={setContact} />
            </div>
            <div className='mt-4 flex justify-end'>
                <ButtonAdd isLoad={isPost} label='ENREGISTRER' onClick={handleSubmit} />
            </div>
        </div>
    );
}
