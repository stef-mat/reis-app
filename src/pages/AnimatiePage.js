import React, { useState, useMemo } from 'react';
import { ArrowRight, Calendar, Star, Clock, Users, MapPin, Euro, Plus } from 'lucide-react';
import { usePlanning } from '../hooks/usePlanning';
import { useFavorites } from '../hooks/useFavorites';
import animatieData from '../data/animatieprogramma.json';
import LocationModal from '../components/LocationModal';
import QuickPlanModal from '../components/QuickPlanModal';

const AnimatiePage = ({ setPageState }) => {
    const [selectedDate, setSelectedDate] = useState('all');
    const [selectedAge, setSelectedAge] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showQuickPlan, setShowQuickPlan] = useState(null);
    
    const { isLocationPlanned } = usePlanning();
    const { favorites, toggleFavorite } = useFavorites();

    // Unieke datums uit de data halen
    const availableDates = useMemo(() => {
        const dates = [...new Set(animatieData.map(item => item.datum))].sort();
        return dates.map(date => ({
            value: date,
            label: new Date(date).toLocaleDateString('nl-NL', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            })
        }));
    }, []);

    // Unieke leeftijdscategorieën
    const ageCategories = useMemo(() => {
        const ages = [...new Set(animatieData.map(item => item.leeftijd))];
        return ages.filter(age => age && age !== '').sort();
    }, []);

    // Gefilterde activiteiten
    const filteredActivities = useMemo(() => {
        return animatieData.filter(activity => {
            const dateMatch = selectedDate === 'all' || activity.datum === selectedDate;
            const ageMatch = selectedAge === 'all' || activity.leeftijd === selectedAge;
            return dateMatch && ageMatch;
        }).sort((a, b) => {
            // Sorteer op datum en dan op tijd
            if (a.datum !== b.datum) {
                return a.datum.localeCompare(b.datum);
            }
            return a.tijd.localeCompare(b.tijd);
        });
    }, [selectedDate, selectedAge]);

    // Groepeer activiteiten per dag
    const groupedActivities = useMemo(() => {
        const grouped = {};
        filteredActivities.forEach(activity => {
            if (!grouped[activity.datum]) {
                grouped[activity.datum] = [];
            }
            grouped[activity.datum].push(activity);
        });
        return grouped;
    }, [filteredActivities]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('nl-NL', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    const getTimeSlotFromTime = (timeStr) => {
        const hour = parseInt(timeStr.split(':')[0]);
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setPageState({ page: 'landing' })} 
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4 transform rotate-180" />
                                <span>Home</span>
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <Star className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Animatieprogramma</h1>
                                    <p className="text-sm text-slate-600">Molecaten Park 't Hout</p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
                            <span>{filteredActivities.length} activiteiten</span>
                            <span>31 juli - 8 augustus</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Intro */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-purple-900 mb-4">
                        🎪 Molecaten Animatie Week 🎪
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Van 31 juli tot 8 augustus staat het park vol met leuke activiteiten! 
                        Van shows en workshops tot sport en spel - er is voor iedereen wat wils.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Datum Filter */}
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-3">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Selecteer dag
                            </label>
                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                            >
                                <option value="all">Alle dagen</option>
                                {availableDates.map(date => (
                                    <option key={date.value} value={date.value}>
                                        {date.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Leeftijd Filter */}
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-3">
                                <Users className="w-4 h-4 inline mr-2" />
                                Leeftijdscategorie
                            </label>
                            <select
                                value={selectedAge}
                                onChange={(e) => setSelectedAge(e.target.value)}
                                className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                            >
                                <option value="all">Alle leeftijden</option>
                                {ageCategories.map(age => (
                                    <option key={age} value={age}>
                                        {age}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Indicator */}
                    {(selectedDate !== 'all' || selectedAge !== 'all') && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs text-slate-500 font-medium">Actieve filters:</span>
                                {selectedDate !== 'all' && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                        {availableDates.find(d => d.value === selectedDate)?.label}
                                    </span>
                                )}
                                {selectedAge !== 'all' && (
                                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                                        {selectedAge}
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedDate('all');
                                        setSelectedAge('all');
                                    }}
                                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                                >
                                    Wis filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Activiteiten Lijst */}
                {Object.keys(groupedActivities).length > 0 ? Object.entries(groupedActivities).map(([date, activities]) => (
                    <div key={date} className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-purple-900">
                                {formatDate(date)}
                            </h3>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                {activities.length} activiteiten
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {activities.map((activity, index) => {
                                const isFavorite = favorites.has(activity.naam);
                                const isPlanned = isLocationPlanned(activity.naam);

                                return (
                                    <div 
                                        key={`${activity.datum}-${index}`}
                                        className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                                            activity.highlight 
                                                ? 'border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white' 
                                                : 'border-l-purple-400'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                    activity.highlight 
                                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                                                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                                                }`}>
                                                    {activity.highlight && <Star className="w-3 h-3 inline mr-1" />}
                                                    Animatieprogramma
                                                </div>
                                                
                                                {isPlanned && (
                                                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold border border-blue-200">
                                                        Gepland
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleFavorite(activity.naam)}
                                                    className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                                                        isFavorite 
                                                            ? 'bg-rose-500 text-white' 
                                                            : 'bg-slate-100 text-rose-500 hover:bg-rose-50'
                                                    }`}
                                                    title={isFavorite ? 'Uit favorieten verwijderen' : 'Aan favorieten toevoegen'}
                                                >
                                                    ❤️
                                                </button>

                                                <button
                                                    onClick={() => setShowQuickPlan(activity)}
                                                    className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                                                        isPlanned
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-slate-100 text-blue-500 hover:bg-blue-50'
                                                    }`}
                                                    title={isPlanned ? 'Al gepland' : 'Voeg toe aan planning'}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-bold text-slate-800 mb-3 cursor-pointer hover:text-purple-700 transition-colors"
                                            onClick={() => setSelectedLocation(activity)}
                                        >
                                            {activity.naam}
                                        </h4>

                                        <p className="text-slate-600 mb-4 leading-relaxed">
                                            {activity.beschrijving}
                                        </p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{activity.tijd}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Users className="w-4 h-4" />
                                                <span>{activity.leeftijd}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="truncate">{activity.adres.split(',')[0]}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <Euro className="w-4 h-4" />
                                                <span className="truncate">{activity.prijsindicatie}</span>
                                            </div>
                                        </div>

                                        {activity.aanraders && (
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <p className="text-sm text-slate-700">
                                                    <strong>💡 Tip:</strong> {activity.aanraders}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-16 bg-white/50 rounded-2xl">
                        <div className="text-6xl mb-4">🎪</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            Geen activiteiten gevonden
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Probeer andere filters of bekijk alle dagen en leeftijden.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedDate('all');
                                setSelectedAge('all');
                            }}
                            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-semibold"
                        >
                            Toon alle activiteiten
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <LocationModal
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
            />

            {showQuickPlan && (
                <QuickPlanModal
                    location={showQuickPlan}
                    onClose={() => setShowQuickPlan(null)}
                />
            )}
        </div>
    );
};

export default AnimatiePage;