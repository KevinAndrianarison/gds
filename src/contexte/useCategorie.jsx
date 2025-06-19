import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { UrlContext } from './useUrl';

export const CategorieContext = createContext();

export function CategorieProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { url } = useContext(UrlContext);

    const getAllCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${url}/api/categories`);
            setCategories(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addCategorie = async (data) => {
        try {
            const response = await axios.post(`${url}/api/categories`, data);
            setCategories([...categories, response.data]);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
            throw error;
        }
    };

    const updateCategorie = async (id, data) => {
        try {
            const response = await axios.put(`${url}/api/categories/${id}`, data);
            setCategories(categories.map(cat => cat.id === id ? response.data : cat));
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
            throw error;
        }
    };

    const deleteCategorie = async (id) => {
        try {
            await axios.delete(`${url}/api/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
            throw error;
        }
    };

    return (
        <CategorieContext.Provider value={{
            categories,
            isLoading,
            getAllCategories,
            addCategorie,
            updateCategorie,
            deleteCategorie
        }}>
            {children}
        </CategorieContext.Provider>
    );
}
