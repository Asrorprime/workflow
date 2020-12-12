package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.PayType;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResPayment {
    private UUID id;
    private Integer applicationNumber;
    private Integer payTypeId;
    private String payTypeNameUz;
    private double sum;
    private String date;
    private String projectName;
    private double projectPrice;
    private String customerName;
}
