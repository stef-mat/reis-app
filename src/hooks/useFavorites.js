import { useState, useMemo, useEffect, useCallback } from 'react';
import { locaties } from '../data/index';

const STORAGE_KEY = 'favoriteLocations';

// Singleton state - one source of truth
let globalFavorites = null;
let globalSetters = new Set();

const getInitialFavorites = () => {
    if (globalFavorites) return globalFavorites;
    
    if (typeof window === 'undefined') {
        globalFavorites = new Set();
        return globalFavorites;
    }
    
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        globalFavorites = stored ? new Set(JSON.parse(stored)) : new Set();
        return globalFavorites;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        globalFavorites = new Set();
        return globalFavorites;
    }
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => getInitialFavorites());

    // Register this setter
    useEffect(() => {
        globalSetters.add(setFavorites);
        return () => globalSetters.delete(setFavorites);
    }, []);

    // Sync to localStorage whenever favorites change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [favorites]);

    const toggleFavorite = useCallback((locationName) => {
        // Update global state
        const newGlobalFavorites = new Set(globalFavorites);
        if (newGlobalFavorites.has(locationName)) {
            newGlobalFavorites.delete(locationName);
        } else {
            newGlobalFavorites.add(locationName);
        }
        
        globalFavorites = newGlobalFavorites;
        
        // Update all instances
        globalSetters.forEach(setter => {
            setter(new Set(globalFavorites));
        });
    }, []);

    const favoriteLocations = useMemo(() => {
        return locaties.filter(location => favorites.has(location.naam));
    }, [favorites]);

    return { 
        favorites, 
        favoriteLocations, 
        toggleFavorite 
    };
};