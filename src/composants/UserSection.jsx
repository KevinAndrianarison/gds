import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';
import { ShowContext } from '@/contexte/useShow';

export default function UserSection({ toggleMenu, isOpen }) {
    const navigate = useNavigate();
    const { setIsConnexion, setIsLogin, setIsDash } = useContext(ShowContext);

    function goSetting() {
        navigate('/parametre');
    }

    function goProfil() {
        navigate('/profil');
    }

    function logout() {
        Notiflix.Confirm.show(
            'Déconnexion',
            'Voulez-vous vraiment vous déconnecter ?',
            'Oui',
            'Non',
            () => {
                setIsDash(false);
                setIsConnexion(true);
                setIsLogin(true);
            },
            () => { }
        );
    }

    return (
        <div className='flex flex-wrap gap-10 justify-end'>
            <div onClick={goProfil} className="flex items-center space-x-2 cursor-pointer">
                <div className="logoUser h-10 w-10"></div>
                <span className="font-medium">Jean Dupont</span>
            </div>
            <div className='flex items-center gap-4'>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-800 text-xl">
                        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
                    </button>
                </div>
                <button onClick={goSetting} className="cursor-pointer focus:outline-none">
                    <FontAwesomeIcon icon={faGear} className="text-xl" />
                </button>
                <button onClick={logout} className="cursor-pointer focus:outline-none">
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
                </button>
            </div>
        </div>
    );
}
