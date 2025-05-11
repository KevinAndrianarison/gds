import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Unauthorized from './views/Unauthorized';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import GestionDeStock from './views/GestionDeStock';
import GestionSupply from './views/GestionSupply';
import GestionDeVehicule from './views/GestionDeVehicule';
import Profil from './views/Profil';
import Region from './views/Region';
import User from './views/User';
import Application from './views/Application';
import NavBar from './composants/NavBar';
import Notiflix from 'notiflix';
import 'nprogress/nprogress.css';


Notiflix.Confirm.init({
  titleColor: '#3b82f6',
  okButtonBackground: '#3b82f6',
});

Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
});

const MainLayout = ({ children }) => (
  <div className='h-[100vh]'>
    <NavBar />
    <div className='text-sm p-2 h-full'>
      {children}
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/gestion-de-stock" />} />
      <Route path="/gestion-de-stock" element={<ProtectedRoute><MainLayout><GestionDeStock /></MainLayout></ProtectedRoute>} />
      <Route path="/gestion-supply" element={<ProtectedRoute><MainLayout><GestionSupply /></MainLayout></ProtectedRoute>} />
      <Route path="/gestion-de-vehicule" element={<ProtectedRoute><MainLayout><GestionDeVehicule /></MainLayout></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><MainLayout><Profil /></MainLayout></ProtectedRoute>} />
      <Route path="/regions" element={<ProtectedRoute><MainLayout><Region /></MainLayout></ProtectedRoute>} />
      <Route path="/utilisateurs" element={<ProtectedRoute><MainLayout><User /></MainLayout></ProtectedRoute>} />
      <Route path="/application" element={<ProtectedRoute><MainLayout><Application /></MainLayout></ProtectedRoute>} />
    </Routes>
  );
}
