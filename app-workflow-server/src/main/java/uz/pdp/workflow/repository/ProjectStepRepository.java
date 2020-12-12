package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.pdp.workflow.entity.Attachment;
import uz.pdp.workflow.entity.Project;
import uz.pdp.workflow.entity.ProjectStep;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectStepRepository extends JpaRepository<ProjectStep, UUID> {
    @Query(value = "select count(*) from sub_step where project_step_id=:projectStepId and completed=true", nativeQuery = true)
    Integer projectSubStepCompletedCount(UUID projectStepId);

    @Query(value = "select * from project_step where attachment_id=:attachment_id",nativeQuery = true)
    ProjectStep updateProjectAttachment(UUID attachment_id);
}
