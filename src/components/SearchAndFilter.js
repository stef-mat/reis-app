import React, { useState, useCallback, useMemo } from 'react';
import { Search, Heart, RotateCcw, Filter, Car, Bike } from 'lucide-react';

const SearchAndFilter = ({
    searchTerm,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
    onShowFavorites,
    onRestoreHidden,
    hasHidden,
    activeView,
    favoritesCount,
    showFavoritesButton = true,
    // Nieuwe props voor tijd filters
    maxCarTime = 30,
    maxBikeTime = 30,
    onCarTimeChange,
    onBikeTimeChange
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Debounced search voor betere performance
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        onSearchChange(value);
    }, [onSearchChange]);

    // Clear search functie
    const clearSearch = useCallback(() => {
        onSearchChange('');
    }, [onSearchChange]);

    // Auto tijd slider handler
    const handleCarTimeChange = useCallback((e) => {
        const value = parseInt(e.target.value);
        onCarTimeChange(value);
    }, [onCarTimeChange]);

    // Fiets tijd slider handler  
    const handleBikeTimeChange = useCallback((e) => {
        const value = parseInt(e.target.value);
        onBikeTimeChange(value);
    }, [onBikeTimeChange]);

    // Format tijd display
    const formatTimeDisplay = (time) => {
        return time === 30 ? '30+ min' : `${time} min`;
    };

    // Memoized category buttons voor performance
    const categoryButtons = useMemo(() => 
        categories.map(category => (
            <button 
                key={category} 
                onClick={() => onCategoryChange(category)} 
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border-2 whitespace-nowrap ${
                    activeView === 'all' && selectedCategory === category 
                    ? 'bg-amber-800 text-white border-amber-800 shadow-md transform scale-105' 
                    : 'bg-white text-slate-700 hover:bg-amber-50 hover:border-amber-300 border-slate-200 hover:scale-102'
                }`}
                aria-pressed={activeView === 'all' && selectedCategory === category}
            >
                {category}
            </button>
        )), [categories, selectedCategory, onCategoryChange, activeView]
    );

    return (
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-slate-200 sticky top-4 z-20">
            {/* Search Bar */}
            <div className="relative mb-4">
                <label htmlFor="location-search" className="sr-only">
                    Zoek naar locaties en activiteiten
                </label>
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                    id="location-search"
                    type="text"
                    placeholder="Zoek een avontuur..."
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition text-sm sm:text-base"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoComplete="off"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Wis zoekopdracht"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Mobile Toggle voor filters */}
            <div className="sm:hidden mb-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-medium w-full justify-center"
                    aria-expanded={isExpanded}
                    aria-controls="filter-options"
                >
                    <Filter className="w-4 h-4" />
                    <span>{isExpanded ? 'Verberg filters' : 'Toon filters'}</span>
                </button>
            </div>

            {/* Filter Options - responsive visibility */}
            <div 
                id="filter-options"
                className={`${isExpanded ? 'block' : 'hidden'} sm:block`}
            >
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center items-center gap-2 mb-3 sm:mb-0">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categoryButtons}
                    </div>

                    {/* Divider - alleen op desktop */}
                    <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2"></div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center mt-2 sm:mt-0">
                        {/* Favorites Button - alleen tonen als showFavoritesButton true is */}
                        {showFavoritesButton && (
                            <button
                                onClick={onShowFavorites}
                                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border-2 ${
                                    activeView === 'favorites'
                                    ? 'bg-rose-500 text-white border-rose-500 shadow-md transform scale-105'
                                    : 'bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-300 border-rose-200 hover:scale-102'
                                }`}
                                aria-pressed={activeView === 'favorites'}
                            >
                                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${activeView === 'favorites' ? 'fill-current' : ''}`} />
                                <span className="hidden sm:inline">Mijn Favorieten</span>
                                <span className="sm:hidden">Favorieten</span>
                                {favoritesCount > 0 && (
                                    <span className="bg-rose-100 text-rose-600 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                                        {favoritesCount}
                                    </span>
                                )}
                            </button>
                        )}
                        
                        {/* Restore Hidden Button */}
                        {hasHidden && (
                            <button
                                onClick={onRestoreHidden}
                                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border-2 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 border-slate-200 hover:scale-102"
                            >
                                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Herstel verborgen</span>
                                <span className="sm:hidden">Herstel</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tijd Filters - onder de categorieën */}
                <div className="mt-4 space-y-4">
                    {/* Auto tijd filter */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                            <Car className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-slate-700">Max auto:</span>
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={maxCarTime}
                                onChange={handleCarTimeChange}
                                className="w-full h-2 bg-red-200 rounded-lg appearance-none slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4 slider-thumb:bg-red-600 slider-thumb:rounded-full slider-thumb:cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                                style={{
                                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(maxCarTime/30)*100}%, #fecaca ${(maxCarTime/30)*100}%, #fecaca 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>0 min</span>
                                <span className="font-medium text-red-600">{formatTimeDisplay(maxCarTime)}</span>
                                <span>30+ min</span>
                            </div>
                        </div>
                    </div>

                    {/* Fiets tijd filter */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                            <Bike className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-700">Max fiets:</span>
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={maxBikeTime}
                                onChange={handleBikeTimeChange}
                                className="w-full h-2 bg-green-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-400"
                                style={{
                                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(maxBikeTime/30)*100}%, #bbf7d0 ${(maxBikeTime/30)*100}%, #bbf7d0 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>0 min</span>
                                <span className="font-medium text-green-600">{formatTimeDisplay(maxBikeTime)}</span>
                                <span>30+ min</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filters Indicator */}
                {(searchTerm || activeView === 'favorites' || (selectedCategory && selectedCategory !== 'Alle') || maxCarTime < 30 || maxBikeTime < 30) && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex flex-wrap gap-2 items-center justify-center">
                            <span className="text-xs text-slate-500 font-medium">Actieve filters:</span>
                            {searchTerm && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                                    Zoek: "{searchTerm}"
                                </span>
                            )}
                            {activeView === 'favorites' && (
                                <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-full text-xs">
                                    Alleen favorieten
                                </span>
                            )}
                            {selectedCategory && selectedCategory !== 'Alle' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Categorie: {selectedCategory}
                                </span>
                            )}
                            {maxCarTime < 30 && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1">
                                    <Car className="w-3 h-3" />
                                    ≤ {formatTimeDisplay(maxCarTime)}
                                </span>
                            )}
                            {maxBikeTime < 30 && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
                                    <Bike className="w-3 h-3" />
                                    ≤ {formatTimeDisplay(maxBikeTime)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS voor slider styling */}
            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default SearchAndFilter;