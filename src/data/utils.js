// Hier komen alle hulpfuncties die componenten nodig hebben.
export const getCategoryStyle = (category) => {
    const styles = {
        'Bezienswaardigheden': 'bg-sky-100 text-sky-800 border-sky-200',
        'Attracties': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Wandelroutes': 'bg-amber-100 text-amber-800 border-amber-200',
        'Leuke Horeca': 'bg-rose-100 text-rose-800 border-rose-200',
        'Leuke Restaurants': 'bg-purple-100 text-purple-800 border-purple-200',
        'Lokale retail': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Lokale Brouwerijen': 'bg-orange-100 text-orange-800 border-orange-200',
        'Evenementen': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return styles[category] || 'bg-slate-100 text-slate-800 border-slate-200';
};

export const getGoogleMapsUrl = (gps_coordinaten, naam) => {
    if (gps_coordinaten && gps_coordinaten !== "Niet expliciet vermeld") {
        const coords = gps_coordinaten.replace(/[°NSEO\s]/g, '');
        return `https://www.google.com/maps/search/?api=1&query=${coords}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(naam)}`;
};