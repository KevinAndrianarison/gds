import { createContext, useState } from 'react';

export const UrlContext = createContext({});

export function UrlContextProvider({ children }) {
    const [url, setUrl] = useState('http://localhost:8000');

    return (
        <UrlContext.Provider
            value={{
                url,
                setUrl
            }}
        >
            {children}
        </UrlContext.Provider>
    );
}
