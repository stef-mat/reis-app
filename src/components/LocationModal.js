import React from 'react';
import { MapPin, Clock, Globe, Euro, Heart, X, Eye } from 'lucide-react';
import { getCategoryStyle, getGoogleMapsUrl } from '../data/utils';
import { useFavorites } from '../hooks/useFavorites';
import { useHiddenLocations } from '../hooks/useHiddenLocations';

const LocationModal = ({ location, onClose }) => {
    const { favorites, toggleFavorite } = useFavorites();
    const { hideLocation } = useHiddenLocations();
    const isFavorite = location ? favorites.has(location.naam) : false;
    
    // Render niets als er geen locatie is geselecteerd
    if (!location) return null;

    // URL validation helper
    const isValidUrl = (url) => {
        try { 
            return Boolean(new URL(url)); 
        } catch { 
            return false; 
        }
    };

    // Safe website URL
    const websiteUrl = location.website && location.website !== "Niet gespecificeerd" 
        ? (!location.website.startsWith('http') ? `https://${location.website}` : location.website)
        : null;

    return (
        // De overlay die het hele scherm bedekt
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Het daadwerkelijke modal-venster */}
            <div 
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" 
                onClick={e => e.stopPropagation()} // Voorkomt dat klikken in de modal de modal sluit
            >
                {/* Header Section - Geen Image */}
                <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 p-6 md:p-8 rounded-t-2xl border-b border-amber-200">
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-800 hover:bg-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        aria-label="Sluit modal"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Category Badge */}
                    <div className="mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border shadow-sm ${getCategoryStyle(location.categorie)}`}>
                            {location.categorie}
                        </span>
                    </div>

                    {/* Location Title */}
                    <h2 
                        id="modal-title"
                        className="text-3xl md:text-4xl font-bold text-amber-900 mb-2 pr-12"
                    >
                        {location.naam}
                    </h2>

                    {/* Quick Visual Indicator */}
                    <div className="flex items-center gap-2 text-amber-700">
                        <Eye className="w-5 h-5" />
                        <span className="text-sm font-medium">Details & Informatie</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">
                    {/* Beschrijving */}
                    <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            Beschrijving
                        </h3>
                        <p className="text-slate-700 leading-relaxed">{location.beschrijving}</p>
                    </div>

                    {/* Info Grid - Prijs en Openingstijden */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                            <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-2">
                                <Euro className="w-5 h-5" /> 
                                Prijsindicatie
                            </h3>
                            <p className="text-emerald-800 text-sm leading-relaxed">{location.prijsindicatie}</p>
                        </div>
                        <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
                            <h3 className="font-bold text-sky-900 flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5" /> 
                                Openingstijden
                            </h3>
                            <p className="text-sky-800 text-sm leading-relaxed">{location.openingstijden}</p>
                        </div>
                    </div>

                    {/* Adres informatie */}
                    <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5" /> 
                            Locatie & Adres
                        </h3>
                        <p className="text-blue-800 text-sm mb-1">{location.adres}</p>
                        {location.gps_coordinaten !== "Niet expliciet vermeld" && (
                            <p className="text-blue-600 text-xs font-mono bg-blue-100 px-2 py-1 rounded inline-block">
                                {location.gps_coordinaten}
                            </p>
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                        {/* Favorite Button */}
                        <button
                            onClick={() => toggleFavorite(location.naam)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                                isFavorite 
                                    ? 'bg-rose-500 text-white shadow-lg' 
                                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200'
                            }`}
                            aria-label={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                        >
                            <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
                            {isFavorite ? 'Opgeslagen!' : 'Opslaan'}
                        </button>

                        {/* Hide Button */}
                        <button
                            onClick={() => { hideLocation(location.naam); onClose(); }}
                            className="px-4 py-2.5 rounded-full font-semibold bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            aria-label="Verberg deze locatie"
                        >
                            Verberg
                        </button>

                        {/* Google Maps Link */}
                        <a 
                            href={getGoogleMapsUrl(location.gps_coordinaten, location.naam)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition-all font-semibold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            aria-label="Open locatie in Google Maps"
                        >
                            <MapPin className="w-5 h-5" />
                            <span className="hidden sm:inline">Open in Kaart</span>
                            <span className="sm:hidden">Kaart</span>
                        </a>

                        {/* Website Link */}
                        {websiteUrl && isValidUrl(websiteUrl) && (
                            <a 
                                href={websiteUrl}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                aria-label="Bezoek website"
                            >
                                <Globe className="w-5 h-5" />
                                <span className="hidden sm:inline">Website</span>
                                <span className="sm:hidden">Web</span>
                            </a>
                        )}
                    </div>

                    {/* Quick Stats - Extra info voor gebruikers */}
                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>GPS beschikbaar: {location.gps_coordinaten !== "Niet expliciet vermeld" ? 'Ja' : 'Nee'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Website: {websiteUrl ? 'Beschikbaar' : 'Niet beschikbaar'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span>Categorie: {location.categorie}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;