package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import uz.pdp.workflow.entity.Specialty;
import uz.pdp.workflow.projection.CustomSpecialty;
@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
@RepositoryRestResource(path = "/specialty", excerptProjection = CustomSpecialty.class, collectionResourceRel = "list")
public interface SpecialtyRepository extends JpaRepository<Specialty, Integer> {
}
