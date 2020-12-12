package uz.pdp.workflow.projection;

import org.springframework.data.rest.core.config.Projection;
import uz.pdp.workflow.entity.Step;

import java.util.UUID;

@Projection(name = "CustomStep", types = Step.class)
public interface CustomStep {
    Integer getId();

    String getNameUz();

    String getNameRu();

}
