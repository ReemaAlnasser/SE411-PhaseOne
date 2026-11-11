package edu.psu.se411.fleetmanager.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;

import edu.psu.se411.fleetmanager.exceptions.CarNotFoundException;
import edu.psu.se411.fleetmanager.exceptions.DuplicatePlateException;
import edu.psu.se411.fleetmanager.model.Car;
import edu.psu.se411.fleetmanager.service.CarService;

@ExtendWith(MockitoExtension.class)
class CarControllerTest {

	@Mock
	private CarService carService; // fake service

	@InjectMocks
	private CarController carController; // the real controller, using the fake service

	private Car camry = new Car(1L, "Toyota", "Camry", 2022, "ABC 1234", "White", "Petrol", 35000, "Available");

	@Test
	@DisplayName("POST returns 201 and the location of the new car")
	void addReturns201() {
		when(carService.add(any(Car.class))).thenReturn(camry);

		ResponseEntity<Car> response = carController.add(camry);

		assertEquals(201, response.getStatusCode().value());
		assertEquals("/api/v1/cars/1", response.getHeaders().getLocation().toString());
		assertEquals(camry, response.getBody());
	}

	@Test
	@DisplayName("POST returns 400 when the plate number is already used")
	void addReturns400() {
		when(carService.add(any(Car.class))).thenThrow(new DuplicatePlateException("ABC 1234"));

		ResponseEntity<Car> response = carController.add(camry);

		assertEquals(400, response.getStatusCode().value());
	}

	@Test
	@DisplayName("GET by id returns 200 and the car")
	void findByIdReturns200() {
		when(carService.findById(1L)).thenReturn(camry);

		ResponseEntity<Car> response = carController.findById(1L);

		assertEquals(200, response.getStatusCode().value());
		assertEquals("Camry", response.getBody().model());
	}

	@Test
	@DisplayName("GET by id returns 404 when the car does not exist")
	void findByIdReturns404() {
		when(carService.findById(99L)).thenThrow(new CarNotFoundException(99L));

		ResponseEntity<Car> response = carController.findById(99L);

		assertEquals(404, response.getStatusCode().value());
	}

	@Test
	@DisplayName("GET all returns 200 and the requested page")
	void findAllReturnsPage() {
		Page<Car> page = new PageImpl<>(List.of(camry));
		when(carService.findAll(0, 5)).thenReturn(page);

		ResponseEntity<Page<Car>> response = carController.findAll(0, 5);

		assertEquals(200, response.getStatusCode().value());
		assertEquals(1, response.getBody().getContent().size());
		verify(carService).findAll(0, 5);
	}

	@Test
	@DisplayName("PUT returns 204 when the update works")
	void updateReturns204() {
		when(carService.update(1L, camry)).thenReturn(camry);

		ResponseEntity<Void> response = carController.update(1L, camry);

		assertEquals(204, response.getStatusCode().value());
	}

	@Test
	@DisplayName("PUT returns 404 when the car does not exist")
	void updateReturns404() {
		when(carService.update(99L, camry)).thenThrow(new CarNotFoundException(99L));

		ResponseEntity<Void> response = carController.update(99L, camry);

		assertEquals(404, response.getStatusCode().value());
	}

	@Test
	@DisplayName("PUT returns 400 when another car uses the plate number")
	void updateReturns400() {
		when(carService.update(1L, camry)).thenThrow(new DuplicatePlateException("ABC 1234"));

		ResponseEntity<Void> response = carController.update(1L, camry);

		assertEquals(400, response.getStatusCode().value());
	}

	@Test
	@DisplayName("DELETE returns 204 when the car is deleted")
	void deleteReturns204() {
		ResponseEntity<Void> response = carController.delete(1L);

		assertEquals(204, response.getStatusCode().value());
		verify(carService).delete(1L);
	}

	@Test
	@DisplayName("DELETE returns 404 when the car does not exist")
	void deleteReturns404() {
		doThrow(new CarNotFoundException(99L)).when(carService).delete(99L);

		ResponseEntity<Void> response = carController.delete(99L);

		assertEquals(404, response.getStatusCode().value());
	}
}
