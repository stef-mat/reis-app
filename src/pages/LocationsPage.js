import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchAndFilter from '../components/SearchAndFilter';
import LocationCard from '../components/LocationCard';
import LocationModal from '../components/LocationModal';
import { useFavorites } from '../hooks/useFavorites';
import { useFilteredLocations } from '../hooks/useFilteredLocations';
import { useHiddenLocations } from '../hooks/useHiddenLocations';
import { locaties } from '../data/index';

const LocationsPage = ({ setPageState, initialFilters, showFavorites }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [activeView, setActiveView] = useState(showFavorites ? 'favorites' : 'all');
    
    // Nieuwe state voor tijd filters
    const [maxCarTime, setMaxCarTime] = useState(30);
    const [maxBikeTime, setMaxBikeTime] = useState(30);

    const { favorites, favoriteLocations, toggleFavorite } = useFavorites();
    const { hidden, hideLocation, restoreLocation } = useHiddenLocations();
    
    const uniqueCategories = useMemo(() => {
        // Filter duplicates uit locaties data
        const uniqueLocations = locaties.filter((location, index, self) => 
            index === self.findIndex(l => l.naam === location.naam)
        );
        
        if (initialFilters && initialFilters.length > 0) {
            return [...new Set(initialFilters)];
        }
        return [...new Set(uniqueLocations.map(loc => loc.categorie))];
    }, [initialFilters]);

    const allCategories = ['Alle', ...uniqueCategories];

    // Initialiseer selectedCategories correct
    useEffect(() => {
        if (showFavorites) {
            setActiveView('favorites');
            setPageState(prevState => ({ ...prevState, showFavorites: false }));
        } else if (initialFilters && initialFilters.length > 0) {
            setSelectedCategories([...initialFilters]); // Force new array
        } else {
            setSelectedCategories([...uniqueCategories]); // Force new array
        }
    }, [showFavorites, initialFilters, uniqueCategories, setPageState]);

    // Gebruik de geüpdatete hook met tijd parameters
    const filteredByGroup = useFilteredLocations(
        searchTerm, 
        selectedCategories, 
        maxCarTime, 
        maxBikeTime
    );
    
    // Debug logging + cleanup
    useEffect(() => {
        console.log('selectedCategories changed:', selectedCategories);
        console.log('filteredByGroup length:', filteredByGroup.length);
        console.log('maxCarTime:', maxCarTime, 'maxBikeTime:', maxBikeTime);
        console.log('favorites.size:', favorites.size);
        console.log('favorites contents:', [...favorites]);
    }, [selectedCategories, filteredByGroup, favorites, maxCarTime, maxBikeTime]);

    const locationsFiltered = filteredByGroup.filter(loc => !hidden.has(loc.naam));
    
    // Ook favorieten filteren op tijd als dat gewenst is
    const favoritesFiltered = favoriteLocations
        .filter(loc => loc.naam.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(loc => !hidden.has(loc.naam))
        // Optioneel: ook favorieten filteren op tijd
        .filter(loc => {
            if (maxCarTime < 30) {
                const carTimeMinutes = parseTimeToMinutes(loc.reistijd_auto);
                if (carTimeMinutes > maxCarTime) return false;
            }
            if (maxBikeTime < 30) {
                const bikeTimeMinutes = parseTimeToMinutes(loc.reistijd_fiets);
                if (bikeTimeMinutes > maxBikeTime) return false;
            }
            return true;
        });

    const locationsToShow = activeView === 'all'
        ? locationsFiltered
        : favoritesFiltered;

    const handleCategoryChange = (category) => {
        console.log('Category clicked:', category); // Debug log
        setActiveView('all');
        
        if (category === 'Alle') {
            console.log('Setting all categories:', uniqueCategories); // Debug log
            setSelectedCategories([...uniqueCategories]); // Force new array
        } else {
            console.log('Setting single category:', [category]); // Debug log
            setSelectedCategories([category]);
        }
    };

    const handleShowFavorites = () => setActiveView('favorites');

    const handleRestoreHidden = () => {
        hidden.forEach(name => restoreLocation(name));
    };

    // Handler voor auto tijd wijziging
    const handleCarTimeChange = (newTime) => {
        setMaxCarTime(newTime);
        // Reset naar 'all' view als we in favorites waren
        if (activeView === 'favorites') {
            setActiveView('all');
        }
    };

    // Handler voor fiets tijd wijziging  
    const handleBikeTimeChange = (newTime) => {
        setMaxBikeTime(newTime);
        // Reset naar 'all' view als we in favorites waren
        if (activeView === 'favorites') {
            setActiveView('all');
        }
    };

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
                    title={activeView === 'favorites' ? "Mijn Favorieten" : "Wat gaan we doen?"}
                    subtitle={activeView === 'favorites' 
                        ? `${favorites.size} ${favorites.size === 1 ? 'favoriet' : 'favorieten'} opgeslagen` 
                        : `Ontdek ${locaties.length} onvergetelijke familie-uitjes!`
                    }
                >
                    <SearchAndFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        categories={allCategories}
                        selectedCategory={
                            selectedCategories.length === uniqueCategories.length ? 'Alle' : 
                            selectedCategories.length === 1 ? selectedCategories[0] : ''
                        }
                        onCategoryChange={handleCategoryChange}
                        onRestoreHidden={handleRestoreHidden}
                        hasHidden={hidden.size > 0}
                        activeView={activeView}
                        showFavoritesButton={false}
                        maxCarTime={maxCarTime}
                        maxBikeTime={maxBikeTime}
                        onCarTimeChange={handleCarTimeChange}
                        onBikeTimeChange={handleBikeTimeChange}
                        favoritesCount={favorites.size}
                    />
                </PageHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {locationsToShow.map((location, index) => (
                        <LocationCard
                            key={`${location.naam}-${index}`}
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
                        <p className="text-slate-600 mb-4">
                            {activeView === 'favorites'
                                ? "Klik op een hartje om een uitje op te slaan!"
                                : "Probeer een andere zoekterm of een ander filter."
                            }
                        </p>
                        {activeView === 'favorites' && (
                            <button 
                                onClick={() => setActiveView('all')}
                                className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors font-semibold"
                            >
                                Ontdek nieuwe uitjes
                            </button>
                        )}
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

// Helper functie om tijd string naar minuten te converteren (hergebruikt van hook)
const parseTimeToMinutes = (timeString) => {
    if (!timeString || timeString === 'N.v.t.' || timeString === '>30 min') {
        return 999; // Grote waarde voor onbekende/lange tijden
    }
    
    // Extract cijfers uit strings zoals "±15 min", "3 min", "75 min", etc.
    const match = timeString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999;
};

export default LocationsPage;