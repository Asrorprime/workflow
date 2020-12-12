package uz.pdp.workflow.payload;

import lombok.Data;

@Data
public class ReqSubStep {
    private String name;
    private boolean completed;
}
