import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import doenData from '../data/doen.json';
import etenData from '../data/eten.json';
import { APP_CONFIG } from '../config';
import { useFavorites } from '../hooks/useFavorites';
import { usePlanning } from '../hooks/usePlanning';

const LandingPage = ({ setPageState }) => {
    const { favorites, favoriteLocations } = useFavorites();
    const { getTotalPlannedCount, getPlannedDays } = usePlanning();

    const totalPlannedCount = getTotalPlannedCount();
    const plannedDaysCount = getPlannedDays().length;

    const handleDoenClick = () => {
        const doenCategories = [...new Set(doenData.map(item => item.categorie))];
        setPageState({
            page: 'locations',
            filters: doenCategories
        });
    };

    const handleEtenClick = () => {
        const etenCategories = [...new Set(etenData.map(item => item.categorie))];
        setPageState({
            page: 'locations',
            filters: etenCategories
        });
    };

    const handleFavorietenClick = () => {
        setPageState({
            page: 'locations',
            filters: [], // Geen category filter
            showFavorites: true // Extra parameter om direct favorieten te tonen
        });
    };

    const handlePlanningClick = () => {
        setPageState({
            page: 'planning'
        });
    };

    return (
        <div className="min-h-screen fries-bg">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <span className="text-xl text-amber-800">Familievakantie</span>
                    <h1 className="text-6xl md:text-8xl font-extrabold text-amber-900" style={{ fontFamily: "'Comic Sans MS', 'cursive', 'sans-serif'" }}>
                        Hallo {APP_CONFIG.region}!
                    </h1>
                    <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
                        Jullie persoonlijke gids voor de leukste avonturen rond {APP_CONFIG.city}.
                    </p>
                    
                    {/* Weer widget */}
                    <div className="mt-8 flex justify-center">
                        <div style={{ maxWidth: '500px', width: '100%' }}>
                            <iframe 
                                title="widget" 
                                width="100%" 
                                height="328px" 
                                frameBorder="0" 
                                scrolling="no" 
                                loading="lazy" 
                                src="https://www.weeronline.nl/widget/weather?id=4056910"
                                className="rounded-xl shadow-lg">
                            </iframe>
                        </div>
                    </div>
                </div>

                {/* Eerste rij: Originele 3 knoppen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div 
                        onClick={handleDoenClick}
                        className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div className="text-4xl mb-3">🎡</div>
                        <h3 className="text-2xl font-bold text-amber-900 mb-2 group-hover:text-rose-600 transition-colors">
                            Wat is er te doen?
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Ontdek alle leuke attracties, bezienswaardigheden en wandelroutes in de regio.
                        </p>
                        <div className="flex items-center text-amber-800 font-semibold group-hover:text-rose-600">
                            <span>Verken activiteiten</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    <div 
                        onClick={handleEtenClick}
                        className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div className="text-4xl mb-3">🍔</div>
                        <h3 className="text-2xl font-bold text-amber-900 mb-2 group-hover:text-rose-600 transition-colors">
                            Eten & Drinken
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Vind de leukste restaurants, lokale brouwerijen en gezellige horeca.
                        </p>
                        <div className="flex items-center text-amber-800 font-semibold group-hover:text-rose-600">
                            <span>Ontdek de smaken</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    <div 
                        onClick={handleFavorietenClick}
                        className={`group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${favorites.size === 0 ? 'opacity-75' : ''}`}
                    >
                        <div className="text-4xl mb-3 relative">
                            ❤️
                            {favorites.size > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    {favorites.size}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-amber-900 mb-2 group-hover:text-rose-600 transition-colors">
                            Mijn Favorieten
                        </h3>
                        <p className="text-slate-600 mb-4">
                            {favorites.size === 0 
                                ? "Nog geen favorieten opgeslagen. Klik op een hartje om te beginnen!"
                                : `Bekijk je ${favorites.size} opgeslagen ${favorites.size === 1 ? 'favoriet' : 'favorieten'}.`
                            }
                        </p>
                        <div className="flex items-center text-amber-800 font-semibold group-hover:text-rose-600">
                            <span>{favorites.size === 0 ? 'Start met favorieteren' : 'Bekijk favorieten'}</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Tweede rij: Planning knop (full width of gecentreerd) */}
                <div className="flex justify-center mb-8">
                    <div 
                        onClick={handlePlanningClick}
                        className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer max-w-md w-full"
                    >
                        <div className="text-center">
                            <div className="text-4xl mb-3 relative inline-block">
                                📅
                                {totalPlannedCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                        {totalPlannedCount}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-2 group-hover:text-rose-600 transition-colors">
                                Mijn Planning
                            </h3>
                            <p className="text-slate-600 mb-4">
                                {totalPlannedCount === 0 
                                    ? "Plan je favorieten in per dag en tijdslot voor de perfecte vakantie!"
                                    : `${totalPlannedCount} activiteiten gepland over ${plannedDaysCount} ${plannedDaysCount === 1 ? 'dag' : 'dagen'}.`
                                }
                            </p>
                            <div className="flex items-center justify-center text-amber-800 font-semibold group-hover:text-rose-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{totalPlannedCount === 0 ? 'Start met plannen' : 'Bekijk planning'}</span>
                                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optionele snelle preview van planning indien aanwezig */}
                {totalPlannedCount > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">
                            Komende planning
                        </h2>
                        <div className="bg-white/80 p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                    <span className="font-semibold text-slate-800">
                                        {totalPlannedCount} activiteiten gepland
                                    </span>
                                </div>
                                <button 
                                    onClick={handlePlanningClick}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    Bekijk alles →
                                </button>
                            </div>
                            <p className="text-slate-600 text-sm">
                                Verspreid over {plannedDaysCount} {plannedDaysCount === 1 ? 'dag' : 'dagen'}. 
                                Klik om je volledige planning te bekijken en aan te passen.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;