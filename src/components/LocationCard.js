import React, { useCallback, useState } from 'react';
import { Euro, Heart, Car, Bike, X, Calendar, Plus, CheckCircle } from 'lucide-react';
import { getCategoryStyle } from '../data/utils';
import { useFavorites } from '../hooks/useFavorites';
import { useHiddenLocations } from '../hooks/useHiddenLocations';
import { usePlanning } from '../hooks/usePlanning';
import { useCompleted } from '../hooks/useCompleted';
import QuickPlanModal from './QuickPlanModal';

const LocationCard = ({ location, onShowDetails }) => {
    const [showQuickPlan, setShowQuickPlan] = useState(false);
    const [showCompleteDatePicker, setShowCompleteDatePicker] = useState(false);
    const [selectedCompletionDate, setSelectedCompletionDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    
    const { favorites, toggleFavorite } = useFavorites();
    const { hideLocation } = useHiddenLocations();
    const { isLocationPlanned } = usePlanning();
    const { isCompleted, toggleCompleted } = useCompleted();
    
    const isFavorite = favorites.has(location.naam);
    const isPlanned = isLocationPlanned(location.naam);
    const isActivityCompleted = isCompleted(location.naam);

    // Optimized favorite toggle
    const handleFavoriteClick = useCallback((e) => {
        e.stopPropagation();
        toggleFavorite(location.naam);
    }, [location.naam, toggleFavorite]);

    // Hide location handler
    const handleHideClick = useCallback((e) => {
        e.stopPropagation();
        hideLocation(location.naam);
    }, [location.naam, hideLocation]);

    // Quick plan handler
    const handleQuickPlanClick = useCallback((e) => {
        e.stopPropagation();
        setShowQuickPlan(true);
    }, []);

    // Complete activity handler
    const handleCompleteClick = useCallback((e) => {
        e.stopPropagation();
        if (isActivityCompleted) {
            // Directly toggle if already completed
            toggleCompleted(location.naam);
        } else {
            // Show date picker for new completion
            setShowCompleteDatePicker(true);
        }
    }, [location.naam, isActivityCompleted, toggleCompleted]);

    // Handle completion with selected date
    const handleCompleteWithDate = useCallback(() => {
        const completionDate = new Date(selectedCompletionDate);
        toggleCompleted(location.naam, completionDate);
        setShowCompleteDatePicker(false);
    }, [location.naam, selectedCompletionDate, toggleCompleted]);

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
        <>
            <article className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col overflow-hidden ${
                isActivityCompleted ? 'opacity-75 border-2 border-green-200' : ''
            }`}>
                {/* Header Section */}
                <div className="p-4 sm:p-5 pb-0">
                    <div className="flex items-start justify-between mb-3">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${getCategoryStyle(location.categorie)}`}>
                                {location.categorie}
                            </div>
                            
                            {/* Status Badges */}
                            {isActivityCompleted && (
                                <div className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 shadow-sm">
                                    ✅ Voltooid
                                </div>
                            )}
                            
                            {isPlanned && !isActivityCompleted && (
                                <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200 shadow-sm">
                                    📅 Gepland
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Completion Button - NIEUW! */}
                            <button 
                                onClick={handleCompleteClick}
                                className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md ${
                                    isActivityCompleted
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-slate-100 text-green-500 hover:bg-green-50'
                                }`}
                                aria-label={isActivityCompleted ? `${location.naam} is voltooid` : `Markeer ${location.naam} als voltooid`}
                                title={isActivityCompleted ? 'Voltooid - klik om ongedaan te maken' : 'Markeer als voltooid'}
                            >
                                <CheckCircle className={`w-5 h-5 transition-all ${
                                    isActivityCompleted ? 'fill-current scale-110' : 'stroke-current'
                                }`} />
                            </button>

                            {/* Favorite Button */}
                            <button 
                                onClick={handleFavoriteClick}
                                className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-md ${
                                    isFavorite 
                                        ? 'bg-rose-500 text-white' 
                                        : 'bg-slate-100 text-rose-500 hover:bg-rose-50'
                                }`}
                                aria-label={isFavorite ? `Verwijder ${location.naam} uit favorieten` : `Voeg ${location.naam} toe aan favorieten`}
                                title={isFavorite ? 'Uit favorieten verwijderen' : 'Aan favorieten toevoegen'}
                            >
                                <Heart className={`w-5 h-5 transition-all ${
                                    isFavorite ? 'fill-current scale-110' : 'stroke-current hover:fill-current'
                                }`} />
                            </button>

                            {/* Quick Plan Button */}
                            <button 
                                onClick={handleQuickPlanClick}
                                className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md ${
                                    isPlanned
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 text-blue-500 hover:bg-blue-50'
                                }`}
                                aria-label={isPlanned ? `${location.naam} is al gepland` : `Plan ${location.naam}`}
                                title={isPlanned ? 'Al gepland - klik om te wijzigen' : 'Voeg toe aan planning'}
                            >
                                {isPlanned ? (
                                    <Calendar className="w-5 h-5 fill-current" />
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
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
                    <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 cursor-pointer hover:text-orange-500 transition-colors"
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

                    {/* Quick Info - Travel Times */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs text-slate-500">
                        {location.reistijd_auto && (
                            <div className="flex items-center gap-1">
                                <Car className="w-3 h-3 sm:w-3 sm:h-3" />
                                <span className="text-xs sm:text-xs">{location.reistijd_auto}</span>
                            </div>
                        )}
                        {location.reistijd_fiets && (
                            <div className="flex items-center gap-1">
                                <Bike className="w-3 h-3 sm:w-3 sm:h-3" />
                                <span className="text-xs sm:text-xs">{location.reistijd_fiets}</span>
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
                            className="text-green-700 font-semibold hover:text-orange-500 transition-colors text-sm flex items-center gap-1 group/btn focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-2 py-1"
                            aria-label={`Bekijk meer informatie over ${location.naam}`}
                        >
                            <span>Meer info</span>
                            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </article>

            {/* Quick Plan Modal */}
            {showQuickPlan && (
                <QuickPlanModal
                    location={location}
                    onClose={() => setShowQuickPlan(false)}
                />
            )}

            {/* Completion Date Picker Modal - NIEUW! */}
            {showCompleteDatePicker && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowCompleteDatePicker(false)}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                                Activiteit voltooien
                            </h3>
                            <p className="text-slate-600">
                                Op welke datum hebben jullie <strong>{location.naam}</strong> bezocht?
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-800 mb-2">
                                Selecteer datum:
                            </label>
                            <input
                                type="date"
                                value={selectedCompletionDate}
                                onChange={(e) => setSelectedCompletionDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-green-400 focus:outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCompleteDatePicker(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Annuleren
                            </button>
                            
                            <button
                                onClick={handleCompleteWithDate}
                                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Voltooien
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LocationCard;