package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import uz.pdp.workflow.entity.PayType;
import uz.pdp.workflow.projection.CustomPayType;
@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
@RepositoryRestResource(path = "/payType", collectionResourceRel = "list", excerptProjection = CustomPayType.class)
public interface PayTypeRepository extends JpaRepository<PayType, Integer> {
}
