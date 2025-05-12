import React, { useContext } from "react";
import ListeGenerique from "./ListeGenerique";
import { UrlContext } from "@/contexte/useUrl";
import { ReferenceContext } from "@/contexte/useReference";
import axios from "@/api/axios";

export default function ListeReferences({ searchTerm = "" }) {
  const { references, isLoading, getAllReferences } = useContext(ReferenceContext);
  const { url } = useContext(UrlContext);

  const handleAdd = async (data) => {
    await axios.post(`${url}/api/references`, data);
    getAllReferences();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${url}/api/references/${id}`);
    getAllReferences();
  };

  const handleEdit = async (id, data) => {
    await axios.put(`${url}/api/references/${id}`, data);
    getAllReferences();
  };

  const handleMultipleDelete = async (ids) => {
    await axios.delete(`${url}/api/references/destroy-multiple`, { data: { reference_ids: ids } });
    getAllReferences();
  };

  return (
    <ListeGenerique
      items={references}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onMultipleDelete={handleMultipleDelete}
      itemName="référence"
      searchTerm={searchTerm}
      isLoading={isLoading}
    />
  );
}
