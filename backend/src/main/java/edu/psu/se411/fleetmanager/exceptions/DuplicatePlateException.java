package edu.psu.se411.fleetmanager.exceptions;

public class DuplicatePlateException extends RuntimeException {

	public DuplicatePlateException(String plateNumber) {
		super("Another car already uses the plate number " + plateNumber);
	}
}
