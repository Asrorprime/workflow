package uz.pdp.workflow.payload;

import lombok.Data;

import java.util.UUID;

@Data
public class ReqStaff {
    private UUID id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String address;
    private String phoneNumber;
    private UUID photoId;
    private String description;
    private Integer specialtyId;
}
