import React, { useState, useCallback, useMemo } from 'react';
import { Search, Heart, RotateCcw, Filter } from 'lucide-react';

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
    favoritesCount
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
        <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-lg border border-slate-200 sticky top-4 z-20">
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
                        {/* Favorites Button */}
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

                        {/* Restore Hidden Button */}
                        {hasHidden && (
                            <button
                                onClick={onRestoreHidden}
                                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:scale-102 transition-all duration-200"
                                title="Herstel alle verborgen locaties"
                            >
                                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Verborgen herstellen</span>
                                <span className="sm:hidden">Herstel</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filters Indicator */}
                {(searchTerm || activeView === 'favorites' || (selectedCategory && selectedCategory !== 'Alle')) && (
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchAndFilter;