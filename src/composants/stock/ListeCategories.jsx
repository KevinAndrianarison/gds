import React, { useContext } from "react";
import ListeGenerique from "./ListeGenerique";
import { UrlContext } from "@/contexte/useUrl";
import { CategorieContext } from "@/contexte/useCategorie";
import axios from "@/api/axios";

export default function ListeCategories({ searchTerm = "" }) {
  const { categories, isLoading, getAllCategories } = useContext(CategorieContext);
  const { url } = useContext(UrlContext);

  const handleAdd = async (data) => {
    await axios.post(`${url}/api/categories`, data);
    getAllCategories();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${url}/api/categories/${id}`);
    getAllCategories();
  };

  const handleEdit = async (id, data) => {
    await axios.put(`${url}/api/categories/${id}`, data);
    getAllCategories();
  };

  const handleMultipleDelete = async (ids) => {
    await axios.delete(`${url}/api/categories/destroy-multiple`, { data: { category_ids: ids } });
    getAllCategories();
  };

  return (
    <ListeGenerique
      items={categories}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onMultipleDelete={handleMultipleDelete}
      itemName="catégorie"
      searchTerm={searchTerm}
      isLoading={isLoading}
    />
  );
}
