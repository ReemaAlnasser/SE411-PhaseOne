package edu.psu.se411.fleetmanager.model;

import org.springframework.data.annotation.Id;

public record Car(
		@Id Long id,
		String make,
		String model,
		Integer year,
		String plateNumber,
		String color,
		String fuelType,
		Integer mileage,
		String status
) {}
