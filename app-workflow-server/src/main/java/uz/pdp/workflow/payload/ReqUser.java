package uz.pdp.workflow.payload;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class ReqUser {
    private UUID id;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Date birthDate;
    private UUID photoId;
    private List<Integer> rolesId;
}
