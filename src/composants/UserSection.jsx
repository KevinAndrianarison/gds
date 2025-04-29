import React, { useContext, useState } from 'react';
import { faGear, faRightFromBracket, faBars, faXmark, faGlobe, faUsers, faCircleUser, faScrewdriverWrench, faComputer, faFolderTree } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';
import { ShowContext } from '@/contexte/useShow';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideMenuLink from './SideMenuLink';

export default function UserSection({ toggleMenu, isOpen }) {
    const navigate = useNavigate();
    const { setIsConnexion, setIsLogin, setIsDash } = useContext(ShowContext);
    const [sheetOpen, setSheetOpen] = useState(false);

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
                        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className={isOpen ? 'max-md:text-gray-500 max-md:bg-gray-200 max-md:rounded-full max-md:py-0.5 max-md:px-1' : ''} />
                    </button>
                </div>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <button className="cursor-pointer focus:outline-none">
                            <FontAwesomeIcon icon={faGear} className="text-xl" />
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                <div className=' flex justify-center items-center'>
                                    <div className="logoLogin h-10 w-10"></div>
                                    <h5 className="hidden md:inline text-gray-800 text-md">gds</h5>
                                </div>
                                <p className='mt-2 text-xs border-b py-2'><FontAwesomeIcon icon={faFolderTree} /> GESTION DES :</p>
                                <div className='mt-2 font-light text-md flex flex-col gap-1'>
                                    <SideMenuLink to="/regions" icon={faGlobe} onClick={() => setSheetOpen(false)}>Régions</SideMenuLink>
                                    <SideMenuLink to="/utilisateurs" icon={faUsers} onClick={() => setSheetOpen(false)}>Utilisateurs</SideMenuLink>
                                </div>
                                <p className='mt-4 text-xs border-b py-2'><FontAwesomeIcon icon={faScrewdriverWrench} /> CONFIGURATION :</p>
                                <div className='mt-2 font-light text-md flex flex-col gap-1'>
                                    <SideMenuLink to="/profil" icon={faCircleUser} onClick={() => setSheetOpen(false)}>Profil</SideMenuLink>
                                    <SideMenuLink to="/application" icon={faComputer} onClick={() => setSheetOpen(false)}>Application</SideMenuLink>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <button onClick={logout} className="cursor-pointer focus:outline-none">
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
                </button>
            </div>
        </div>
    );
}
