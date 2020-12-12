package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.workflow.entity.Attachment;

import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
}
