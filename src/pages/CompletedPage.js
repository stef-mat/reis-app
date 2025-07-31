import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle, Calendar, MapPin, Trash2, Trophy } from 'lucide-react';
import { useCompleted } from '../hooks/useCompleted';
import { useFavorites } from '../hooks/useFavorites';
import { locaties } from '../data/index';
import { getCategoryStyle } from '../data/utils';

const CompletedPage = ({ setPageState }) => {
    const { completedActivities, toggleCompleted } = useCompleted();
    const { favorites } = useFavorites();

    // Verkrijg volledige locatie data voor completed items
    const completedWithDetails = useMemo(() => {
        return completedActivities.map(completed => {
            const locationDetails = locaties.find(loc => loc.naam === completed.name);
            return {
                ...completed,
                details: locationDetails
            };
        }).filter(item => item.details); // Filter uit items zonder details
    }, [completedActivities]);

    const formatCompletedDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('nl-NL', { 
            weekday: 'long',
            day: 'numeric', 
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleUncomplete = (activityName) => {
        if (window.confirm('Deze activiteit als niet-afgerond markeren?')) {
            toggleCompleted(activityName);
        }
    };

    return (
        <div className="min-h-screen app-bg">
            {/* Header */}
            <div className="bg-white border-b-2 border-orange-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setPageState({ page: 'landing' })} 
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-700 text-green-700 rounded-full hover:bg-green-700 hover:text-white transition-all duration-300 shadow-lg"
                            >
                                <ArrowRight className="w-4 h-4 transform rotate-180" />
                                <span className="font-semibold">Home</span>
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500 rounded-full shadow-lg">
                                    <Trophy className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-green-700">
                                        Mijn Reisherinneringen
                                    </h1>
                                    <p className="text-slate-600 font-medium">
                                        Alle avonturen die jullie hebben beleefd! 🌟
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-6 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-500">{completedWithDetails.length}</div>
                                <div className="text-slate-600">voltooid</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {completedWithDetails.length === 0 ? (
                    // Empty State
                    <div className="text-center py-20">
                        <div className="bg-white rounded-3xl max-w-2xl mx-auto p-12 shadow-xl">
                            <div className="text-8xl mb-6">📸</div>
                            <h2 className="text-3xl font-bold text-green-700 mb-4">
                                Nog geen herinneringen
                            </h2>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Jullie avontuur begint nu pas! Terwijl jullie activiteiten beleven, 
                                kunnen jullie ze afvinken met de groene vink-knop. Zo bouw je een mooi overzicht op 
                                van alle geweldige dingen die jullie hebben gedaan! ✨
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setPageState({ page: 'locations', filters: [] })}
                                    className="bg-orange-500 text-white px-8 py-4 rounded-full hover:bg-orange-600 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Ontdek activiteiten →
                                </button>
                                <button
                                    onClick={() => setPageState({ page: 'planning' })}
                                    className="bg-white border-2 border-green-700 text-green-700 px-8 py-4 rounded-full hover:bg-green-700 hover:text-white transition-colors font-bold text-lg shadow-lg"
                                >
                                    <Calendar className="w-5 h-5 inline mr-2" />
                                    Bekijk planning
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl mb-8 border-2 border-orange-200">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-2xl font-bold text-green-700 mb-2">
                                    Geweldig gedaan!
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    Jullie hebben al <strong>{completedWithDetails.length}</strong> {completedWithDetails.length === 1 ? 'activiteit' : 'activiteiten'} voltooid!
                                </p>
                                <div className="flex items-center justify-center gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-500">{completedWithDetails.length}</div>
                                        <div className="text-sm text-slate-600">Voltooid</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-rose-500">
                                            {completedWithDetails.filter(item => favorites.has(item.name)).length}
                                        </div>
                                        <div className="text-sm text-slate-600">Favorieten</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Activities List */}
                        <div className="space-y-6">
                            {completedWithDetails.map((activity, index) => (
                                <div key={`${activity.name}-${activity.completedAt}`} className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500 rounded-full">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryStyle(activity.details.categorie)}`}>
                                                    {activity.details.categorie}
                                                </span>
                                                
                                                {favorites.has(activity.name) && (
                                                    <span className="px-3 py-1 bg-rose-100 text-rose-600 border border-rose-200 rounded-full text-xs font-bold">
                                                        ❤️ Favoriet
                                                    </span>
                                                )}
                                                
                                                <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                                                    <Calendar className="w-3 h-3 inline mr-1" />
                                                    {formatCompletedDate(activity.completedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleUncomplete(activity.name)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
                                            title="Markeer als niet voltooid"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-green-700 mb-2">
                                        {activity.details.naam}
                                    </h3>

                                    <p className="text-slate-600 mb-4 leading-relaxed">
                                        {activity.details.beschrijving}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{activity.details.adres.split(',')[0]}</span>
                                        </div>
                                        
                                        {activity.details.reistijd_auto && (
                                            <div className="flex items-center gap-1">
                                                <span>🚗</span>
                                                <span>{activity.details.reistijd_auto}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-1">
                                            <span>💰</span>
                                            <span className="truncate">{activity.details.prijsindicatie.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CompletedPage;