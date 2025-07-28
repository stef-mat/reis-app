import { useMemo } from 'react';
import { locaties } from '../data/index';

// Helper functie om tijd string naar minuten te converteren
const parseTimeToMinutes = (timeString) => {
    if (!timeString || timeString === 'N.v.t.' || timeString === '>30 min') {
        return 999; // Grote waarde voor onbekende/lange tijden
    }
    
    // Extract cijfers uit strings zoals "±15 min", "3 min", "75 min", etc.
    const match = timeString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999;
};

export const useFilteredLocations = (
    searchTerm, 
    selectedCategories, 
    maxCarTime = 30, 
    maxBikeTime = 30
) => {
    return useMemo(() => {
        // Start met alle unieke locaties (vermijd duplicaten)
        let filtered = locaties.filter((location, index, self) => 
            index === self.findIndex(l => l.naam === location.naam)
        );

        // Filter op zoekterm
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(location =>
                location.naam.toLowerCase().includes(searchLower) ||
                location.beschrijving.toLowerCase().includes(searchLower) ||
                location.aanraders?.toLowerCase().includes(searchLower) ||
                location.adres.toLowerCase().includes(searchLower)
            );
        }

        // Filter op categorieën
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(location =>
                selectedCategories.includes(location.categorie)
            );
        }

        // Filter op auto reistijd
        if (maxCarTime < 30) {
            filtered = filtered.filter(location => {
                const carTimeMinutes = parseTimeToMinutes(location.reistijd_auto);
                return carTimeMinutes <= maxCarTime;
            });
        }

        // Filter op fiets reistijd
        if (maxBikeTime < 30) {
            filtered = filtered.filter(location => {
                const bikeTimeMinutes = parseTimeToMinutes(location.reistijd_fiets);
                return bikeTimeMinutes <= maxBikeTime;
            });
        }

        return filtered;
    }, [searchTerm, selectedCategories, maxCarTime, maxBikeTime]);
};