import React, { useContext } from 'react'
import "@fontsource/nunito";
import "@fontsource/knewave";
import '../styles/Login.css'
import { ShowContext } from '../contexte/useShow';
import LoginComponent from '@/composants/LoginComponent';
import ForgotPassword from '@/composants/ForgotPassword';



export default function Login() {
    const { isConnexion, isForgotPassword } = useContext(ShowContext);

    return (
        <div className='h-[100vh]  flex items-center justify-center bg-gray-100 p-10'>
            <div className='bg-white max-sm:w-[400px] rounded-3xl p-16 py-10 flex flex-col items-center'>
                <div className='flex items-center'>
                    <div className='logoLogin h-20 w-20'></div>
                    <h6 className='text-gray-800'> gds</h6>
                </div>
                {isConnexion && (
                    <LoginComponent />
                )}
                {isForgotPassword && (
                    <ForgotPassword />
                )}
            </div>
        </div>
    )
}
