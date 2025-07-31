import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'completedActivities';
const CompletedContext = createContext();

export const CompletedProvider = ({ children }) => {
    // State met localStorage persistence
    const [completed, setCompleted] = useState(() => {
        if (typeof window === 'undefined') return new Map();
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                return new Map(data);
            }
            return new Map();
        } catch (error) {
            console.warn('Error loading completed activities from localStorage:', error);
            return new Map();
        }
    });

    // Sync naar localStorage bij elke completed update
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
        } catch (error) {
            console.warn('Error saving completed activities to localStorage:', error);
        }
    }, [completed]);

    // Mark activity as completed
    const markAsCompleted = (locationName, completedDate = new Date()) => {
        setCompleted(prev => {
            const newMap = new Map(prev);
            newMap.set(locationName, {
                completedAt: completedDate.toISOString(),
                name: locationName
            });
            return newMap;
        });
    };

    // Mark activity as incomplete
    const markAsIncomplete = (locationName) => {
        setCompleted(prev => {
            const newMap = new Map(prev);
            newMap.delete(locationName);
            return newMap;
        });
    };

    // Toggle completion status
    const toggleCompleted = (locationName, completedDate) => {
        if (completed.has(locationName)) {
            markAsIncomplete(locationName);
        } else {
            markAsCompleted(locationName, completedDate);
        }
    };

    // Check if activity is completed
    const isCompleted = (locationName) => {
        return completed.has(locationName);
    };

    // Get completion date for activity
    const getCompletedDate = (locationName) => {
        const entry = completed.get(locationName);
        return entry ? new Date(entry.completedAt) : null;
    };

    // Get completed activities as sorted array
    const completedActivities = useMemo(() => {
        return Array.from(completed.values()).sort((a, b) => 
            new Date(b.completedAt) - new Date(a.completedAt)
        );
    }, [completed]);

    // Get completed activities grouped by date
    const completedByDate = useMemo(() => {
        const grouped = {};
        completed.forEach((activity) => {
            const date = new Date(activity.completedAt).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(activity);
        });
        
        // Sort each day's activities
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => 
                new Date(b.completedAt) - new Date(a.completedAt)
            );
        });
        
        return grouped;
    }, [completed]);

    // Clear all completed activities
    const clearAllCompleted = () => {
        setCompleted(new Map());
    };

    // Bulk operations
    const addMultipleCompleted = (activities) => {
        setCompleted(prev => {
            const newMap = new Map(prev);
            activities.forEach(({ name, date }) => {
                newMap.set(name, {
                    completedAt: (date || new Date()).toISOString(),
                    name
                });
            });
            return newMap;
        });
    };

    // Count completed activities
    const completedCount = useMemo(() => completed.size, [completed]);

    // Context value
    const value = {
        completed,
        completedActivities,
        completedByDate,
        completedCount,
        markAsCompleted,
        markAsIncomplete,
        toggleCompleted,
        isCompleted,
        getCompletedDate,
        clearAllCompleted,
        addMultipleCompleted
    };

    return (
        <CompletedContext.Provider value={value}>
            {children}
        </CompletedContext.Provider>
    );
};

// Custom hook met error handling
export const useCompleted = () => {
    const context = useContext(CompletedContext);
    
    if (context === undefined) {
        throw new Error('useCompleted must be used within a CompletedProvider');
    }
    
    return context;
};

// Export context voor debugging/testing
export { CompletedContext };