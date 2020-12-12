package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResStepStatus {
    private Integer id;
    private String nameUz;
    private String nameRu;
    private Integer projectCount;
    private Integer doneCount;
    private Integer inProgressCount;
    private Integer totalStaff;
}
