import { useContext } from 'react';
import { HiddenLocationsContext } from '../context/HiddenLocationsContext';

export const useHiddenLocations = () => {
    return useContext(HiddenLocationsContext);
};
