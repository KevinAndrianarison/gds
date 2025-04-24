import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavItem({ isOpen, setIsOpen, to, label, logoClass }) {
    return (
        <NavLink
            to={to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1 ${isOpen ? 'max-md:rounded-3xl' : ''}  ${isActive ? 'bg-blue-400 text-white' : 'border-transparent'}`
            }
        >
            <div className={`${logoClass} h-10 w-10`}></div>
            {label}
        </NavLink>
    );
}
