package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.workflow.entity.Attachment;
import uz.pdp.workflow.entity.AttachmentContent;

import java.util.Optional;
import java.util.UUID;

public interface AttachmentContentRepository extends JpaRepository<AttachmentContent, UUID> {
    Optional<AttachmentContent> findByAttachment(Attachment attachment);

}
