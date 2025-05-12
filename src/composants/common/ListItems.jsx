import React from 'react';
import { Trash2 } from 'lucide-react';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';

export default function ListItems({ items, onDelete }) {
  const handleDelete = (id) => {
    Confirm.show(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cet élément ?',
      'Oui',
      'Non',
      () => onDelete(id),
      () => {},
      {
        titleColor: '#3b82f6',
        okButtonBackground: '#3b82f6',
      }
    );
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
        >
          <span>{item.nom}</span>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
