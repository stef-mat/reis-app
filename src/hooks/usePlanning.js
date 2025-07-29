import { useContext } from 'react';
import { PlanningContext } from '../context/PlanningContext';

export const usePlanning = () => {
    const context = useContext(PlanningContext);
    
    if (context === undefined) {
        throw new Error('usePlanning must be used within a PlanningProvider');
    }
    
    return context;
};