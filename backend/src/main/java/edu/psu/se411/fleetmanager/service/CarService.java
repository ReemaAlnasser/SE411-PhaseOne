package edu.psu.se411.fleetmanager.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import edu.psu.se411.fleetmanager.exceptions.CarNotFoundException;
import edu.psu.se411.fleetmanager.exceptions.DuplicatePlateException;
import edu.psu.se411.fleetmanager.model.Car;
import edu.psu.se411.fleetmanager.model.CarRepository;

@Service
public class CarService {

	private final CarRepository carRepository;

	// Spring gives us the repository (dependency injection through the constructor).
	public CarService(CarRepository carRepository) {
		this.carRepository = carRepository;
	}

	// Add a new car. The id is null so the database generates it.
	public Car add(Car car) {
		if (carRepository.findByPlateNumber(car.plateNumber()).isPresent()) {
			throw new DuplicatePlateException(car.plateNumber());
		}
		Car newCar = new Car(null, car.make(), car.model(), car.year(), car.plateNumber(),
				car.color(), car.fuelType(), car.mileage(), car.status());
		return carRepository.save(newCar);
	}

	// Search a car by its id.
	public Car findById(Long id) {
		return carRepository.findById(id).orElseThrow(() -> new CarNotFoundException(id));
	}

	// Get one page of cars, sorted by id. page starts at 0.
	public Page<Car> findAll(int page, int size) {
		return carRepository.findAll(PageRequest.of(page, size, Sort.by("id")));
	}

	// Update an existing car with new values.
	public Car update(Long id, Car car) {
		if (!carRepository.existsById(id)) {
			throw new CarNotFoundException(id);
		}
		Optional<Car> carWithSamePlate = carRepository.findByPlateNumber(car.plateNumber());
		if (carWithSamePlate.isPresent() && !carWithSamePlate.get().id().equals(id)) {
			throw new DuplicatePlateException(car.plateNumber());
		}
		Car updatedCar = new Car(id, car.make(), car.model(), car.year(), car.plateNumber(),
				car.color(), car.fuelType(), car.mileage(), car.status());
		return carRepository.save(updatedCar);
	}

	// Delete a car (used by the Delete button that already exists in the frontend).
	public void delete(Long id) {
		if (!carRepository.existsById(id)) {
			throw new CarNotFoundException(id);
		}
		carRepository.deleteById(id);
	}
}
