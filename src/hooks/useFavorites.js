import { useState, useMemo, useEffect } from 'react';
import { locaties } from '../data/index';

const STORAGE_KEY = 'favoriteLocations';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => {
        if (typeof window === 'undefined') return new Set();
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    }, [favorites]);

    const toggleFavorite = (locationName) => {
        const newFavorites = new Set(favorites);
        newFavorites.has(locationName)
            ? newFavorites.delete(locationName)
            : newFavorites.add(locationName);
        setFavorites(newFavorites);
    };

    const favoriteLocations = useMemo(() => {
        return locaties.filter(location => favorites.has(location.naam));
    }, [favorites]);

    return { favorites, favoriteLocations, toggleFavorite };
};
