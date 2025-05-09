import React, { useContext } from 'react'
import '../styles/User.css'
import { NumberTicker } from "../components/magicui/number-ticker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '@/contexte/useUser';


export default function UserBlockEffectif({ role, effectif, imgClassName }) {
    const { isLoading } = useContext(UserContext);

    return (
        <div>
            <div className='bg-blue-50 w-32 flex items-center flex-col rounded-xl py-4 gap-2'>
                <div className={`${imgClassName} w-20 h-20`}></div>
                <div className='font-bold text-xs flex gap-1 items-center text-gray-700'>{role}
                    {isLoading && (
                        <FontAwesomeIcon icon={faSpinner} pulse />
                    )}
                    {!isLoading && (
                        <p> (<NumberTicker
                            value={effectif}
                        />)</p>
                    )}
                </div>
            </div>
        </div>)
}
