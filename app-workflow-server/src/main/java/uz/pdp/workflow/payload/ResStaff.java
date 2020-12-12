package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResStaff {
    private UUID id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String address;
    private String phoneNumber;
    private UUID photoId;
    private String description;
    private Integer specialtyId;
    private String specialtyNameUz;
    private Integer projectsCount;
}
