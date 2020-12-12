package uz.pdp.workflow.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.workflow.entity.ProjectStep;
import uz.pdp.workflow.entity.SubStep;

import java.util.List;
import java.util.UUID;

public interface SubStepRepository extends JpaRepository<SubStep, UUID> {
    void deleteAllByProjectStep(ProjectStep projectStep);

    List<SubStep> findAllByCompletedFalse();

}
