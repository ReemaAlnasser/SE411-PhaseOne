package edu.psu.se411.fleetmanager.exceptions;

public class CarNotFoundException extends RuntimeException {

	public CarNotFoundException(Long id) {
		super("Car with id " + id + " was not found");
	}
}
