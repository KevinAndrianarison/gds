import React, { useContext } from 'react'
import Buttonout from './Buttonout'
import InputemailForgot from './InputemailForgot'
import ButtonBackout from './ButtonBackout'
import { ShowContext } from '../contexte/useShow';


export default function ForgotPassword() {
    const { setIsConnexion, setIsForgotPassword } = useContext(ShowContext);

    function backTologin() {
        setIsForgotPassword(false)
        setIsConnexion(true)
    }
    return (
        <div className='mt-10'>
            <p className='font-medium text-sm text-gray-700 mt-4 text-center max-sm:w-[350px] mx-auto w-[400px]'>Veuillez entrer votre adresse e-mail afin que nous puissions vous envoyer un lien pour réinitialiser votre mot de passe</p>
            <div className='flex flex-col  gap-2 mt-4'>
                <InputemailForgot />
            </div>
            <div className='mt-4 gap-2 flex flex-wrap justify-center'>
                <Buttonout label='ENVOYER' />
                <ButtonBackout back={backTologin} />
            </div>
        </div>)
}
