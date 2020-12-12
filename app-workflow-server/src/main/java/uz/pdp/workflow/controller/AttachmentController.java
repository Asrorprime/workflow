package uz.pdp.workflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.pdp.workflow.payload.ApiResponseModel;
import uz.pdp.workflow.service.AttachmentService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/file")
public class AttachmentController {

    @Autowired
    AttachmentService attachmentService;

    @PostMapping
    public ApiResponseModel uploadFile(MultipartHttpServletRequest request) throws IOException {
        return attachmentService.uploadFile(request);
    }

    @GetMapping("/{id}")
    public HttpEntity<?> getFile(@PathVariable UUID id, HttpServletResponse response) {
        return attachmentService.getAttachmentContent(id, response);
    }
}
