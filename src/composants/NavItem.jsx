import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavItem({ to, label, logoClass }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1  ${isActive ? 'bg-blue-400 text-white' : 'border-transparent'}`
            }
        >
            <div className={`${logoClass} h-10 w-10`}></div>
            {label}
        </NavLink>
    );
}
