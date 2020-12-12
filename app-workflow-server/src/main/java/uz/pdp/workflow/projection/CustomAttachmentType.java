package uz.pdp.workflow.projection;

import org.springframework.data.rest.core.config.Projection;
import uz.pdp.workflow.entity.AttachmentType;

import java.util.UUID;

@Projection(name = "customAttachmentType", types = AttachmentType.class)
public interface CustomAttachmentType {
    UUID getId();

    String getContentTypes();

    Integer getWidth();

    Integer getHeight();

    String getType();
}
