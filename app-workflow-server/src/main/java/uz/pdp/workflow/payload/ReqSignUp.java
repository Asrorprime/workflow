package uz.pdp.workflow.payload;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class ReqSignUp {
    private UUID id;

    private String phoneNumber;

    private String password;

    private String firstName;

    private String lastName;

    private String patron;
    private UUID photoId;

    private Date birthDate;

    private List<Integer> rolesId;
}
