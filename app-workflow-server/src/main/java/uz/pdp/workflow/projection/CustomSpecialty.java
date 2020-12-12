package uz.pdp.workflow.projection;

import org.springframework.data.rest.core.config.Projection;
import uz.pdp.workflow.entity.Specialty;

@Projection(name = "CustomSpecialty", types = Specialty.class)
public interface CustomSpecialty {
    Integer getId();

    String getNameUz();

    String getNameRu();
}
