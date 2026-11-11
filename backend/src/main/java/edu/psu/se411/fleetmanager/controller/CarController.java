package edu.psu.se411.fleetmanager.controller;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.psu.se411.fleetmanager.exceptions.CarNotFoundException;
import edu.psu.se411.fleetmanager.exceptions.DuplicatePlateException;
import edu.psu.se411.fleetmanager.model.Car;
import edu.psu.se411.fleetmanager.service.CarService;

@RestController
@RequestMapping("/api/v1/cars")
@CrossOrigin(origins = "http://localhost:5173") // allow the React app (Vite) to call this API
public class CarController {

	private final CarService carService;

	public CarController(CarService carService) {
		this.carService = carService;
	}

	// POST /api/v1/cars -> add a car
	@PostMapping
	public ResponseEntity<Car> add(@RequestBody Car car) {
		try {
			Car savedCar = carService.add(car);
			URI location = URI.create("/api/v1/cars/" + savedCar.id());
			return ResponseEntity.created(location).body(savedCar); // 201
		} catch (DuplicatePlateException e) {
			return ResponseEntity.badRequest().build(); // 400
		}
	}

	// GET /api/v1/cars/{id} -> search a car by id
	@GetMapping("/{id}")
	public ResponseEntity<Car> findById(@PathVariable Long id) {
		try {
			return ResponseEntity.ok(carService.findById(id)); // 200
		} catch (CarNotFoundException e) {
			return ResponseEntity.notFound().build(); // 404
		}
	}

	// GET /api/v1/cars?page=0&size=5 -> all cars, one page at a time
	@GetMapping
	public ResponseEntity<Page<Car>> findAll(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size) {
		return ResponseEntity.ok(carService.findAll(page, size)); // 200
	}

	// PUT /api/v1/cars/{id} -> update a car
	@PutMapping("/{id}")
	public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody Car car) {
		try {
			carService.update(id, car);
			return ResponseEntity.noContent().build(); // 204
		} catch (CarNotFoundException e) {
			return ResponseEntity.notFound().build(); // 404
		} catch (DuplicatePlateException e) {
			return ResponseEntity.badRequest().build(); // 400
		}
	}

	// DELETE /api/v1/cars/{id} -> delete a car
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		try {
			carService.delete(id);
			return ResponseEntity.noContent().build(); // 204
		} catch (CarNotFoundException e) {
			return ResponseEntity.notFound().build(); // 404
		}
	}
}
