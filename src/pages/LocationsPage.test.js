import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationsPage from './LocationsPage';
import { locaties } from '../data';
import { FavoritesProvider } from '../context/FavoritesContext';
import { HiddenLocationsProvider } from '../context/HiddenLocationsContext';
import { PlanningProvider } from '../context/PlanningContext';

beforeEach(() => {
    window.localStorage.clear();
});

test('hidden locations are removed and can be restored', async () => {
    render(
        <PlanningProvider>
            <FavoritesProvider>
                <HiddenLocationsProvider>
                    <LocationsPage setPageState={() => {}} initialFilters={[]} />
                </HiddenLocationsProvider>
            </FavoritesProvider>
        </PlanningProvider>
    );
    const name = locaties[0].naam;

    // Card should be visible initially
    expect(screen.getByText(name)).toBeInTheDocument();

    // open modal of first card
    userEvent.click(screen.getAllByText('Meer info')[0]);
    const hideBtn = await screen.findByText('Verberg');
    userEvent.click(hideBtn);

    expect(screen.queryByText(name)).not.toBeInTheDocument();

    userEvent.click(screen.getByText('Herstel verborgen'));
    expect(await screen.findByText(name)).toBeInTheDocument();
});

