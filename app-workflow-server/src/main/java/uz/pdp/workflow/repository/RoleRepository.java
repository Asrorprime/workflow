package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import uz.pdp.workflow.entity.Role;
import uz.pdp.workflow.entity.enums.RoleName;
import uz.pdp.workflow.projection.CustomRole;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "role",collectionResourceRel = "list", excerptProjection = CustomRole.class)
public interface RoleRepository extends JpaRepository<Role, Integer> {

    List<Role> findAllByName(RoleName name);

    Optional<Role> findByName(RoleName name);

    List<Role> findAllByNameIn(List<RoleName> names);


}
