package uz.pdp.workflow.payload;

import lombok.Data;

import java.util.UUID;

@Data
public class ReqToArchive {

    private UUID projectId;
    private boolean status;

}
