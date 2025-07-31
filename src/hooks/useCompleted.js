import { useState, useMemo, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'completedActivities';

export const useCompleted = () => {
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
            console.warn('Error loading completed activities:', error);
            return new Map();
        }
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
        } catch (error) {
            console.warn('Error saving completed activities:', error);
        }
    }, [completed]);

    const markAsCompleted = useCallback((locationName, completedDate = new Date()) => {
        setCompleted(prev => {
            const newMap = new Map(prev);
            newMap.set(locationName, {
                completedAt: completedDate.toISOString(),
                name: locationName
            });
            return newMap;
        });
    }, []);

    const toggleCompleted = useCallback((locationName, completedDate) => {
        if (completed.has(locationName)) {
            setCompleted(prev => {
                const newMap = new Map(prev);
                newMap.delete(locationName);
                return newMap;
            });
        } else {
            markAsCompleted(locationName, completedDate);
        }
    }, [completed, markAsCompleted]);

    const isCompleted = useCallback((locationName) => {
        return completed.has(locationName);
    }, [completed]);

    const completedActivities = useMemo(() => {
        return Array.from(completed.values()).sort((a, b) => 
            new Date(b.completedAt) - new Date(a.completedAt)
        );
    }, [completed]);

    return {
        completed,
        completedActivities,
        markAsCompleted,
        toggleCompleted,
        isCompleted
    };
};