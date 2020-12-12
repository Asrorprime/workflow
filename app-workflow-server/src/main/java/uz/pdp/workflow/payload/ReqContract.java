package uz.pdp.workflow.payload;

import lombok.Data;

import java.sql.Timestamp;
import java.util.UUID;

@Data
public class ReqContract {

    private UUID id;

    private Timestamp deadline;

    private Integer contractTypeId;

    private UUID CustomerId;

    private Double sum;

}
