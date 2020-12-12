package uz.pdp.workflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import uz.pdp.workflow.entity.Attachment;
import uz.pdp.workflow.entity.AttachmentContent;
import uz.pdp.workflow.entity.ProjectStep;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.ApiResponseModel;
import uz.pdp.workflow.payload.ResUploadFile;
import uz.pdp.workflow.repository.AttachmentContentRepository;
import uz.pdp.workflow.repository.AttachmentRepository;
import uz.pdp.workflow.repository.AttachmentTypeRepository;
import uz.pdp.workflow.repository.ProjectStepRepository;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

    final AttachmentRepository attachmentRepository;

    final AttachmentContentRepository attachmentContentRepository;
    final AttachmentTypeRepository attachmentTypeRepository;
    @Autowired
    ProjectStepRepository projectStepRepository;

    public AttachmentService(AttachmentRepository attachmentRepository, AttachmentContentRepository attachmentContentRepository, AttachmentTypeRepository attachmentTypeRepository) {
        this.attachmentRepository = attachmentRepository;
        this.attachmentContentRepository = attachmentContentRepository;
        this.attachmentTypeRepository = attachmentTypeRepository;
    }

    @Transactional
    public ApiResponseModel uploadFile(MultipartHttpServletRequest request) throws IOException {
        Iterator<String> itr = request.getFileNames();
        String id = "";
        MultipartFile file;
        List<ResUploadFile> resUploadFiles = new ArrayList<>();
        id = request.getParameter("type");
        while (itr.hasNext()) {
            file = request.getFile(itr.next());
            Attachment attachment = attachmentRepository.save(new Attachment(file.getOriginalFilename(), file.getContentType(), file.getSize()));
            try {
                attachmentContentRepository.save(new AttachmentContent(attachment, file.getBytes()));
            } catch (IOException e) {
                e.printStackTrace();
            }
            resUploadFiles.add(new ResUploadFile(attachment.getId(),
                    attachment.getName(),
                    ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/file/").path(attachment.getId().toString()).toUriString(),
                    attachment.getContentType(),
                    attachment.getSize()));

            if (id != null) {
                if (!id.isEmpty()) {
                    ProjectStep projectStep = projectStepRepository.findById(UUID.fromString(id)).orElseThrow(() -> new ResourceNotFoundException("projectStep", "id", ""));
                    if (projectStep.getAttachment() != null) {
                        Attachment attachment1 = projectStep.getAttachment();
                        attachmentContentRepository.delete(attachmentContentRepository.findByAttachment(attachment1).get());
                        attachmentRepository.delete(attachment1);
                        projectStep.setAttachment(null);
                    }
                    projectStep.setAttachment(attachment);
                    projectStepRepository.save(projectStep);
                }
            }
        }

        return new ApiResponseModel(true, "", resUploadFiles);
    }

    public HttpEntity<?> getAttachmentContent(UUID attachmentId, HttpServletResponse response) {
        Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));
        AttachmentContent attachmentContent = attachmentContentRepository.findByAttachment(attachment).orElseThrow(() -> new ResourceNotFoundException("Attachment content", "attachment id", attachmentId));

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getName() + "\"")
                .body(attachmentContent.getContent());
    }

}
