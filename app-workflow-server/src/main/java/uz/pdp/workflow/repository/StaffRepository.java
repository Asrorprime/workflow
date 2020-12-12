package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import uz.pdp.workflow.entity.Staff;

import java.util.List;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<Staff, UUID> {

    @Query(value = "select * from staff where lower(first_name) like concat('%', :staffSearch, '%') or lower(last_name) like concat('%', :staffSearch, '%')", nativeQuery = true)
    List<Staff> getStaffSearch(@Param("staffSearch") String staffSearch);

    @Query(value = "select count(*) from project p where p.id in (select ps.project_id from project_step ps where ps.id in(select pss.project_step_id from project_step_staff pss where pss.staff_id=:staffId))", nativeQuery = true)
    Integer projectCount(@Param("staffId") UUID staffId);


}
