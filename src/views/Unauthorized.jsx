import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600">
            Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour
        </Button>
      </div>
    </div>
  );
}
