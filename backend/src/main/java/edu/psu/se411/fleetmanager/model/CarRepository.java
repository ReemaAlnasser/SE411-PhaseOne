package edu.psu.se411.fleetmanager.model;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

// Spring Data writes the code of this interface for us.
// ListCrudRepository gives: save, findById, existsById, deleteById ...
// PagingAndSortingRepository gives: findAll(Pageable) for the paginated list.
public interface CarRepository extends ListCrudRepository<Car, Long>, PagingAndSortingRepository<Car, Long> {

	// Spring Data builds the SQL from the method name: ... WHERE plate_number = ?
	Optional<Car> findByPlateNumber(String plateNumber);
}
