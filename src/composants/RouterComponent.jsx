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
        <Route path="/dashboard/gestion-de-stock" element={<GestionDeStock />} />
        <Route path="/dashboard/gestion-supply" element={<GestionSupply />} />
        <Route path="/dashboard/gestion-de-vehicule" element={<GestionDeVehicule />} />
        <Route path="/dashboard/profil" element={<Profil />} />
        <Route path="/dashboard/regions" element={<Region />} />
        <Route path="/dashboard/utilisateurs" element={<User />} />
        <Route path="/dashboard/application" element={<Application />} />
        <Route path="/dashboard" element={<Application />} />
      </Routes>
    </div>)
}
