import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { UrlContext } from './useUrl';

export const SourceContext = createContext();

export function SourceProvider({ children }) {
    const [sources, setSources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { url } = useContext(UrlContext);

    const getAllSources = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${url}/api/sources`);
            setSources(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des sources:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addSource = async (data) => {
        try {
            const response = await axios.post(`${url}/api/sources`, data);
            setSources([...sources, response.data]);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la source:', error);
            throw error;
        }
    };

    const updateSource = async (id, data) => {
        try {
            const response = await axios.put(`${url}/api/sources/${id}`, data);
            setSources(sources.map(src => src.id === id ? response.data : src));
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la source:', error);
            throw error;
        }
    };

    const deleteSource = async (id) => {
        try {
            await axios.delete(`${url}/api/sources/${id}`);
            setSources(sources.filter(src => src.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la source:', error);
            throw error;
        }
    };

    return (
        <SourceContext.Provider value={{
            sources,
            isLoading,
            getAllSources,
            addSource,
            updateSource,
            deleteSource
        }}>
            {children}
        </SourceContext.Provider>
    );
}
