import React from 'react';
import NavItem from './NavItem';
import '../styles/Login.css'


export default function NavMenu({ isOpen, setIsOpen }) {
    return (
        <div className={`absolute top-[68px] left-0 w-full bg-white md:static md:w-auto md:bg-transparent md:flex md:items-center md:space-x-6 ${isOpen ? 'block ' : 'hidden'} md:shadow-none`}>
            <div className={`flex flex-col flex-wrap ${isOpen ? 'max-md:border' : ''} border-0 md:flex-row sm:items-center justify-center text-xs font-bold uppercase px-6 py-4 md:p-0 md:space-y-0 md:space-x-6 space-y-4`}>
                <NavItem isOpen={isOpen} setIsOpen={setIsOpen} to="/gestion-de-stock" label="Gestion de matériel" logoClass="logoGS" />
                <NavItem isOpen={isOpen} setIsOpen={setIsOpen} to="/gestion-supply" label="Intrant" logoClass="logoGSP" />
                <NavItem isOpen={isOpen} setIsOpen={setIsOpen} to="/gestion-de-vehicule" label="Gestion de véhicule" logoClass="logoGV" />
            </div>
        </div>
    );
}
