package uz.pdp.workflow.payload;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
public class ReqProjectStep {
    private UUID id;
    private Integer stepId;
    private Timestamp deadline;
    private Timestamp startDate;
    private Timestamp completedDate;
    private List<UUID> staffsId;
    private UUID attachmentId;
    private List<ReqSubStep> subSteps;
    private boolean stepByOrder;
    private UUID projectId;
}
