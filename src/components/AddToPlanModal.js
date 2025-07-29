import React, { useState, useMemo } from 'react';
import { X, Plus, Search, Heart, Sunrise, Sun, Moon, Calendar, MapPin, Euro, Car, Bike } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { usePlanning } from '../hooks/usePlanning';
import { getCategoryStyle } from '../data/utils';
import { locaties } from '../data/index';

const AddToPlanModal = ({ date, timeSlot, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('favorites'); // 'favorites' of 'all'
    
    const { favoriteLocations } = useFavorites();
    const { addToDay, isLocationPlanned } = usePlanning();

    // Time slot configuratie
    const timeSlotConfig = {
        morning: { label: 'Ochtend', icon: Sunrise, color: 'text-amber-600' },
        afternoon: { label: 'Middag', icon: Sun, color: 'text-orange-600' },
        evening: { label: 'Avond', icon: Moon, color: 'text-indigo-600' }
    };

    const currentTimeSlot = timeSlotConfig[timeSlot];

    // Filter locaties op basis van tab en zoekterm
    const filteredLocations = useMemo(() => {
        const sourceLocations = selectedTab === 'favorites' ? favoriteLocations : locaties;
        
        if (!searchTerm.trim()) return sourceLocations;
        
        const searchLower = searchTerm.toLowerCase();
        return sourceLocations.filter(location =>
            location.naam.toLowerCase().includes(searchLower) ||
            location.beschrijving.toLowerCase().includes(searchLower) ||
            location.categorie.toLowerCase().includes(searchLower) ||
            location.adres.toLowerCase().includes(searchLower)
        );
    }, [selectedTab, searchTerm, favoriteLocations]);

    // Handle toevoegen aan planning
    const handleAddToPlan = (location) => {
        addToDay(date, location, timeSlot);
        onClose();
    };

    // Format datum voor display
    const formatDate = (date) => {
        return date.toLocaleDateString('nl-NL', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                                <currentTimeSlot.icon className={`w-6 h-6 ${currentTimeSlot.color}`} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Activiteit toevoegen
                                </h2>
                                <p className="text-slate-600">
                                    {formatDate(date)} • {currentTimeSlot.label}
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 hover:bg-white hover:text-slate-800 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Zoek activiteiten..."
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-50 border-b border-slate-200">
                    <button
                        onClick={() => setSelectedTab('favorites')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                            selectedTab === 'favorites'
                                ? 'bg-white text-rose-600 border-b-2 border-rose-600'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${selectedTab === 'favorites' ? 'fill-current' : ''}`} />
                        <span>Mijn Favorieten</span>
                        <span className="bg-rose-100 text-rose-600 text-sm px-2 py-1 rounded-full">
                            {favoriteLocations.length}
                        </span>
                    </button>
                    
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                            selectedTab === 'all'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span>Alle Activiteiten</span>
                        <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
                            {locaties.length}
                        </span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {filteredLocations.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredLocations.map((location) => {
                                const alreadyPlanned = isLocationPlanned(location.naam);
                                
                                return (
                                    <div 
                                        key={location.naam}
                                        className={`bg-slate-50 rounded-xl p-4 border transition-all ${
                                            alreadyPlanned 
                                                ? 'border-amber-200 bg-amber-50/50' 
                                                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getCategoryStyle(location.categorie)}`}>
                                                    {location.categorie}
                                                </span>
                                                
                                                {selectedTab === 'all' && favoriteLocations.some(fav => fav.naam === location.naam) && (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium">
                                                        <Heart className="w-3 h-3 fill-current" />
                                                        Favoriet
                                                    </span>
                                                )}
                                                
                                                {alreadyPlanned && (
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                        Al gepland
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToPlan(location)}
                                                disabled={alreadyPlanned}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                                                    alreadyPlanned
                                                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'
                                                }`}
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span className="hidden sm:inline">
                                                    {alreadyPlanned ? 'Gepland' : 'Toevoegen'}
                                                </span>
                                            </button>
                                        </div>

                                        <h4 className="font-bold text-slate-800 mb-2 text-lg">
                                            {location.naam}
                                        </h4>

                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                            {location.beschrijving}
                                        </p>

                                        {/* Quick Info */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{location.adres.split(',')[0]}</span>
                                            </div>

                                            <div className="flex items-center gap-1 text-emerald-600">
                                                <Euro className="w-3 h-3" />
                                                <span className="truncate">{location.prijsindicatie.split(',')[0]}</span>
                                            </div>

                                            {location.reistijd_auto && (
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <Car className="w-3 h-3" />
                                                    <span>{location.reistijd_auto}</span>
                                                </div>
                                            )}

                                            {location.reistijd_fiets && (
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <Bike className="w-3 h-3" />
                                                    <span>{location.reistijd_fiets}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">
                                {selectedTab === 'favorites' ? '❤️' : '🔍'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                {selectedTab === 'favorites' 
                                    ? (favoriteLocations.length === 0 
                                        ? "Nog geen favorieten" 
                                        : "Geen favorieten gevonden"
                                    )
                                    : "Geen activiteiten gevonden"
                                }
                            </h3>
                            <p className="text-slate-600">
                                {selectedTab === 'favorites' 
                                    ? (favoriteLocations.length === 0
                                        ? "Voeg eerst favorieten toe door op het hartje te klikken"
                                        : "Probeer een andere zoekterm"
                                    )
                                    : "Probeer een andere zoekterm of bekijk je favorieten"
                                }
                            </p>
                            
                            {selectedTab === 'favorites' && favoriteLocations.length === 0 && (
                                <button
                                    onClick={() => setSelectedTab('all')}
                                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Bekijk alle activiteiten
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>
                            {filteredLocations.length} {selectedTab === 'favorites' ? 'favorieten' : 'activiteiten'} 
                            {searchTerm && ' gevonden'}
                        </span>
                        <span>
                            Tip: Gebruik de zoekbalk om snel te vinden wat je zoekt
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddToPlanModal;