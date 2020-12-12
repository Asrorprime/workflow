package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import uz.pdp.workflow.entity.Contract;

import java.util.UUID;

@RepositoryRestResource(path = "/project")
public interface ContractRepository extends JpaRepository<Contract, UUID> {

    @Query(value = "SELECT COALESCE(CAST(MAX(contract_number) AS numeric),0) FROM contract", nativeQuery = true)
    Integer getMaxAppNumber();

}
