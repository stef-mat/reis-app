import React, { useState } from 'react';
import { X, Calendar, Sunrise, Sun, Moon, Plus, Check } from 'lucide-react';
import { usePlanning } from '../hooks/usePlanning';

const QuickPlanModal = ({ location, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');
    const [isAdding, setIsAdding] = useState(false);

    const { addToDay, isLocationPlanned } = usePlanning();

    // Time slot configuratie
    const timeSlots = [
        { key: 'morning', label: 'Ochtend', icon: Sunrise, color: 'bg-amber-50 text-amber-700 border-amber-200' },
        { key: 'afternoon', label: 'Middag', icon: Sun, color: 'bg-orange-50 text-orange-700 border-orange-200' },
        { key: 'evening', label: 'Avond', icon: Moon, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
    ];

    // Handle toevoegen aan planning
    const handleAddToPlan = async () => {
        setIsAdding(true);
        
        try {
            const date = new Date(selectedDate);
            addToDay(date, location, selectedTimeSlot);
            
            // Korte delay voor feedback
            await new Promise(resolve => setTimeout(resolve, 500));
            onClose();
        } catch (error) {
            console.error('Error adding to plan:', error);
            setIsAdding(false);
        }
    };

    // Generate date options (next 14 days)
    const dateOptions = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    const isAlreadyPlanned = isLocationPlanned(location.naam);

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Toevoegen aan planning
                                </h2>
                                {isAlreadyPlanned && (
                                    <p className="text-sm text-amber-600 font-medium">
                                        Al gepland - nieuwe tijd kiezen?
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="p-2 bg-white/80 rounded-full text-slate-600 hover:bg-white hover:text-slate-800 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Location Info */}
                    <div className="bg-white/80 rounded-xl p-4">
                        <h3 className="font-bold text-slate-800 mb-1">{location.naam}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{location.beschrijving}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Datum Selectie */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">
                            Kies een datum
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {dateOptions.map((date) => {
                                const dateStr = date.toISOString().split('T')[0];
                                const isToday = dateStr === new Date().toISOString().split('T')[0];
                                const isTomorrow = dateStr === new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
                                
                                let displayLabel;
                                if (isToday) {
                                    displayLabel = 'Vandaag';
                                } else if (isTomorrow) {
                                    displayLabel = 'Morgen';
                                } else {
                                    displayLabel = date.toLocaleDateString('nl-NL', { 
                                        weekday: 'short', 
                                        day: 'numeric',
                                        month: 'short'
                                    });
                                }
                                
                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`p-3 rounded-xl text-left transition-all border-2 ${
                                            selectedDate === dateStr
                                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                                        }`}
                                    >
                                        <div className="font-semibold text-sm">{displayLabel}</div>
                                        <div className="text-xs opacity-75">
                                            {date.getDate()}/{date.getMonth() + 1}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tijdslot Selectie */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">
                            Kies een tijdslot
                        </label>
                        <div className="space-y-2">
                            {timeSlots.map(({ key, label, icon: Icon, color }) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTimeSlot(key)}
                                    className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                                        selectedTimeSlot === key
                                            ? 'border-blue-300 bg-blue-50 text-blue-800'
                                            : `border-slate-200 hover:border-slate-300 ${color}`
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <div>
                                        <div className="font-semibold">{label}</div>
                                        <div className="text-xs opacity-75">
                                            {key === 'morning' && '09:00 - 12:00'}
                                            {key === 'afternoon' && '13:00 - 17:00'}
                                            {key === 'evening' && '18:00 - 21:00'}
                                        </div>
                                    </div>
                                    {selectedTimeSlot === key && (
                                        <Check className="w-5 h-5 ml-auto text-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 transition-colors"
                        >
                            Annuleren
                        </button>
                        
                        <button
                            onClick={handleAddToPlan}
                            disabled={isAdding}
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                isAdding
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isAdding ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Toegevoegd!</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>Toevoegen</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-xs text-slate-500 mb-1">Preview:</div>
                        <div className="text-sm font-medium text-slate-800">
                            {location.naam} • {new Date(selectedDate).toLocaleDateString('nl-NL', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                            })} • {timeSlots.find(slot => slot.key === selectedTimeSlot)?.label}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickPlanModal;