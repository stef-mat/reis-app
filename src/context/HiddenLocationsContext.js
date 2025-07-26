import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'hiddenLocations';
const HiddenLocationsContext = createContext();

export const HiddenLocationsProvider = ({ children }) => {
    const [hidden, setHidden] = useState(() => {
        if (typeof window === 'undefined') return new Set();
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
    }, [hidden]);

    const hideLocation = (name) => {
        setHidden(prev => new Set(prev).add(name));
    };

    const restoreLocation = (name) => {
        setHidden(prev => {
            const newSet = new Set(prev);
            newSet.delete(name);
            return newSet;
        });
    };

    return (
        <HiddenLocationsContext.Provider value={{ hidden, hideLocation, restoreLocation }}>
            {children}
        </HiddenLocationsContext.Provider>
    );
};

export const useHiddenLocations = () => {
    return useContext(HiddenLocationsContext);
};

export { HiddenLocationsContext };

