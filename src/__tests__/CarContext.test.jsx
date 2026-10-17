import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CarProvider, useCars } from '../context/CarContext';

const seed = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2022, plateNumber: 'AAA 1111', color: 'White', fuelType: 'Petrol', mileage: 1000, status: 'Available' },
  { id: 2, make: 'Kia', model: 'Rio', year: 2020, plateNumber: 'BBB 2222', color: 'Red', fuelType: 'Petrol', mileage: 2000, status: 'In Use' },
];

const wrapper = ({ children }) => <CarProvider initialData={seed}>{children}</CarProvider>;

describe('CarContext', () => {
  it('exposes the initial cars', () => {
    const { result } = renderHook(() => useCars(), { wrapper });
    expect(result.current.cars).toHaveLength(2);
  });

  it('adds a car with a new unique id', () => {
    const { result } = renderHook(() => useCars(), { wrapper });
    let created;
    act(() => {
      created = result.current.addCar({ ...seed[0], plateNumber: 'CCC 3333' });
    });
    expect(created.id).toBe(3);
    expect(result.current.cars).toHaveLength(3);
    expect(result.current.getCar(3).plateNumber).toBe('CCC 3333');
  });

  it('updates a car without changing its id', () => {
    const { result } = renderHook(() => useCars(), { wrapper });
    act(() => {
      result.current.updateCar(2, { color: 'Blue', id: 99 });
    });
    expect(result.current.getCar(2).color).toBe('Blue');
    expect(result.current.getCar(99)).toBeUndefined();
  });

  it('deletes a car', () => {
    const { result } = renderHook(() => useCars(), { wrapper });
    act(() => {
      result.current.deleteCar(1);
    });
    expect(result.current.cars.map((c) => c.id)).toEqual([2]);
  });

  it('throws when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCars())).toThrow(/CarProvider/);
    console.error.mockRestore();
  });
});
