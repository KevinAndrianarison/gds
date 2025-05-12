import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputOn from "@/composants/InputOn";
import TitreLabel from "@/composants/TitreLabel";
import ButtonAdd from "@/composants/ButtonAdd";

export default function AddEditModal({ 
  isOpen, 
  onClose, 
  title, 
  fields, 
  values, 
  onChange, 
  onSubmit, 
  isSubmitting 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <TitreLabel titre={field.label} required={field.required} />
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full p-2 border-2 border-blue-200 rounded focus:outline-none"
                  value={values[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  rows={4}
                />
              ) : (
                <InputOn
                  width="w-full"
                  value={values[field.name] || ''}
                  onChange={(value) => onChange(field.name, value)}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <ButtonAdd
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Enregistrer
            </ButtonAdd>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
