package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import uz.pdp.workflow.entity.Customer;
import uz.pdp.workflow.projection.CustomCustomer;

import java.util.List;
import java.util.UUID;
@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
@RepositoryRestResource(path = "/customer",collectionResourceRel = "list",excerptProjection = CustomCustomer.class)
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    @RestResource(path="searchByName", rel="searchByName")
    List<Customer> findAllByCompanyNameContainsIgnoreCase(@Param("searchByName") String searchByName);
}
