package uz.pdp.workflow.payload;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
public class ReqProject {
    private UUID id;
    private String name;
    private Timestamp startDate;
    private Timestamp endDate;
    private Timestamp deadline;
    private double price;
    private UUID contractFileId;
    private UUID customerId;
    private List<ReqProjectStep> reqProjectSteps;
    private boolean byOrder;
}
