import React, { useContext } from "react";
import ListeGenerique from "./ListeGenerique";
import { UrlContext } from "@/contexte/useUrl";
import { SourceContext } from "@/contexte/useSource";
import axios from "@/api/axios";

export default function ListeSources({ searchTerm = "" }) {
  const { sources, isLoading, getAllSources } = useContext(SourceContext);
  const { url } = useContext(UrlContext);

  const handleAdd = async (data) => {
    await axios.post(`${url}/api/sources`, data);
    getAllSources();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${url}/api/sources/${id}`);
    getAllSources();
  };

  const handleEdit = async (id, data) => {
    await axios.put(`${url}/api/sources/${id}`, data);
    getAllSources();
  };

  const handleMultipleDelete = async (ids) => {
    await axios.delete(`${url}/api/sources/destroy-multiple`, { data: { source_ids: ids } });
    getAllSources();
  };

  return (
    <ListeGenerique
      items={sources}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onMultipleDelete={handleMultipleDelete}
      itemName="source"
      searchTerm={searchTerm}
      isLoading={isLoading}
    />
  );
}
