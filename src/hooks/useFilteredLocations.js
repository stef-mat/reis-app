import { useMemo } from 'react';
import { locaties } from '../data/index';

export const useFilteredLocations = (searchTerm, selectedCategories) => {
    return useMemo(() => {
        if (!selectedCategories || selectedCategories.length === 0) {
            return locaties.filter(location => 
                Object.values(location).some(val => 
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        return locaties.filter(location => {
            const matchesSearch = Object.values(location).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesCategory = selectedCategories.includes(location.categorie);

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategories]);
};