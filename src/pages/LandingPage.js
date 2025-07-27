import React from 'react';
import { ArrowRight } from 'lucide-react';
import doenData from '../data/doen.json';
import etenData from '../data/eten.json';
import { APP_CONFIG } from '../config';
import { useFavorites } from '../hooks/useFavorites';

const LandingPage = ({ setPageState }) => {
    const { favorites, favoriteLocations } = useFavorites();

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

    return (
        <div className="min-h-screen bg-amber-50">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <span className="text-xl text-amber-800">Familievakantie</span>
                    <h1 className="text-6xl md:text-8xl font-extrabold text-amber-900" style={{ fontFamily: "'Comic Sans MS', 'cursive', 'sans-serif'" }}>
                        Hallo {APP_CONFIG.region}!
                    </h1>
                    <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
                        Jullie persoonlijke gids voor de leukste avonturen rond {APP_CONFIG.city}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                    <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-not-allowed opacity-70">
                        <div className="text-4xl mb-3">☀️</div>
                        <h3 className="text-2xl font-bold text-amber-900 mb-2">
                            Weerbericht
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Plan je uitje perfect met het actuele weerbericht. Binnenkort beschikbaar!
                        </p>
                        <div className="flex items-center text-slate-500 font-semibold">
                            <span>Bekijk weer</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </div>

                {/* Optionele snelle preview van favorieten indien aanwezig */}
                {favorites.size > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">
                            Je laatste favorieten
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {favoriteLocations.slice(0, 3).map((location) => (
                                <div key={location.naam} className="bg-white/80 p-4 rounded-xl shadow-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-rose-500">❤️</span>
                                        <h4 className="font-semibold text-amber-900 truncate">{location.naam}</h4>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2">{location.beschrijving}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;