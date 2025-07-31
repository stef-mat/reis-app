import React from 'react';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import doenData from '../data/doen.json';
import etenData from '../data/eten.json';
import animatieData from '../data/animatieprogramma.json';
import { APP_CONFIG } from '../config';
import { useFavorites } from '../hooks/useFavorites';
import { usePlanning } from '../hooks/usePlanning';
import { useCompleted } from '../hooks/useCompleted';

const LandingPage = ({ setPageState }) => {
    const { favorites } = useFavorites();
    const { getTotalPlannedCount, getPlannedDays } = usePlanning();

    const totalPlannedCount = getTotalPlannedCount();
    const plannedDaysCount = getPlannedDays().length;
    const { completedActivities } = useCompleted();

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
            filters: [],
            showFavorites: true
        });
    };

    const handlePlanningClick = () => {
        setPageState({
            page: 'planning'
        });
    };

    const handleAnimatieClick = () => {
        setPageState({
            page: 'animatie'
        });
    };

    const ActionCard = ({ onClick, emoji, title, description, badge, badgeColor, disabled = false }) => (
        <div 
            onClick={disabled ? null : onClick}
            className={`group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-400 ${
                disabled ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            style={{ minHeight: '320px' }}
        >
            <div className="flex flex-col h-full">
                <div className="text-5xl mb-4 relative">
                    {emoji}
                    {badge && (
                        <span className={`absolute -top-2 -right-2 ${badgeColor} text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg`}>
                            {badge}
                        </span>
                    )}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-500 transition-colors flex-shrink-0">
                    {title}
                </h3>
                <p className="text-slate-600 mb-6 flex-grow leading-relaxed">
                    {description}
                </p>
                <div className="flex items-center text-green-700 font-semibold group-hover:text-orange-500 transition-colors flex-shrink-0">
                    <span>{disabled ? 'Binnenkort beschikbaar' : 'Bekijk meer'}</span>
                    {!disabled && <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />}
                </div>
            </div>
        </div>
    );

    const SectionHeader = ({ emoji, number, title }) => (
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-lg border-2 border-orange-200">
                <span className="text-4xl">{emoji}</span>
                <h2 className="text-3xl font-bold text-green-700">
                    {number}. {title}
                </h2>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen app-bg">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <span className="text-2xl text-orange-500 font-semibold">Familievakantie</span>
                    <h1 className="text-7xl md:text-9xl font-extrabold text-green-700 mb-6" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}>
                        Hallo {APP_CONFIG.region}!
                    </h1>
                    <p className="text-xl text-slate-700 mt-4 max-w-3xl mx-auto font-medium">
                        Jullie persoonlijke gids voor de leukste avonturen rond {APP_CONFIG.city}.
                        Van ontdekken tot beleven - alles voor een onvergetelijke vakantie! 🌟
                    </p>
                    
                    {/* Weer widget */}
                    <div className="mt-12 flex justify-center">
                        <div style={{ maxWidth: '500px', width: '100%' }}>
                            <iframe 
                                title="widget" 
                                width="100%" 
                                height="328px" 
                                frameBorder="0" 
                                scrolling="no" 
                                loading="lazy" 
                                src="https://www.weeronline.nl/widget/weather?id=4056910"
                                className="rounded-2xl shadow-2xl border-4 border-white">
                            </iframe>
                        </div>
                    </div>
                </div>

                {/* 1. Voorbereiding */}
                <section className="mb-20">
                    <SectionHeader emoji="🧭" number="1" title="Voorbereiding" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ActionCard
                            onClick={handleDoenClick}
                            emoji="🎡"
                            title="Wat is er te doen?"
                            description="Ontdek alle leuke attracties, bezienswaardigheden en wandelroutes in de regio. Van spannende pretparken tot rustgevende natuurgebieden - er is voor iedereen wat wils!"
                        />
                        
                        <ActionCard
                            onClick={handleEtenClick}
                            emoji="🍔"
                            title="Eten & Drinken"
                            description="Vind de leukste restaurants, lokale brouwerijen en gezellige horeca. Proef de echte smaken van de regio en ontdek verborgen culinaire pareltjes."
                        />
                        
                        <ActionCard
                            onClick={handleFavorietenClick}
                            emoji="❤️"
                            title="Mijn Favorieten"
                            description={favorites.size === 0 
                                ? "Nog geen favorieten opgeslagen. Klik op een hartje om te beginnen met je persoonlijke collectie van de leukste plekken!"
                                : `Bekijk je ${favorites.size} opgeslagen ${favorites.size === 1 ? 'favoriet' : 'favorieten'}. Alles wat jullie leuk vinden verzameld op één plek.`
                            }
                            badge={favorites.size > 0 ? favorites.size : null}
                            badgeColor="bg-rose-500"
                        />
                    </div>
                </section>

                {/* 2. Tijdens de vakantie */}
                <section className="mb-20">
                    <SectionHeader emoji="🏖️" number="2" title="Tijdens de vakantie" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ActionCard
                            onClick={handlePlanningClick}
                            emoji="📅"
                            title="Mijn Planning"
                            description={totalPlannedCount === 0 
                                ? "Plan je favorieten in per dag en tijdslot voor de perfecte vakantie! Maak elke dag tot een avontuur en zorg dat je niets mist."
                                : `${totalPlannedCount} activiteiten gepland over ${plannedDaysCount} ${plannedDaysCount === 1 ? 'dag' : 'dagen'}. Jouw vakantie staat helemaal klaar - tijd om te genieten!`
                            }
                            badge={totalPlannedCount > 0 ? totalPlannedCount : null}
                            badgeColor="bg-blue-500"
                        />

                        <ActionCard
                            onClick={handleAnimatieClick}
                            emoji="🎪"
                            title="Animatieprogramma"
                            description={`Ontdek het volledige animatieprogramma van Molecaten Park 't Hout. ${animatieData.length} geweldige activiteiten van 31 juli t/m 8 augustus wachten op jullie - van shows tot workshops!`}
                        />
                    </div>
                </section>

                {/* 3. Na de vakantie */}
                <section className="mb-16">
                    <SectionHeader emoji="📸" number="3" title="Na de vakantie" />
                    <div className="grid grid-cols-1 max-w-2xl mx-auto">
                        <ActionCard
    onClick={() => setPageState({ page: 'completed' })}
    emoji="✅"
    title="Mijn Reisherinneringen"
    description={`Bekijk alle ${completedActivities?.length || 0} activiteiten die jullie hebben voltooid! Jullie persoonlijke vakantielogboek met alle mooie herinneringen op chronologische volgorde.`}
    badge={completedActivities?.length > 0 ? completedActivities.length : null}
    badgeColor="bg-green-500"
/>
                    </div>
                </section>

                {/* Planning Preview (indien aanwezig) */}
                {totalPlannedCount > 0 && (
                    <div className="mt-20">
                        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl mx-auto border-2 border-orange-200">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🗓️</div>
                                <h3 className="text-2xl font-bold text-green-700 mb-4">
                                    Jullie vakantie is bijna klaar!
                                </h3>
                                <div className="flex items-center justify-center gap-8 mb-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-500">{totalPlannedCount}</div>
                                        <div className="text-sm text-slate-600">activiteiten</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-500">{plannedDaysCount}</div>
                                        <div className="text-sm text-slate-600">{plannedDaysCount === 1 ? 'dag' : 'dagen'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-500">{favorites.size}</div>
                                        <div className="text-sm text-slate-600">favorieten</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePlanningClick}
                                    className="bg-orange-500 text-white px-8 py-4 rounded-full hover:bg-orange-600 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Bekijk complete planning →
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;