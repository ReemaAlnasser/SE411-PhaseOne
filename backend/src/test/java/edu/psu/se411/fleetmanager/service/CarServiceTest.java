package edu.psu.se411.fleetmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import edu.psu.se411.fleetmanager.exceptions.CarNotFoundException;
import edu.psu.se411.fleetmanager.exceptions.DuplicatePlateException;
import edu.psu.se411.fleetmanager.model.Car;
import edu.psu.se411.fleetmanager.model.CarRepository;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

	@Mock
	private CarRepository carRepository; // fake repository, no database

	@InjectMocks
	private CarService carService; // the real service, using the fake repository

	private Car camry = new Car(1L, "Toyota", "Camry", 2022, "ABC 1234", "White", "Petrol", 35000, "Available");

	@Test
	@DisplayName("add saves a new car and returns it with an id")
	void addSavesCar() {
		Car newCar = new Car(null, "Toyota", "Camry", 2022, "ABC 1234", "White", "Petrol", 35000, "Available");
		when(carRepository.findByPlateNumber("ABC 1234")).thenReturn(Optional.empty());
		when(carRepository.save(any(Car.class))).thenReturn(camry);

		Car result = carService.add(newCar);

		assertEquals(1L, result.id());
		verify(carRepository).save(any(Car.class));
	}

	@Test
	@DisplayName("add throws when the plate number is already used")
	void addDuplicatePlate() {
		when(carRepository.findByPlateNumber("ABC 1234")).thenReturn(Optional.of(camry));

		assertThrows(DuplicatePlateException.class, () -> carService.add(camry));
		verify(carRepository, never()).save(any(Car.class));
	}

	@Test
	@DisplayName("findById returns the car when it exists")
	void findByIdFound() {
		when(carRepository.findById(1L)).thenReturn(Optional.of(camry));

		Car result = carService.findById(1L);

		assertEquals("Camry", result.model());
	}

	@Test
	@DisplayName("findById throws when the car does not exist")
	void findByIdNotFound() {
		when(carRepository.findById(99L)).thenReturn(Optional.empty());

		assertThrows(CarNotFoundException.class, () -> carService.findById(99L));
	}

	@Test
	@DisplayName("findAll returns one page of cars")
	void findAllReturnsPage() {
		Page<Car> page = new PageImpl<>(List.of(camry));
		when(carRepository.findAll(any(Pageable.class))).thenReturn(page);

		Page<Car> result = carService.findAll(0, 5);

		assertEquals(1, result.getContent().size());
		assertEquals("ABC 1234", result.getContent().get(0).plateNumber());
	}

	@Test
	@DisplayName("update saves the new values and keeps the same id")
	void updateSavesCar() {
		Car changes = new Car(null, "Toyota", "Camry", 2022, "ABC 1234", "Pearl White", "Petrol", 36000, "In Use");
		when(carRepository.existsById(1L)).thenReturn(true);
		when(carRepository.findByPlateNumber("ABC 1234")).thenReturn(Optional.of(camry)); // same car, so allowed
		when(carRepository.save(any(Car.class))).thenAnswer(call -> call.getArgument(0));

		Car result = carService.update(1L, changes);

		assertEquals(1L, result.id());
		assertEquals("Pearl White", result.color());
		assertEquals("In Use", result.status());
	}

	@Test
	@DisplayName("update throws when the car does not exist")
	void updateNotFound() {
		when(carRepository.existsById(99L)).thenReturn(false);

		assertThrows(CarNotFoundException.class, () -> carService.update(99L, camry));
		verify(carRepository, never()).save(any(Car.class));
	}

	@Test
	@DisplayName("update throws when another car uses the plate number")
	void updateDuplicatePlate() {
		Car otherCar = new Car(2L, "Kia", "Rio", 2020, "ABC 1234", "Red", "Petrol", 2000, "Available");
		when(carRepository.existsById(1L)).thenReturn(true);
		when(carRepository.findByPlateNumber("ABC 1234")).thenReturn(Optional.of(otherCar));

		assertThrows(DuplicatePlateException.class, () -> carService.update(1L, camry));
	}

	@Test
	@DisplayName("delete removes an existing car")
	void deleteCar() {
		when(carRepository.existsById(1L)).thenReturn(true);

		carService.delete(1L);

		verify(carRepository).deleteById(1L);
	}

	@Test
	@DisplayName("delete throws when the car does not exist")
	void deleteNotFound() {
		when(carRepository.existsById(99L)).thenReturn(false);

		assertThrows(CarNotFoundException.class, () -> carService.delete(99L));
		verify(carRepository, never()).deleteById(any());
	}
}
