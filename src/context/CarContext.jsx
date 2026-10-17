import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { initialCars } from '../data/cars';

const CarContext = createContext(null);

export function CarProvider({ children, initialData = initialCars }) {
  const [cars, setCars] = useState(initialData);
  const nextId = useRef(initialData.reduce((max, c) => Math.max(max, c.id), 0) + 1);

  const addCar = useCallback((car) => {
    const created = { ...car, id: nextId.current++ };
    setCars((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCar = useCallback((id, changes) => {
    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes, id } : c)));
  }, []);

  const deleteCar = useCallback((id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCar = useCallback((id) => cars.find((c) => c.id === id), [cars]);

  const value = useMemo(
    () => ({ cars, addCar, updateCar, deleteCar, getCar }),
    [cars, addCar, updateCar, deleteCar, getCar],
  );

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
}

export function useCars() {
  const ctx = useContext(CarContext);
  if (!ctx) {
    throw new Error('useCars must be used inside a CarProvider');
  }
  return ctx;
}
