import React, { useContext, useState } from 'react'
import Inputtext from './Inputtext'
import Inputpassword from './Inputpassword'
import Buttonout from './Buttonout'
import { ShowContext } from '../contexte/useShow';
import { AuthContext } from '../contexte/AuthContext';


export default function LoginComponent() {
    const { setIsConnexion, setIsForgotPassword } = useContext(ShowContext);
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function switchtoforgotpassword() {
        setIsConnexion(false)
        setIsForgotPassword(true)
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <form onSubmit={handleLogin}>
            <p className='font-medium text-lg text-gray-700 mt-4 text-center'>Bienvenue, connectez-vous !</p>
            <div className='flex flex-col gap-2 mt-4'>
                <Inputtext 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Inputpassword 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className='mt-4'>
                <Buttonout type="submit" label='CONNEXION' />
                <p onClick={switchtoforgotpassword} className="text-gray-500 cursor-pointer text-sm text-center mt-2 hover:underline hover:text-blue-400">
                    Mot de passe oublié ?
                </p>
            </div>
        </form>
    )
}
