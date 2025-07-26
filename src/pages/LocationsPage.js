import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchAndFilter from '../components/SearchAndFilter';
import LocationCard from '../components/LocationCard';
import LocationModal from '../components/LocationModal';
import { useFavorites } from '../hooks/useFavorites';
import { useFilteredLocations } from '../hooks/useFilteredLocations';
import { useHiddenLocations } from '../hooks/useHiddenLocations';
import { locaties } from '../data/index';

const LocationsPage = ({ setPageState, initialFilters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(initialFilters || []);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [activeView, setActiveView] = useState('all');

    const { favorites, favoriteLocations, toggleFavorite } = useFavorites();
    const { hidden, hideLocation, restoreLocation } = useHiddenLocations();
    const filteredByGroup = useFilteredLocations(searchTerm, selectedCategories);

    const locationsFiltered = filteredByGroup.filter(loc => !hidden.has(loc.naam));
    const favoritesFiltered = favoriteLocations
        .filter(loc => loc.naam.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(loc => !hidden.has(loc.naam));

    const locationsToShow = activeView === 'all'
        ? locationsFiltered
        : favoritesFiltered;

    const handleCategoryChange = (category) => {
        setActiveView('all');
        if (category === 'Alle') {
            setSelectedCategories(uniqueCategories);
        } else {
            setSelectedCategories([category]);
        }
    };

    const handleShowFavorites = () => setActiveView('favorites');

const handleRestoreHidden = () => {
    hidden.forEach(name => restoreLocation(name));
};

const uniqueCategories = useMemo(() => {
    if (initialFilters && initialFilters.length > 0) {
        return [...new Set(initialFilters)];
    }
    return [...new Set(locaties.map(loc => loc.categorie))];
}, [initialFilters]);

const allCategories = ['Alle', ...uniqueCategories];

    return (
        <div className="min-h-screen bg-amber-100/50">
             <div className="fixed top-4 left-4 z-30">
                <button onClick={() => setPageState({ page: 'landing' })} className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-700 rounded-full shadow-lg hover:bg-white transition-colors">
                    <ArrowRight className="w-4 h-4 transform rotate-180" />
                    <span>Home</span>
                </button>
            </div>
            <div className="container mx-auto p-4 md:p-8">
                <PageHeader
                    title="Wat gaan we doen?"
                    subtitle={`Ontdek ${locaties.length} onvergetelijke familie-uitjes!`}
                >
                    <SearchAndFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        categories={allCategories}
                        selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : ''}
                        onCategoryChange={handleCategoryChange}
                        onShowFavorites={handleShowFavorites}
                        onRestoreHidden={handleRestoreHidden}
                        hasHidden={hidden.size > 0}
                        activeView={activeView}
                        favoritesCount={favorites.size}
                    />
                </PageHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {locationsToShow.map((location) => (
                        <LocationCard
                            key={location.naam}
                            location={location}
                            onShowDetails={setSelectedLocation}
                        />
                    ))}
                </div>

                {locationsToShow.length === 0 && (
                     <div className="text-center col-span-full py-16 bg-white/50 rounded-2xl">
                        <div className="text-6xl mb-4">
                            {activeView === 'favorites' ? '❤️' : '🕵️'}
                        </div>
                        <h3 className="text-2xl font-bold text-amber-900">
                            {activeView === 'favorites' 
                                ? "Je hebt nog geen favorieten." 
                                : "Oeps, niets gevonden!"
                            }
                        </h3>
                        <p className="text-slate-600">
                            {activeView === 'favorites'
                                ? "Klik op een hartje om een uitje op te slaan!"
                                : "Probeer een andere zoekterm of een ander filter."
                            }
                        </p>
                    </div>
                )}
            </div>

            <LocationModal
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
            />
        </div>
    );
};

export default LocationsPage;
