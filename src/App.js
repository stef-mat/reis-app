import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LocationsPage from './pages/LocationsPage';
import PlanningPage from './pages/PlanningPage';
import AnimatiePage from './pages/AnimatiePage';
import CompletedPage from './pages/CompletedPage';
import { HiddenLocationsProvider } from './context/HiddenLocationsContext';
import { PlanningProvider } from './context/PlanningContext';
import { APP_CONFIG } from './config';

const App = () => {
    const [pageState, setPageState] = useState({ page: 'landing', filters: [] });

    const renderPage = () => {
        switch (pageState.page) {
            case 'landing': 
                return <LandingPage setPageState={setPageState} />;
            case 'locations': 
                return (
                    <LocationsPage 
                        setPageState={setPageState} 
                        initialFilters={pageState.filters}
                        showFavorites={pageState.showFavorites}
                    />
                );
            case 'completed':
    return <CompletedPage setPageState={setPageState} />;
                case 'planning':
                return <PlanningPage setPageState={setPageState} />;
            case 'animatie':
                return <AnimatiePage setPageState={setPageState} />;
            default: 
                return <LandingPage setPageState={setPageState} />;
        }
    };

    return (
        <HiddenLocationsProvider>
            <PlanningProvider>
                <main style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {renderPage()}
                </main>
            </PlanningProvider>
        </HiddenLocationsProvider>
    );
};

export default App;