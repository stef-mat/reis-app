// Dit bestand is nu alleen nog voor het samenvoegen en exporteren van data.
import doenData from './doen.json';
import etenData from './eten.json';
import animatieData from './animatieprogramma.json';

// Combineer alle arrays en filter duplicates op naam
const combinedData = [...doenData, ...etenData, ...animatieData];
export const locaties = combinedData.filter((location, index, self) => 
    index === self.findIndex(l => l.naam === location.naam)
);

// Export ook de aparte datasets voor specifieke filters
export { doenData, etenData, animatieData };
