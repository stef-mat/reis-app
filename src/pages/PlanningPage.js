import React, { useState, useMemo } from 'react';
import { ArrowRight, Calendar, Plus, Sunrise, Sun, Moon, Trash2, Eye } from 'lucide-react';
import { usePlanning } from '../hooks/usePlanning';
import { useFavorites } from '../hooks/useFavorites';
import DayPlanningCard from '../components/DayPlanningCard';
import AddToPlanModal from '../components/AddToPlanModal';
import LocationModal from '../components/LocationModal';

const PlanningPage = ({ setPageState }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'
    const [selectedLocation, setSelectedLocation] = useState(null);
    
    const { 
        getDayPlanning, 
        getPlannedDays, 
        getTotalPlannedCount,
        removeFromDay,
        clearDayPlanning 
    } = usePlanning();
    const { favoriteLocations } = useFavorites();

    // Helper functie voor datum formatting
    const formatDate = (date) => {
        return date.toLocaleDateString('nl-NL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Helper functie voor korte datum
    const formatShortDate = (date) => {
        return date.toLocaleDateString('nl-NL', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Genereer week data
    const weekData = useMemo(() => {
        const startOfWeek = new Date(selectedDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Maandag = start
        startOfWeek.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                date,
                planning: getDayPlanning(date)
            };
        });
    }, [selectedDate, getDayPlanning]);

    const currentDayPlanning = getDayPlanning(selectedDate);
    const plannedDays = getPlannedDays();
    const totalPlannedCount = getTotalPlannedCount();

    // Time slot configuratie
    const timeSlots = [
        { key: 'morning', label: 'Ochtend', icon: Sunrise, color: 'bg-amber-50 border-amber-200 text-amber-800' },
        { key: 'afternoon', label: 'Middag', icon: Sun, color: 'bg-orange-50 border-orange-200 text-orange-800' },
        { key: 'evening', label: 'Avond', icon: Moon, color: 'bg-indigo-50 border-indigo-200 text-indigo-800' }
    ];

    const handleDateNavigation = (direction) => {
        const newDate = new Date(selectedDate);
        if (viewMode === 'day') {
            newDate.setDate(selectedDate.getDate() + direction);
        } else {
            newDate.setDate(selectedDate.getDate() + (direction * 7));
        }
        setSelectedDate(newDate);
    };

    const handleRemoveLocation = (locationId, timeSlot) => {
        removeFromDay(selectedDate, locationId, timeSlot);
    };

    return (
        <div className="min-h-screen app-bg">
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
                            
                            <div className="flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-slate-800">Planning</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="flex bg-slate-100 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode('day')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        viewMode === 'day' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    Dag
                                </button>
                                <button
                                    onClick={() => setViewMode('week')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        viewMode === 'week' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}
                                >
                                    Week
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
                                <span>{favoriteLocations.length} favorieten</span>
                                <span>{totalPlannedCount} gepland</span>
                                <span>{plannedDays.length} dagen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {viewMode === 'day' ? (
                    // DAG WEERGAVE
                    <>
                        {/* Datum Navigator */}
                        <div className="flex items-center justify-between mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                            <button
                                onClick={() => handleDateNavigation(-1)}
                                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 transform rotate-180 text-slate-600" />
                            </button>
                            
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-slate-800 mb-1">
                                    {formatDate(selectedDate)}
                                </h2>
                                <p className="text-slate-600">
                                    {Object.values(currentDayPlanning).reduce((total, slot) => total + (slot?.length || 0), 0)} activiteiten gepland
                                </p>
                            </div>
                            
                            <button
                                onClick={() => handleDateNavigation(1)}
                                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Time Slots */}
                        <div className="grid gap-6">
                            {timeSlots.map(({ key, label, icon: Icon, color }) => (
                                <div key={key} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                                    <div className={`${color} px-6 py-4 border-b`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-6 h-6" />
                                                <h3 className="text-xl font-bold">{label}</h3>
                                                <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium">
                                                    {currentDayPlanning[key]?.length || 0} activiteiten
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setShowAddModal(key)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-full transition-colors font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Toevoegen</span>
                                                </button>
                                                
                                                {currentDayPlanning[key]?.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Alle activiteiten in dit tijdslot verwijderen?')) {
                                                                currentDayPlanning[key].forEach(loc => 
                                                                    handleRemoveLocation(loc.id, key)
                                                                );
                                                            }
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Alle activiteiten verwijderen"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        {currentDayPlanning[key]?.length > 0 ? (
                                            <div className="grid gap-4">
                                                {currentDayPlanning[key].map((location) => (
                                                    <DayPlanningCard
                                                        key={location.id}
                                                        location={location}
                                                        onRemove={() => handleRemoveLocation(location.id, key)}
                                                        onViewDetails={() => setSelectedLocation(location)}
                                                        timeSlot={key}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-slate-500">
                                                <div className="text-4xl mb-2">📋</div>
                                                <p>Nog geen activiteiten gepland voor de {label.toLowerCase()}</p>
                                                <button
                                                    onClick={() => setShowAddModal(key)}
                                                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Voeg je eerste activiteit toe
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dag Actions */}
                        {Object.values(currentDayPlanning).some(slot => slot?.length > 0) && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => {
                                        if (window.confirm('Alle planning voor deze dag verwijderen?')) {
                                            clearDayPlanning(selectedDate);
                                        }
                                    }}
                                    className="px-6 py-3 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-medium"
                                >
                                    Hele dag wissen
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // WEEK WEERGAVE
                    <>
                        {/* Week Navigator */}
                        <div className="flex items-center justify-between mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                            <button
                                onClick={() => handleDateNavigation(-1)}
                                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 transform rotate-180 text-slate-600" />
                            </button>
                            
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-slate-800 mb-1">
                                    Week van {formatShortDate(weekData[0].date)}
                                </h2>
                                <p className="text-slate-600">
                                    {weekData.reduce((total, day) => 
                                        total + Object.values(day.planning).reduce((dayTotal, slot) => 
                                            dayTotal + (slot?.length || 0), 0
                                        ), 0
                                    )} activiteiten gepland
                                </p>
                            </div>
                            
                            <button
                                onClick={() => handleDateNavigation(1)}
                                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Week Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                            {weekData.map(({ date, planning }) => (
                                <div 
                                    key={date.toISOString()}
                                    className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
                                        date.toDateString() === selectedDate.toDateString() 
                                            ? 'ring-2 ring-blue-400' 
                                            : ''
                                    }`}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <div className="bg-slate-50 p-4 border-b">
                                        <h3 className="font-bold text-slate-800">
                                            {date.toLocaleDateString('nl-NL', { weekday: 'short' })}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            {date.getDate()}/{date.getMonth() + 1}
                                        </p>
                                    </div>
                                    
                                    <div className="p-4 space-y-2">
                                        {timeSlots.map(({ key, label, icon: Icon }) => {
                                            const count = planning[key]?.length || 0;
                                            return count > 0 ? (
                                                <div key={key} className="flex items-center gap-2 text-sm">
                                                    <Icon className="w-4 h-4 text-slate-500" />
                                                    <span className="text-slate-700">{count}</span>
                                                </div>
                                            ) : null;
                                        })}
                                        
                                        {Object.values(planning).every(slot => !slot?.length) && (
                                            <p className="text-sm text-slate-400 italic">Geen planning</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddToPlanModal
                    date={selectedDate}
                    timeSlot={showAddModal}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            <LocationModal
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
            />
        </div>
    );
};

export default PlanningPage;