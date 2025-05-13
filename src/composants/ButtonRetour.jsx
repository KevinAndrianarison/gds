import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function ButtonRetour({ onClick, label = "Retour" }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="flex items-center border rounded text-blue-500 font-bold gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
