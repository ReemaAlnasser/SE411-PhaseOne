package edu.psu.se411.fleetmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@SpringBootApplication
// Sends pages to the frontend as: { "content": [...], "page": { "number", "size", "totalElements", "totalPages" } }
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class FleetmanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(FleetmanagerApplication.class, args);
	}

}
