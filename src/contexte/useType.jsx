import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { UrlContext } from './useUrl';

export const TypeContext = createContext();

export function TypeProvider({ children }) {
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { url } = useContext(UrlContext);

    const getAllTypes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${url}/api/types-materiels`);
            setTypes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des types:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addType = async (data) => {
        try {
            const response = await axios.post(`${url}/api/types-materiels`, data);
            setTypes([...types, response.data]);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du type:', error);
            throw error;
        }
    };

    const updateType = async (id, data) => {
        try {
            const response = await axios.put(`${url}/api/types-materiels/${id}`, data);
            setTypes(types.map(type => type.id === id ? response.data : type));
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du type:', error);
            throw error;
        }
    };

    const deleteType = async (id) => {
        try {
            await axios.delete(`${url}/api/types-materiels/${id}`);
            setTypes(types.filter(type => type.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression du type:', error);
            throw error;
        }
    };

    return (
        <TypeContext.Provider value={{
            types,
            isLoading,
            getAllTypes,
            addType,
            updateType,
            deleteType
        }}>
            {children}
        </TypeContext.Provider>
    );
}
