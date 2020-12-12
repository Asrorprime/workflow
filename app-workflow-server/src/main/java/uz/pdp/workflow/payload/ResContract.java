package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResContract {

    private UUID id, userId, customerId;

    private Integer contractNumber;

    private Double sum;

    private Timestamp startDate, deadline;

}
