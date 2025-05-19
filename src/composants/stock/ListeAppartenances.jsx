import React, { useContext } from "react";
import ListeGenerique from "./ListeGenerique";
import { UrlContext } from "@/contexte/useUrl";
import { AppartenanceContext } from "@/contexte/useAppartenance";
import axios from "@/api/axios";

export default function ListeAppartenances({ searchTerm = "" }) {
  const { appartenances, isLoading, getAllAppartenances } = useContext(AppartenanceContext);
  const { url } = useContext(UrlContext);

  const handleAdd = async (data) => {
    await axios.post(`${url}/api/appartenances`, data);
    getAllAppartenances();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${url}/api/appartenances/${id}`);
    getAllAppartenances();
  };

  const handleEdit = async (id, data) => {
    await axios.put(`${url}/api/appartenances/${id}`, data);
    getAllAppartenances();
  };

  const handleMultipleDelete = async (ids) => {
    await axios.delete(`${url}/api/appartenances/destroy-multiple`, { data: { appartenance_ids: ids } });
    getAllAppartenances();
  };

  return (
    <ListeGenerique
      items={appartenances}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onMultipleDelete={handleMultipleDelete}
      itemName="appartenance"
      searchTerm={searchTerm}
      isLoading={isLoading}
    />
  );
}
