import { createContext, useContext, useState } from 'react';
import { UrlContext } from './useUrl';
import nProgress from 'nprogress';
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { url } = useContext(UrlContext);

    function getAlluser() {
        nProgress.start();
        setIsLoading(true);
        setUsers([])
        axios
            .get(`${url}/api/getAllUsers`)
            .then((response) => {
                setUsers(response.data);
                setIsLoading(false);
                nProgress.done();
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
                nProgress.done();
            });
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <UserContext.Provider
            value={{
                users,
                isLoading,
                setUsers,
                setIsLoading,
                getAlluser,
                isModalOpen,
                setIsModalOpen,
                closeModal
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
