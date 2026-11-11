import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../test/renderWithProviders';
import * as api from '../api/carApi';

// The backend is replaced by a fake in-memory list, so these tests run without Spring.
vi.mock('../api/carApi');

const makeCars = () => [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2022, plateNumber: 'ABC 1234', color: 'White', fuelType: 'Petrol', mileage: 35000, status: 'Available' },
  { id: 2, make: 'Hyundai', model: 'Sonata', year: 2021, plateNumber: 'KSA 5521', color: 'Silver', fuelType: 'Petrol', mileage: 52000, status: 'In Use' },
  { id: 3, make: 'Ford', model: 'Explorer', year: 2020, plateNumber: 'RYD 9087', color: 'Black', fuelType: 'Petrol', mileage: 78000, status: 'Maintenance' },
  { id: 4, make: 'Toyota', model: 'Prius', year: 2023, plateNumber: 'HYB 3300', color: 'Blue', fuelType: 'Hybrid', mileage: 12000, status: 'Available' },
  { id: 5, make: 'Nissan', model: 'Patrol', year: 2019, plateNumber: 'NSN 7712', color: 'Grey', fuelType: 'Petrol', mileage: 110000, status: 'In Use' },
  { id: 6, make: 'Kia', model: 'Sportage', year: 2024, plateNumber: 'KIA 2024', color: 'Green', fuelType: 'Petrol', mileage: 5000, status: 'Available' },
];

let cars;

beforeEach(() => {
  cars = makeCars();
  api.getCars.mockImplementation(async (page, size) => ({
    content: cars.slice(page * size, page * size + size),
    page: { number: page, size, totalElements: cars.length, totalPages: Math.ceil(cars.length / size) },
  }));
  api.getCar.mockImplementation(async (id) => cars.find((c) => c.id === Number(id)) ?? null);
  api.addCar.mockImplementation(async (car) => {
    if (cars.some((c) => c.plateNumber === car.plateNumber)) {
      throw new Error('Another car already uses this plate number.');
    }
    cars.push({ ...car, id: cars.length + 1 });
  });
  api.updateCar.mockImplementation(async (id, car) => {
    cars = cars.map((c) => (c.id === id ? { ...car, id } : c));
  });
  api.deleteCar.mockImplementation(async (id) => {
    cars = cars.filter((c) => c.id !== id);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const rowFor = async (text) => (await screen.findByText(text)).closest('tr');

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
    expect(screen.getByText('Sarah Almuhaini')).toBeInTheDocument();
    expect(screen.getByText('Aljoharah Alqahtani')).toBeInTheDocument();
  });

  it('shows a not-found page for unknown routes', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});

describe('Car list with pagination', () => {
  it('shows the first page of cars from the backend', async () => {
    renderApp();
    expect(await screen.findByText('ABC 1234')).toBeInTheDocument();
    expect(screen.getByText('6 cars in the fleet')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.queryByText('KIA 2024')).not.toBeInTheDocument();
    expect(api.getCars).toHaveBeenCalledWith(0, 5);
  });

  it('moves to the next page', async () => {
    renderApp();
    await screen.findByText('ABC 1234');
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('KIA 2024')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(api.getCars).toHaveBeenCalledWith(1, 5);
  });
});

describe('Car management', () => {
  it('searches a car by id', async () => {
    renderApp();
    await screen.findByText('ABC 1234');
    await userEvent.type(screen.getByLabelText('Car ID'), '3');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('heading', { name: 'Ford Explorer' })).toBeInTheDocument();
  });

  it('shows "Car not found" for an unknown id', async () => {
    renderApp('/cars/999');
    expect(await screen.findByRole('heading', { name: 'Car not found' })).toBeInTheDocument();
  });

  it('adds a new car', async () => {
    renderApp('/cars/new');
    await userEvent.type(screen.getByLabelText('Make'), 'Lucid');
    await userEvent.type(screen.getByLabelText('Model'), 'Air');
    await userEvent.type(screen.getByLabelText('Year'), '2025');
    await userEvent.type(screen.getByLabelText('Plate Number'), 'EV 1001');
    await userEvent.type(screen.getByLabelText('Color'), 'White');
    await userEvent.type(screen.getByLabelText('Mileage (km)'), '500');
    await userEvent.click(screen.getByRole('button', { name: 'Add Car' }));

    expect(await screen.findByText('7 cars in the fleet')).toBeInTheDocument();
    expect(api.addCar).toHaveBeenCalledWith(expect.objectContaining({ plateNumber: 'EV 1001' }));
  });

  it('shows the backend error when the plate number is already used', async () => {
    renderApp('/cars/new');
    await userEvent.type(screen.getByLabelText('Make'), 'Toyota');
    await userEvent.type(screen.getByLabelText('Model'), 'Camry');
    await userEvent.type(screen.getByLabelText('Year'), '2022');
    await userEvent.type(screen.getByLabelText('Plate Number'), 'abc 1234');
    await userEvent.type(screen.getByLabelText('Color'), 'White');
    await userEvent.type(screen.getByLabelText('Mileage (km)'), '100');
    await userEvent.click(screen.getByRole('button', { name: 'Add Car' }));

    expect(await screen.findByText('Another car already uses this plate number.')).toBeInTheDocument();
  });

  it('updates an existing car', async () => {
    renderApp();
    await userEvent.click(within(await rowFor('ABC 1234')).getByRole('link', { name: 'Edit' }));
    const color = await screen.findByLabelText('Color');
    await userEvent.clear(color);
    await userEvent.type(color, 'Pearl White');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Maintenance');
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    const row = await rowFor('ABC 1234');
    expect(within(row).getByText('Pearl White')).toBeInTheDocument();
    expect(api.updateCar).toHaveBeenCalledWith(1, expect.objectContaining({ color: 'Pearl White', status: 'Maintenance' }));
  });

  it('deletes a car after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderApp();
    await userEvent.click(within(await rowFor('ABC 1234')).getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText('5 cars in the fleet')).toBeInTheDocument();
    expect(api.deleteCar).toHaveBeenCalledWith(1);
  });

  it('keeps the car when deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderApp();
    await userEvent.click(within(await rowFor('ABC 1234')).getByRole('button', { name: 'Delete' }));
    expect(api.deleteCar).not.toHaveBeenCalled();
    expect(screen.getByText('ABC 1234')).toBeInTheDocument();
  });
});
