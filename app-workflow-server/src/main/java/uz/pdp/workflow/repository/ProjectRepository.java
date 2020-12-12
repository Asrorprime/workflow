package uz.pdp.workflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.workflow.entity.Project;
import uz.pdp.workflow.entity.enums.ProjectStatus;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Project findByApplicationNumber(Integer applicationNumber);

    @Query(value = "select max(application_number) from project", nativeQuery = true)
    Integer getLastApp();

    Page<Project> findAllByCreatedAtBetweenAndProjectStatusIn(Timestamp createdAt, Timestamp createdAt2, Collection<ProjectStatus> projectStatus, Pageable pageable);

    Page<Project> findAllByCreatedAtBetweenAndCustomer_CompanyNameContainsIgnoreCaseAndProjectStatusInOrCreatedAtBetweenAndCustomer_FullNameContainsIgnoreCaseAndProjectStatusInOrCreatedAtBetweenAndCustomer_PhoneNumberAndProjectStatusIn(Timestamp createdAt, Timestamp createdAt2, String customer_companyName, Collection<ProjectStatus> projectStatus, Timestamp createdAt3, Timestamp createdAt4, String customer_fullName, Collection<ProjectStatus> projectStatus2, Timestamp createdAt5, Timestamp createdAt6, String customer_phoneNumber, Collection<ProjectStatus> projectStatus3, Pageable pageable);

    List<Project> findAllByCreatedAtBetweenAndProjectStatusInOrderByCreatedAt(Timestamp createdAt, Timestamp createdAt2, Collection<ProjectStatus> projectStatus);

    @Query(value = "select * from project p where p.id in (select ps.project_id from project_step ps where ps.id in(select pss.project_step_id from project_step_staff pss where pss.staff_id=:staffId))and p.end_date>p.deadline and start_date between :dan and :gacha ", nativeQuery = true)
    Page<Project> getProjectsByStaffAfterDeadline(@Param("staffId") UUID staffId, Pageable pageable, @Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha);

    @Query(value = "select * from project p where p.id in (select ps.project_id from project_step ps where ps.id in(select pss.project_step_id from project_step_staff pss where pss.staff_id=:staffId))and p.end_date<p.deadline and start_date between :dan and :gacha ", nativeQuery = true)
    Page<Project> getProjectsByStaffBeforeDeadline(@Param("staffId") UUID staffId, Pageable pageable, @Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha);

    @Query(value = "select * from project p where p.id in (select ps.project_id from project_step ps where ps.id in(select pss.project_step_id from project_step_staff pss where pss.staff_id=:staffId) and ps.completed_date is NULL) and start_date between :dan and :gacha ", nativeQuery = true)
    Page<Project> getProjectsByStaffInProgress(@Param("staffId") UUID staffId, Pageable pageable, @Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha);

    List<Project> findAllByNameContainsIgnoreCase(@Param("name") String name);

//    List<Project> findAllByNameContainsIgnoreCaseOrCustomer_FullNameContainsIgnoreCase(@Param("name") String name);

    Page<Project> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Project> findAllByOrderByCreatedAtAsc(Pageable pageable);

    @Query(value = "SELECT * FROM project WHERE cast(application_number as text) like CONCAT('%',:invoice,'%') LIMIT 5", nativeQuery = true)
    List<Project> getInvoiceSearch(@Param("invoice") Integer invoice);

    List<Project> findAllByEndDateBetweenAndProjectStatus(Timestamp dan, Timestamp gacha, ProjectStatus projectStatus);

    List<Project> findAllByUpdatedAtBetweenAndProjectStatus(Timestamp dan, Timestamp gacha, ProjectStatus projectStatus);

    @Query(value = "select * from project where (project_status='NEW' or project_status='IN_PROGRESS' or project_status='COMPLETED') and (price>(select sum(sum) from payment where payment.application_number=project.application_number) or (select sum(sum) from payment where payment.application_number=project.application_number) IS NULL) and start_date between :dan and :gacha", nativeQuery = true)
    Page<Project> getDebtProject(@Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha, Pageable pageable);

    @Query(value = "select * from project where (project_status='NEW' or project_status='IN_PROGRESS' or project_status='COMPLETED') and (price>(select sum(sum) from payment where payment.application_number=project.application_number) or (select sum(sum) from payment where payment.application_number=project.application_number) IS NULL)", nativeQuery = true)
    List<Project> getDebtProjectList();

    @Query(value = "select * from project where project_status='COMPLETED' and deadline<end_date and end_date between :dan and :gacha", nativeQuery = true)
    Page<Project> getInCompleteProject(@Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha, Pageable pageable);

    @Query(value = "select * from project where project_status='COMPLETED' and deadline>end_date and end_date between :dan and :gacha", nativeQuery = true)
    Page<Project> getOnTimeCompletedProjects(@Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha, Pageable pageable);

    @Query(value = "select * from project where project_status='IN_PROGRESS' and start_date between :dan and :gacha", nativeQuery = true)
    Page<Project> getInProcessProject(@Param("dan") Timestamp dan, @Param("gacha") Timestamp gacha, Pageable pageable);

    @Query(value = "select count(*) from project_step where step_id=:step", nativeQuery = true)
    Integer countProjects(Integer step);

    @Query(value = "select s.id,s.name_uz, s.name_ru,\n" +
            "       (select count(*) from project_step where step_id=s.id) pr_son,\n" +
            "       (select count(*) from project_step where step_id=s.id and completed_date is not null)co_soni,\n" +
            "       (select count(*) from project_step where step_id=s.id and completed_date is null)prog_soni,\n" +
            "    (select count(*) from project_step_staff where project_step_id in (select id from project_step where step_id=s.id and completed_date isnull))st_soni\n" +
            "from step s", nativeQuery = true)
    List<Object[]> getAllByStep();

    @Query(value = "select * from project where project_status='IN_PROGRESS' or project_status='COMPLETED'  order by created_at", nativeQuery = true)
    List<Project> findAllByProjectProjectStatusInProgress();


    @Query(value = "select * from project right join customer c on project.customer_id = c.id where lower(name) like concat('%', :searchName, '%') or lower(full_name) like concat('%', :searchName, '%') ", nativeQuery = true)
    List<Project> getAllByNameOrCustomerFullName(@Param("searchName") String searchName);

    @Query(value = "select count(*) from (select distinct pss.staff_id from project_step_staff pss where pss.project_step_id in (select id from project_step where project_id=:projectId))b",nativeQuery = true)
    Integer staffsCountThisProject(UUID projectId);

    @Query(value = "select * from project right join customer c on project.customer_id = c.id where lower(name) like concat('%', :searchName, '%') or lower(full_name) like concat('%', :searchName, '%') or lower(project.name) like concat('%', :searchName, '%')", nativeQuery = true)
    List<Project> getAllByCustomerNameAndProjectName(@Param("searchName") String searchName);

    @Query(value = "select * from project p right join customer c on p.customer_id = c.id where ((p.project_status='IN_PROGRESS' or p.project_status='COMPLETED') and (p.price>(select sum(sum) from payment where payment.application_number=p.application_number) or (select sum(sum) from payment where payment.application_number=p.application_number) IS NULL)) and (lower(p.name) like concat('%', :searchName, '%') or lower(c.full_name) like concat('%', :searchName, '%'))", nativeQuery = true)
    List<Project> getAllByCustomerNameAndProjectNameSearch(@Param("searchName") String searchName);
}
