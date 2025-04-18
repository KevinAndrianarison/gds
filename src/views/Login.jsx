import React from 'react'
import "@fontsource/nunito";
import "@fontsource/knewave";
import '../styles/Login.css'
import Inputtext from '../composants/Inputtext'
import Inputpassword from '../composants/Inputpassword'
import Buttonout from '../composants/Buttonout'



export default function Login() {
    return (
        <div className='h-[100vh] bg-gray-100 p-10'>
            <div className='flex items-center'>
                <div className='logoLogin h-20 w-20'></div>
                <h6 className='text-gray-800'> gds</h6>
            </div>
            <p className='font-medium text-lg text-gray-700'>Bienvenue, connectez-vous !</p>
            <Inputtext />
            <Inputpassword />
            <Buttonout />
            <p className="text-gray-500 cursor-pointer text-sm hover:underline hover:text-blue-400">
                Mot de passe oublié ?
            </p>
        </div>
    )
}
