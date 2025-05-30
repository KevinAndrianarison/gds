import React from 'react';
import '../styles/Login.css'
import { useNavigate } from 'react-router-dom';


export default function LogoTitle() {
    const navigate = useNavigate();

    function goGestionStock() {
        navigate('/gestion-de-stock');
    }

    return (
        <div onClick={goGestionStock} className="flex items-center cursor-pointer space-x-3 text-gray-800 text-2xl font-bold">
            <div className="logoLogin h-10 w-40"></div>
        </div>
    );
}
