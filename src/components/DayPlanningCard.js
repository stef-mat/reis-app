import React from 'react';
import { Clock, MapPin, Euro, Eye, Trash2, Car, Bike } from 'lucide-react';
import { getCategoryStyle } from '../data/utils';

const DayPlanningCard = ({ location, onRemove, onViewDetails, timeSlot }) => {
    // Helper functie voor tijd badge kleur
    const getTimeSlotColor = (slot) => {
        const colors = {
            morning: 'bg-amber-100 text-amber-800',
            afternoon: 'bg-orange-100 text-orange-800', 
            evening: 'bg-indigo-100 text-indigo-800'
        };
        return colors[slot] || 'bg-slate-100 text-slate-800';
    };

    // Helper functie voor tijd label
    const getTimeSlotLabel = (slot) => {
        const labels = {
            morning: 'Ochtend',
            afternoon: 'Middag',
            evening: 'Avond'
        };
        return labels[slot] || slot;
    };

    // Truncate description voor card weergave
    const truncatedDescription = location.beschrijving.length > 100 
        ? `${location.beschrijving.substring(0, 100)}...` 
        : location.beschrijving;

    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getCategoryStyle(location.categorie)}`}>
                        {location.categorie}
                    </span>
                    
                    {/* Time Slot Badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeSlotColor(timeSlot)}`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {getTimeSlotLabel(timeSlot)}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onViewDetails}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Bekijk details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onRemove}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Verwijder uit planning"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Location Title */}
            <h4 className="font-bold text-slate-800 mb-2 text-lg cursor-pointer hover:text-blue-600 transition-colors"
                onClick={onViewDetails}
            >
                {location.naam}
            </h4>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-3 line-height-relaxed">
                {truncatedDescription}
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                {/* Locatie */}
                <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{location.adres.split(',')[0]}</span>
                </div>

                {/* Prijs */}
                <div className="flex items-center gap-1 text-emerald-600">
                    <Euro className="w-3 h-3" />
                    <span className="truncate">{location.prijsindicatie.split(',')[0]}</span>
                </div>

                {/* Reistijd Auto */}
                {location.reistijd_auto && (
                    <div className="flex items-center gap-1 text-slate-500">
                        <Car className="w-3 h-3" />
                        <span>{location.reistijd_auto}</span>
                    </div>
                )}

                {/* Reistijd Fiets */}
                {location.reistijd_fiets && (
                    <div className="flex items-center gap-1 text-slate-500">
                        <Bike className="w-3 h-3" />
                        <span>{location.reistijd_fiets}</span>
                    </div>
                )}
            </div>

            {/* Openingstijden - indien beschikbaar */}
            {location.openingstijden && location.openingstijden !== 'altijd toegankelijk' && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="truncate">{location.openingstijden}</span>
                    </div>
                </div>
            )}

            {/* Added timestamp - subtiel */}
            {location.addedAt && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-400">
                        Toegevoegd: {new Date(location.addedAt).toLocaleString('nl-NL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DayPlanningCard;