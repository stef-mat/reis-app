import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'vakantie-planning';
const PlanningContext = createContext();

export const PlanningProvider = ({ children }) => {
    const [planning, setPlanning] = useState(() => {
        if (typeof window === 'undefined') return {};
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Error loading planning from localStorage:', error);
            return {};
        }
    });

    // Sync naar localStorage bij elke planning update
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(planning));
        } catch (error) {
            console.warn('Error saving planning to localStorage:', error);
        }
    }, [planning]);

    // Voeg locatie toe aan een specifieke dag
    const addToDay = (date, location, timeSlot = 'morning') => {
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        setPlanning(prev => ({
            ...prev,
            [dateKey]: {
                ...prev[dateKey],
                [timeSlot]: [
                    ...(prev[dateKey]?.[timeSlot] || []),
                    {
                        ...location,
                        addedAt: new Date().toISOString(),
                        id: `${location.naam}-${Date.now()}`
                    }
                ]
            }
        }));
    };

    // Verwijder locatie van een dag
    const removeFromDay = (date, locationId, timeSlot) => {
        const dateKey = date.toISOString().split('T')[0];
        
        setPlanning(prev => ({
            ...prev,
            [dateKey]: {
                ...prev[dateKey],
                [timeSlot]: prev[dateKey]?.[timeSlot]?.filter(loc => loc.id !== locationId) || []
            }
        }));
    };

    // Verplaats locatie tussen tijdsloten of dagen
    const moveLocation = (fromDate, toDate, locationId, fromTimeSlot, toTimeSlot) => {
        const fromDateKey = fromDate.toISOString().split('T')[0];
        const toDateKey = toDate.toISOString().split('T')[0];
        
        setPlanning(prev => {
            const location = prev[fromDateKey]?.[fromTimeSlot]?.find(loc => loc.id === locationId);
            if (!location) return prev;

            // Remove from source
            const newPlanning = {
                ...prev,
                [fromDateKey]: {
                    ...prev[fromDateKey],
                    [fromTimeSlot]: prev[fromDateKey]?.[fromTimeSlot]?.filter(loc => loc.id !== locationId) || []
                }
            };

            // Add to destination
            newPlanning[toDateKey] = {
                ...newPlanning[toDateKey],
                [toTimeSlot]: [
                    ...(newPlanning[toDateKey]?.[toTimeSlot] || []),
                    location
                ]
            };

            return newPlanning;
        });
    };

    // Haal planning op voor een specifieke dag
    const getDayPlanning = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        return planning[dateKey] || { morning: [], afternoon: [], evening: [] };
    };

    // Haal alle geplande dagen op
    const getPlannedDays = () => {
        return Object.keys(planning)
            .filter(dateKey => {
                const dayPlan = planning[dateKey];
                return dayPlan.morning?.length > 0 || dayPlan.afternoon?.length > 0 || dayPlan.evening?.length > 0;
            })
            .sort()
            .map(dateKey => new Date(dateKey));
    };

    // Check of locatie al gepland is
    const isLocationPlanned = (locationName) => {
        return Object.values(planning).some(dayPlan =>
            Object.values(dayPlan).some(timeSlot =>
                timeSlot?.some(loc => loc.naam === locationName)
            )
        );
    };

    // Wis alle planning
    const clearAllPlanning = () => {
        setPlanning({});
    };

    // Wis planning voor een specifieke dag
    const clearDayPlanning = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        setPlanning(prev => {
            const newPlanning = { ...prev };
            delete newPlanning[dateKey];
            return newPlanning;
        });
    };

    // Tel totaal aantal geplande activiteiten
    const getTotalPlannedCount = () => {
        return Object.values(planning).reduce((total, dayPlan) => {
            return total + Object.values(dayPlan).reduce((dayTotal, timeSlot) => {
                return dayTotal + (timeSlot?.length || 0);
            }, 0);
        }, 0);
    };

    const value = {
        planning,
        addToDay,
        removeFromDay,
        moveLocation,
        getDayPlanning,
        getPlannedDays,
        isLocationPlanned,
        clearAllPlanning,
        clearDayPlanning,
        getTotalPlannedCount
    };

    return (
        <PlanningContext.Provider value={value}>
            {children}
        </PlanningContext.Provider>
    );
};

// Custom hook met error handling
export const usePlanning = () => {
    const context = useContext(PlanningContext);
    
    if (context === undefined) {
        throw new Error('usePlanning must be used within a PlanningProvider');
    }
    
    return context;
};

// Export context voor debugging/testing
export { PlanningContext };