import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { locaties } from '../data';

const STORAGE_KEY = 'julianadorp-favorites';
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    // State met localStorage persistence - exact zoals HiddenLocationsContext
    const [favorites, setFavorites] = useState(() => {
        if (typeof window === 'undefined') return new Set();
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (error) {
            console.warn('Error loading favorites from localStorage:', error);
            return new Set();
        }
    });

    // Sync naar localStorage bij elke favorites update
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
        } catch (error) {
            console.warn('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    // Toggle favorite functie - ongewijzigd maar met betere performance
    const toggleFavorite = (locationName) => {
        setFavorites(prev => {
            const newSet = new Set(prev);
            if (newSet.has(locationName)) {
                newSet.delete(locationName);
            } else {
                newSet.add(locationName);
            }
            return newSet;
        });
    };

    // Bulk operations - handig voor toekomstige features
    const addMultipleFavorites = (locationNames) => {
        setFavorites(prev => {
            const newSet = new Set(prev);
            locationNames.forEach(name => newSet.add(name));
            return newSet;
        });
    };

    const clearAllFavorites = () => {
        setFavorites(new Set());
    };

    // Check if location is favorite - helper functie
    const isFavorite = (locationName) => favorites.has(locationName);

    // Memoized favoriteLocations - alleen herberekenen als favorites of locaties veranderen
    const favoriteLocations = useMemo(() => {
        return locaties.filter(location => favorites.has(location.naam));
    }, [favorites]);

    // Memoized favorite count - voorkomt onnodige re-renders
    const favoritesCount = useMemo(() => favorites.size, [favorites]);

    // Context value - alles wat components nodig hebben
    const value = {
        favorites,
        favoriteLocations,
        favoritesCount,
        toggleFavorite,
        addMultipleFavorites,
        clearAllFavorites,
        isFavorite
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Custom hook met error handling
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    
    return context;
};

// Export context voor debugging/testing
export { FavoritesContext };