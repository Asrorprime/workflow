package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import uz.pdp.workflow.entity.Step;
import uz.pdp.workflow.projection.CustomCustomer;
import uz.pdp.workflow.projection.CustomStep;
@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
@RepositoryRestResource(path = "/step",collectionResourceRel = "list",excerptProjection = CustomStep.class)
public interface StepRepository extends JpaRepository<Step, Integer> {
}
