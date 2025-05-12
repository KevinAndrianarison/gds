import React, { useContext } from "react";
import ListeGenerique from "./ListeGenerique";
import { UrlContext } from "@/contexte/useUrl";
import { TypeContext } from "@/contexte/useType";
import axios from "@/api/axios";

export default function ListeTypes({ searchTerm = "" }) {
  const { types, isLoading, getAllTypes } = useContext(TypeContext);
  const { url } = useContext(UrlContext);

  const handleAdd = async (data) => {
    await axios.post(`${url}/api/types`, data);
    getAllTypes();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${url}/api/types/${id}`);
    getAllTypes();
  };

  const handleEdit = async (id, data) => {
    await axios.put(`${url}/api/types/${id}`, data);
    getAllTypes();
  };

  const handleMultipleDelete = async (ids) => {
    await axios.delete(`${url}/api/types/destroy-multiple`, { data: { type_ids: ids } });
    getAllTypes();
  };

  return (
    <ListeGenerique
      items={types}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onMultipleDelete={handleMultipleDelete}
      itemName="type"
      searchTerm={searchTerm}
      isLoading={isLoading}
    />
  );
}
