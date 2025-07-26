import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LocationsPage from './pages/LocationsPage';
import { FavoritesProvider } from './context/FavoritesContext';
import { HiddenLocationsProvider } from './context/HiddenLocationsContext';

const App = () => {
    const [pageState, setPageState] = useState({ page: 'landing', filters: [] });

    const renderPage = () => {
        switch (pageState.page) {
            case 'landing': 
                return <LandingPage setPageState={setPageState} />;
            case 'locations': 
                return <LocationsPage setPageState={setPageState} initialFilters={pageState.filters} />;
            default: 
                return <LandingPage setPageState={setPageState} />;
        }
    };

    const GlobalStyles = () => (
        <style jsx global>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slide-up { from { transform: translateY(20px); opacity: 0.8; } to { transform: translateY(0); opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        `}</style>
    );

    return (
        <FavoritesProvider>
            <HiddenLocationsProvider>
                <main style={{ fontFamily: "'Nunito', sans-serif" }}>
                    <GlobalStyles />
                    {renderPage()}
                </main>
            </HiddenLocationsProvider>
        </FavoritesProvider>
    );
};

export default App;
