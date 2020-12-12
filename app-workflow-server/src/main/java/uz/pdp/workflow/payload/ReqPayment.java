package uz.pdp.workflow.payload;

import lombok.Data;

import java.sql.Timestamp;
import java.util.UUID;

@Data
public class ReqPayment {
    private UUID id;
    private Integer applicationNumber;
    private Integer payTypeId;
    private double sum;
    private Timestamp date;

}
