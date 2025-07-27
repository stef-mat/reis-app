// Dit bestand is nu alleen nog voor het samenvoegen en exporteren van data.
import doenData from './doen.json';
import etenData from './eten.json';

// Combineer de twee arrays en filter duplicates op naam
const combinedData = [...doenData, ...etenData];
export const locaties = combinedData.filter((location, index, self) => 
    index === self.findIndex(l => l.naam === location.naam)
);