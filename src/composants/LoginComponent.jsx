import React, { useContext } from 'react'
import Inputtext from './Inputtext'
import Inputpassword from './Inputpassword'
import Buttonout from './Buttonout'
import { ShowContext } from '../contexte/useShow';


export default function LoginComponent() {
    const { setIsConnexion, setIsForgotPassword, setIsLogin, setIsSpinnerView } = useContext(ShowContext);

    function switchtoforgotpassword() {
        setIsConnexion(false)
        setIsForgotPassword(true)
    }

    return (
        <div>
            <p className='font-medium text-lg text-gray-700 mt-4 text-center'>Bienvenue, connectez-vous !</p>
            <div className='flex flex-col gap-2 mt-4'>
                <Inputtext />
                <Inputpassword />
            </div>
            <div className='mt-4'>
                <Buttonout label='CONNEXION' onClick={() => {
                    setIsSpinnerView(true)
                    setIsLogin(false)
                }} />
                <p onClick={switchtoforgotpassword} className="text-gray-500 cursor-pointer text-sm text-center mt-2 hover:underline hover:text-blue-400">
                    Mot de passe oublié ?
                </p>
            </div>
        </div>
    )
}
