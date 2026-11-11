// All calls to the Spring Boot backend are in this file.
const API_URL = 'http://localhost:8080/api/v1/cars';

// GET /api/v1/cars?page=0&size=5 -> one page of cars
export async function getCars(page, size) {
  const response = await fetch(`${API_URL}?page=${page}&size=${size}`);
  if (!response.ok) throw new Error('Could not load the cars.');
  return response.json();
}

// GET /api/v1/cars/{id} -> one car, or null if it does not exist
export async function getCar(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Could not load the car.');
  return response.json();
}

// POST /api/v1/cars -> add a car
export async function addCar(car) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  if (response.status === 400) throw new Error('Another car already uses this plate number.');
  if (!response.ok) throw new Error('Could not add the car.');
}

// PUT /api/v1/cars/{id} -> update a car
export async function updateCar(id, car) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  if (response.status === 400) throw new Error('Another car already uses this plate number.');
  if (response.status === 404) throw new Error('Car not found.');
  if (!response.ok) throw new Error('Could not update the car.');
}

// DELETE /api/v1/cars/{id} -> delete a car
export async function deleteCar(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Could not delete the car.');
}
