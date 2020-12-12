package uz.pdp.workflow.projection;

import org.springframework.data.rest.core.config.Projection;
import uz.pdp.workflow.entity.PayType;

@Projection(name = "CustomPayType", types = PayType.class)
public interface CustomPayType {
    Integer getId();

    String getNameUz();

    String getNameRu();
}
