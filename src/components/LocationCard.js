import React, { useCallback } from 'react';
import { Euro, Heart, MapPin, Clock, X } from 'lucide-react';
import { getCategoryStyle } from '../data/utils';
import { useFavorites } from '../hooks/useFavorites';
import { useHiddenLocations } from '../hooks/useHiddenLocations';

const LocationCard = ({ location, onShowDetails }) => {
    const { favorites, toggleFavorite } = useFavorites();
    const { hideLocation } = useHiddenLocations();
    const isFavorite = favorites.has(location.naam);

    // Optimized favorite toggle met feedback
    const handleFavoriteClick = useCallback((e) => {
        e.stopPropagation(); // Voorkom dat modal opent
        toggleFavorite(location.naam);
    }, [location.naam, toggleFavorite]);

    // Hide location handler
    const handleHideClick = useCallback((e) => {
        e.stopPropagation(); // Voorkom dat modal opent
        hideLocation(location.naam);
    }, [location.naam, hideLocation]);

    // Show details handler
    const handleShowDetails = useCallback(() => {
        onShowDetails(location);
    }, [location, onShowDetails]);

    // Truncate description helper
    const truncatedDescription = location.beschrijving.length > 120 
        ? `${location.beschrijving.substring(0, 120)}...` 
        : location.beschrijving;

    // Extract first part of price indication
    const priceDisplay = location.prijsindicatie.split(',')[0];

    return (
        <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col overflow-hidden">
            {/* Header Section - No Image */}
            <div className="p-4 sm:p-5 pb-0">
                <div className="flex items-start justify-between mb-3">
                    {/* Category Badge */}
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${getCategoryStyle(location.categorie)}`}>
                        {location.categorie}
                    </div>

                    {/* Action Buttons - Favorite & Hide */}
                    <div className="flex items-center gap-2">
                        {/* Favorite Button */}
                        <button 
                            onClick={handleFavoriteClick}
                            className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                                isFavorite 
                                    ? 'bg-rose-500 text-white shadow-lg' 
                                    : 'bg-slate-100 text-rose-500 hover:bg-rose-50 shadow-md'
                            }`}
                            aria-label={isFavorite ? `Verwijder ${location.naam} uit favorieten` : `Voeg ${location.naam} toe aan favorieten`}
                            title={isFavorite ? 'Uit favorieten verwijderen' : 'Aan favorieten toevoegen'}
                        >
                            <Heart className={`w-5 h-5 transition-all ${
                                isFavorite ? 'fill-current scale-110' : 'stroke-current hover:fill-current'
                            }`} />
                        </button>

                        {/* Hide Button */}
                        <button 
                            onClick={handleHideClick}
                            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 shadow-md transition-all duration-200 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
                            aria-label={`Verberg ${location.naam}`}
                            title="Verberg deze locatie"
                        >
                            <X className="w-5 h-5 transition-all hover:rotate-90" />
                        </button>
                    </div>
                </div>

                {/* Location Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3 cursor-pointer hover:text-rose-600 transition-colors"
                    onClick={handleShowDetails}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleShowDetails()}
                    aria-label={`Bekijk details van ${location.naam}`}
                >
                    {location.naam}
                </h3>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5 pt-0 flex flex-col flex-grow">
                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
                    {truncatedDescription}
                </p>

                {/* Quick Info - alleen op grotere schermen */}
                <div className="hidden sm:flex items-center gap-4 mb-4 text-xs text-slate-500">
                    {location.gps_coordinaten !== "Niet expliciet vermeld" && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>Locatie bekend</span>
                        </div>
                    )}
                    {location.openingstijden !== "Niet gespecificeerd" && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Openingstijden</span>
                        </div>
                    )}
                </div>

                {/* Footer: Price and Action */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-3 sm:pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                        <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate max-w-[120px]" title={location.prijsindicatie}>
                            {priceDisplay}
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleShowDetails}
                        className="text-amber-800 font-semibold hover:text-rose-600 transition-colors text-sm flex items-center gap-1 group/btn focus:outline-none focus:ring-2 focus:ring-amber-400 rounded px-2 py-1"
                        aria-label={`Bekijk meer informatie over ${location.naam}`}
                    >
                        <span>Meer info</span>
                        <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default LocationCard;