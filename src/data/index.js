// Dit bestand is nu alleen nog voor het samenvoegen en exporteren van data.
import doenData from './doen.json';
import etenData from './eten.json';

// Combineer de twee arrays tot één grote lijst
export const locaties = [...doenData, ...etenData];