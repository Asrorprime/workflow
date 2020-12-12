package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResCustomer {

    private UUID customerId;
    private String companyName;
    private String fullName;
    private String phoneNumber;
    private String address;

}
