package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResSubStep {
    private UUID subStepId;
    private UUID projectStepId;
    private String name;
    private boolean completed;
}
