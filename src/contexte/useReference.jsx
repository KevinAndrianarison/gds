import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { UrlContext } from './useUrl';

export const ReferenceContext = createContext();

export function ReferenceProvider({ children }) {
    const [references, setReferences] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { url } = useContext(UrlContext);

    const getAllReferences = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${url}/api/references`);
            setReferences(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des références:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addReference = async (data) => {
        try {
            const response = await axios.post(`${url}/api/references`, data);
            setReferences([...references, response.data]);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la référence:', error);
            throw error;
        }
    };

    const updateReference = async (id, data) => {
        try {
            const response = await axios.put(`${url}/api/references/${id}`, data);
            setReferences(references.map(ref => ref.id === id ? response.data : ref));
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la référence:', error);
            throw error;
        }
    };

    const deleteReference = async (id) => {
        try {
            await axios.delete(`${url}/api/references/${id}`);
            setReferences(references.filter(ref => ref.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la référence:', error);
            throw error;
        }
    };

    return (
        <ReferenceContext.Provider value={{
            references,
            isLoading,
            getAllReferences,
            addReference,
            updateReference,
            deleteReference
        }}>
            {children}
        </ReferenceContext.Provider>
    );
}
