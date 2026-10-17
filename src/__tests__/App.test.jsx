import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../test/renderWithProviders';

afterEach(() => {
  vi.restoreAllMocks();
});

const rowFor = (text) => screen.getByText(text).closest('tr');

describe('Navigation menu', () => {
  it('shows the menu with every feature', () => {
    renderApp();
    const menu = screen.getByRole('navigation', { name: 'Main menu' });
    expect(within(menu).getByRole('link', { name: 'Cars' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'Add Car' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('opens the About page with all team members', async () => {
    renderApp();
    const menu = screen.getByRole('navigation', { name: 'Main menu' });
    await userEvent.click(within(menu).getByRole('link', { name: 'About' }));
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByText('Reema Alnasser')).toBeInTheDocument();
    expect(screen.getByText('223410003')).toBeInTheDocument();
    expect(screen.getByText('Sarah Almuhaini')).toBeInTheDocument();
    expect(screen.getByText('222511391')).toBeInTheDocument();
    expect(screen.getByText('Aljoharah Alqahtani')).toBeInTheDocument();
    expect(screen.getByText('221511429')).toBeInTheDocument();
  });

  it('shows a not-found page for unknown routes', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});

describe('Car management (CRUD)', () => {
  it('displays the initial cars', () => {
    renderApp();
    expect(screen.getByText('ABC 1234')).toBeInTheDocument();
    expect(screen.getByText('5 cars in the fleet')).toBeInTheDocument();
  });

  it('adds a new car', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('link', { name: '+ Add Car' }));
    await userEvent.type(screen.getByLabelText('Make'), 'Kia');
    await userEvent.type(screen.getByLabelText('Model'), 'Sportage');
    await userEvent.type(screen.getByLabelText('Year'), '2024');
    await userEvent.type(screen.getByLabelText('Plate Number'), 'KIA 2024');
    await userEvent.type(screen.getByLabelText('Color'), 'Green');
    await userEvent.type(screen.getByLabelText('Mileage (km)'), '500');
    await userEvent.click(screen.getByRole('button', { name: 'Add Car' }));

    expect(screen.getByRole('heading', { name: 'Cars' })).toBeInTheDocument();
    expect(screen.getByText('KIA 2024')).toBeInTheDocument();
    expect(screen.getByText('6 cars in the fleet')).toBeInTheDocument();
  });

  it('updates an existing car', async () => {
    renderApp();
    await userEvent.click(within(rowFor('ABC 1234')).getByRole('link', { name: 'Edit' }));
    const color = screen.getByLabelText('Color');
    await userEvent.clear(color);
    await userEvent.type(color, 'Pearl White');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Maintenance');
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    const row = rowFor('ABC 1234');
    expect(within(row).getByText('Pearl White')).toBeInTheDocument();
    expect(within(row).getByText('Maintenance')).toBeInTheDocument();
  });

  it('deletes a car after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderApp();
    await userEvent.click(within(rowFor('ABC 1234')).getByRole('button', { name: 'Delete' }));
    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText('ABC 1234')).not.toBeInTheDocument();
    expect(screen.getByText('4 cars in the fleet')).toBeInTheDocument();
  });

  it('keeps the car when deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderApp();
    await userEvent.click(within(rowFor('ABC 1234')).getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('ABC 1234')).toBeInTheDocument();
  });

  it('shows the details page for a car', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('link', { name: 'Toyota Camry' }));
    expect(screen.getByRole('heading', { name: 'Toyota Camry' })).toBeInTheDocument();
    expect(screen.getByText('35,000 km')).toBeInTheDocument();
  });

  it('filters cars by search text and status', async () => {
    renderApp();
    await userEvent.type(screen.getByLabelText('Search cars'), 'toyota');
    expect(screen.getByText('ABC 1234')).toBeInTheDocument();
    expect(screen.getByText('HYB 3300')).toBeInTheDocument();
    expect(screen.queryByText('KSA 5521')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Filter by status'), 'Available');
    await userEvent.clear(screen.getByLabelText('Search cars'));
    await userEvent.type(screen.getByLabelText('Search cars'), 'zzz');
    expect(screen.getByText('No cars found.')).toBeInTheDocument();
  });

  it('shows "Car not found" when editing a missing id', () => {
    renderApp('/cars/999/edit');
    expect(screen.getByRole('heading', { name: 'Car not found' })).toBeInTheDocument();
  });
});
