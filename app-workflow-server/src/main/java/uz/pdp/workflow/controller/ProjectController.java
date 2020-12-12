package uz.pdp.workflow.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.workflow.entity.Project;
import uz.pdp.workflow.entity.enums.ProjectStatus;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.ApiResponse;
import uz.pdp.workflow.payload.ApiResponseModel;
import uz.pdp.workflow.payload.ReqProject;
import uz.pdp.workflow.payload.ReqToArchive;
import uz.pdp.workflow.repository.ProjectRepository;
import uz.pdp.workflow.repository.ProjectStepRepository;
import uz.pdp.workflow.repository.SubStepRepository;
import uz.pdp.workflow.service.ProjectService;
import uz.pdp.workflow.utils.AppConstants;

import java.sql.Timestamp;
import java.util.UUID;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    final
    ProjectRepository projectRepository;
    final
    ProjectService projectService;
    final
    SubStepRepository subStepRepository;
    final
    ProjectStepRepository projectStepRepository;

    public ProjectController(ProjectRepository projectRepository, ProjectService projectService, SubStepRepository subStepRepository, ProjectStepRepository projectStepRepository) {
        this.projectRepository = projectRepository;
        this.projectService = projectService;
        this.subStepRepository = subStepRepository;
        this.projectStepRepository = projectStepRepository;
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PostMapping
    public HttpEntity<?> createProject(@RequestBody ReqProject reqProject) {
        ApiResponse response = projectService.addProject(reqProject);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(response.getMessage(), true));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(response.getMessage(), false));
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping
    public HttpEntity<?> getProjects(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "byPageable", defaultValue = "false") boolean byPageable,
            @RequestParam(value = "status", defaultValue = "all") String status,
            @RequestParam(value = "begin", defaultValue = AppConstants.BEGIN_DATE) Timestamp begin,
            @RequestParam(value = "end", defaultValue = AppConstants.END_DATE) Timestamp end,
            @RequestParam(value = "search", defaultValue = "") String search,
            @RequestParam(value = "sortByField", defaultValue = "createdAt") String sortByField,
            @RequestParam(value = "payment", defaultValue = "false") boolean payment
    ) {
        return ResponseEntity.ok(new ApiResponseModel(true, "Mana Projectlar", projectService.getProjects(page, size, byPageable, status, begin, end, search, sortByField, payment)));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/{projectId}")
    public HttpEntity<?> getProject(@PathVariable UUID projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("getProject", "projectId", projectId));
        return ResponseEntity.ok(new ApiResponseModel(true, "Mana bitta project",
                projectService.getProject(project)));
    }

    @GetMapping("/byStaff")
    public HttpEntity<?> getProjectByStaff(
            @RequestParam(value = "staffId", defaultValue = "") UUID staffId,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha) {

        return ResponseEntity.ok(new ApiResponseModel(true, "Mana xodimga tegishli loyihalar", projectService.getProjectByStaff(staffId, page, size, dan, gacha)));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/search/projectName")
    public HttpEntity<?> getProjectSearchName(@RequestParam(value = "name", defaultValue = "") String name) {
        return ResponseEntity.ok().body(projectService.getProjectSearchName(name));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/search")
    public HttpEntity<?> getProjectSearchNameCustomer(@RequestParam(value = "name", defaultValue = "") String name) {
        return ResponseEntity.ok().body(projectService.getProjectSearchNameCustomer(name));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/search/invoice")
    public HttpEntity<?> getSearch(@RequestParam(value = "invoice", defaultValue = "-1") String invoice) {
        return ResponseEntity.ok(new ApiResponseModel(true, "Mana  nomerlari", projectService.getInvoiceSearch(Integer.valueOf(invoice))));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @DeleteMapping("/{projectId}")
    public HttpEntity<?> deleteProject(@PathVariable UUID projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("project", "id", projectId));
        if (project.getProjectStatus().equals(ProjectStatus.NEW)) {
            projectRepository.deleteById(projectId);
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("O'chirish imkoniyati mavjud emas", false));
        }
        return ResponseEntity.ok(new ApiResponse("O'chirildi!", true));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/unCompletedProjects")
    public HttpEntity<?> getUnCompletedProjects() {
        return ResponseEntity.ok(new ApiResponseModel(true, "Bosqichlar", projectService.getUnCompletedProjects()));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/projectSubStepCompletedCount/{projectStepId}")
    public HttpEntity<?> getProjectSubStepCompletedCount(@PathVariable UUID projectStepId) {
        return ResponseEntity.ok().body(projectStepRepository.projectSubStepCompletedCount(projectStepId));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/completeSubStep")
    public HttpEntity<?> completeSubStep(@RequestParam(name = "subStepId") UUID subStepId, @RequestParam(name = "undo", defaultValue = "false") boolean undo) {
        return ResponseEntity.ok().body(projectService.completedSubStep(subStepId, undo));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PutMapping("/startProject/{projectId}")
    public HttpEntity<?> startProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok().body(projectService.startProject(projectId));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PutMapping("/toArchive")
    public HttpEntity<?> toArchive(@RequestBody ReqToArchive reqToArchive) {
        return ResponseEntity.ok().body(projectService.toArchive(reqToArchive));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/stepStatus")
    public HttpEntity<?> getProjectStepStatus() {
        return ResponseEntity.ok().body(projectService.getProjectsStepStatus());
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @DeleteMapping("/deleteFile/{attachmentId}")
    public HttpEntity<?> deleteAttachment(@PathVariable UUID attachmentId) {
        return ResponseEntity.ok().body(projectService.deleteAttachment(attachmentId));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/projectSteps/{projectId}")
    public HttpEntity<?> getProjectSteps(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ApiResponseModel(true, "Bosqichlar", projectService.getProjectSteps(projectId)));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping("/searchCustomerName")
    public HttpEntity<?> getPaymentSearchProjectNameOrCustomerName(@RequestParam(value = "searchName", defaultValue = "") String searchName) {
        return ResponseEntity.ok(projectService.getPaymentSearchProjectNameOrCustomerName(searchName));
    }
}
