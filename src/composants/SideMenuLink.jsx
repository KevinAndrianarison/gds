import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideMenuLink({ to, icon, children, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-2 rounded cursor-pointer
                hover:bg-blue-100
                ${isActive ? 'bg-blue-100 text-blue-500 font-medium' : 'text-gray-500'}`
            }
        >
            <FontAwesomeIcon icon={icon} />
            {children}
        </NavLink>
    );
}
