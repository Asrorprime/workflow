package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.Staff;
import uz.pdp.workflow.entity.Step;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResProjectStep {

    private UUID projectStepId;

    private Step step;

    private String deadline;

    private String startDate;

    private String completedDate;

    private List<Staff> staffs;

    private UUID attachmentId;

    private List<ResSubStep> resSubSteps;

    private boolean stepByOrder;

    private UUID projectId;

    private int countCompletedSubSteps;

    private String attachmentCreatedDate;

    private String fileName;

    private Timestamp createdAt;

    private boolean complete;

}
