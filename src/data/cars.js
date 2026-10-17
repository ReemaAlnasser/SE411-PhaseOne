// Initial in-memory data set (Part 1: no database).
export const CAR_STATUSES = ['Available', 'In Use', 'Maintenance', 'Retired'];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

export const initialCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    plateNumber: 'ABC 1234',
    color: 'White',
    fuelType: 'Petrol',
    mileage: 35000,
    status: 'Available',
  },
  {
    id: 2,
    make: 'Hyundai',
    model: 'Sonata',
    year: 2021,
    plateNumber: 'KSA 5521',
    color: 'Silver',
    fuelType: 'Petrol',
    mileage: 52000,
    status: 'In Use',
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Explorer',
    year: 2020,
    plateNumber: 'RYD 9087',
    color: 'Black',
    fuelType: 'Petrol',
    mileage: 78000,
    status: 'Maintenance',
  },
  {
    id: 4,
    make: 'Toyota',
    model: 'Prius',
    year: 2023,
    plateNumber: 'HYB 3300',
    color: 'Blue',
    fuelType: 'Hybrid',
    mileage: 12000,
    status: 'Available',
  },
  {
    id: 5,
    make: 'Nissan',
    model: 'Patrol',
    year: 2019,
    plateNumber: 'NSN 7712',
    color: 'Grey',
    fuelType: 'Petrol',
    mileage: 110000,
    status: 'In Use',
  },
];
