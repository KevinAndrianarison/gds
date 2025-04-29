import React from 'react'
import GestionDeStock from '../views/GestionDeStock'
import GestionSupply from '../views/GestionSupply'
import GestionDeVehicule from '../views/GestionDeVehicule'
import { Routes, Route } from 'react-router-dom';
import Profil from '@/views/Profil';
import Region from '@/views/Region';
import User from '@/views/User';
import Application from '@/views/Application';


export default function RouterView() {
  return (
    <div className='text-sm p-2 h-full'>
      <Routes>
        <Route path="/gestion-de-stock" element={<GestionDeStock />} />
        <Route path="/gestion-supply" element={<GestionSupply />} />
        <Route path="/gestion-de-vehicule" element={<GestionDeVehicule />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/regions" element={<Region />} />
        <Route path="/utilisateurs" element={<User />} />
        <Route path="/application" element={<Application />} />
      </Routes>
    </div>)
}
