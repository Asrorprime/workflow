package uz.pdp.workflow.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.workflow.entity.*;
import uz.pdp.workflow.entity.enums.ProjectStatus;
import uz.pdp.workflow.entity.template.AbsEntity;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.*;
import uz.pdp.workflow.repository.*;
import uz.pdp.workflow.utils.CommonUtils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    final
    ProjectRepository projectRepository;
    final
    AttachmentRepository attachmentRepository;
    final
    CustomerRepository customerRepository;
    final
    StepRepository stepRepository;
    final
    StaffRepository staffRepository;
    final
    SubStepRepository subStepRepository;
    final
    ProjectStepRepository projectStepRepository;
    final
    PaymentService paymentService;
    final
    AttachmentContentRepository attachmentContentRepository;
    private final PaymentRepository paymentRepository;

    public ProjectService(ProjectRepository projectRepository, AttachmentRepository attachmentRepository, CustomerRepository customerRepository, StepRepository stepRepository, StaffRepository staffRepository, SubStepRepository subStepRepository, ProjectStepRepository projectStepRepository, PaymentService paymentService, PaymentRepository paymentRepository, AttachmentContentRepository attachmentContentRepository) {
        this.projectRepository = projectRepository;
        this.attachmentRepository = attachmentRepository;
        this.customerRepository = customerRepository;
        this.stepRepository = stepRepository;
        this.staffRepository = staffRepository;
        this.subStepRepository = subStepRepository;
        this.projectStepRepository = projectStepRepository;
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.attachmentContentRepository = attachmentContentRepository;
    }

    public ApiResponse addProject(ReqProject request) {
        try {
            Integer lastApp = projectRepository.getLastApp();
            Project project = new Project(
                    lastApp == null ? 1 : lastApp + 1,
                    request.getName(),
                    request.getDeadline(),
                    request.getPrice(),
                    request.getContractFileId() == null ? null : attachmentRepository.findById(request.getContractFileId()).orElseThrow(() -> new ResourceNotFoundException("getContract", "", request.getContractFileId())),
                    customerRepository.findById(request.getCustomerId()).orElseThrow(() -> new ResourceNotFoundException("getCustomer", "", request.getCustomerId())),
                    ProjectStatus.NEW,
                    request.isByOrder()
            );
            projectRepository.save(project);
            request.getReqProjectSteps().forEach(reqProjectStep -> makeProjectStep(reqProjectStep, project));
            return new ApiResponse("Saqlandi", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Xatolik", false);
        }
    }

    public ResProject getProject(Project project) {
        return new ResProject(
                project.getId(),
                project.getApplicationNumber(),
                project.getName(),
                project.getStartDate() == null ? null : getSimpleFormat(project.getStartDate()),
                project.getEndDate() == null ? null : getSimpleFormat(project.getEndDate()),
                project.getDeadline() == null ? null : getSimpleFormat(project.getDeadline()),
                project.getPrice(),
                project.getCustomer(),
                project.getCustomer().getFullName(),
                project.getCustomer().getStatus(),
                project.getProjectStatus(),
                project.getStatusName(),
                project.getProjectSteps().stream().map(this::getProjectStep).collect(Collectors.toList()),
                project.isByOrder(),
                project.getPrice() - paymentRepository.getPaidSumByProject(project.getApplicationNumber()),
                paymentRepository.getPaidSumByProject(project.getApplicationNumber()),
                paymentService.getPaymentList(project),
                projectRepository.staffsCountThisProject(project.getId())
        );
    }

    public List<ResProject> getUnCompletedProjects() {
        return projectRepository.findAllByProjectProjectStatusInProgress().stream().map(this::getProject).collect(Collectors.toList());
    }

    public ResProjectStep getProjectStep(ProjectStep projectStep) {
        return new ResProjectStep(
                projectStep.getId(),
                projectStep.getStep(),
                projectStep.getDeadline() == null ? null : getSimpleFormat(projectStep.getDeadline()),
                projectStep.getStartDate() == null ? null : getSimpleFormat(projectStep.getStartDate()),
                projectStep.getCompletedDate() == null ? null : getSimpleFormat(projectStep.getCompletedDate()),
                projectStep.getStaffs(),
                projectStep.getAttachment() != null ? projectStep.getAttachment().getId() : null,
                projectStep.getSubSteps().stream().map(this::getSubStep).collect(Collectors.toList()),
                projectStep.isStepByOrder(),
                projectStep.getProject().getId(),
                projectStepRepository.projectSubStepCompletedCount(projectStep.getId()),
                projectStep.getAttachment() != null ? (projectStep.getAttachment().getCreatedAt() == null ? null : getSimpleFormat(projectStep.getAttachment().getCreatedAt())) : null,
                projectStep.getAttachment() != null ? (projectStep.getAttachment().getName()) : null,
                projectStep.getCreatedAt(),
                projectStep.isComplete()
        );
    }

    public List<ResProjectStep> getProjectSteps(UUID projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("project", "id", projectId));
        return project.getProjectSteps().stream().sorted(Comparator.comparing(AbsEntity::getCreatedAt)).map(this::getProjectStep).collect(Collectors.toList());
    }

    public List<ResPageable> getProjectByStaff(UUID staffId, int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> projectsByStaffAfterDeadline = projectRepository.getProjectsByStaffAfterDeadline(staffId, CommonUtils.getPageableForNative(page, size), dan, gacha);
        Page<Project> projectsByStaffBeforeDeadline = projectRepository.getProjectsByStaffBeforeDeadline(staffId, CommonUtils.getPageableForNative(page, size), dan, gacha);
        Page<Project> projectsByStaffInProgress = projectRepository.getProjectsByStaffInProgress(staffId, CommonUtils.getPageableForNative(page, size), dan, gacha);
        List<ResPageable> resPageableList = new ArrayList<>();
        resPageableList.add(new ResPageable(projectsByStaffAfterDeadline.getContent().stream().map(this::getProject).collect(Collectors.toList()),
                projectsByStaffAfterDeadline.getTotalElements(), page, projectsByStaffAfterDeadline.getTotalPages(), "after"));
        resPageableList.add(new ResPageable(projectsByStaffBeforeDeadline.getContent().stream().map(this::getProject).collect(Collectors.toList()), projectsByStaffAfterDeadline.getTotalElements(), page, projectsByStaffAfterDeadline.getTotalPages(), "before"));
        resPageableList.add(new ResPageable(projectsByStaffInProgress.getContent().stream().map(this::getProject).collect(Collectors.toList()), projectsByStaffAfterDeadline.getTotalElements(), page, projectsByStaffAfterDeadline.getTotalPages(), "progress"));
        return resPageableList;
    }

    public ResSubStep getSubStep(SubStep subStep) {
        return new ResSubStep(
                subStep.getId(),
                subStep.getProjectStep().getId(),
                subStep.getName(),
                subStep.isCompleted()
        );
    }

    public ResPageable getProjects(int page, int size, boolean byPageable, String status, Timestamp begin, Timestamp end, String search, String sortByField, boolean payment) {
        List<ProjectStatus> projectStatuses = new ArrayList<>();
        Page<Project> projectsPage = null;
        List<Project> projectList = new ArrayList<>();
        if (!status.equals("all")) {
            projectStatuses.add(ProjectStatus.valueOf(status));
        } else {
            projectStatuses.addAll(Arrays.asList(ProjectStatus.NEW, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED, ProjectStatus.CLOSED));
        }
        if (byPageable && search.isEmpty()) {
            projectsPage = projectRepository.findAllByCreatedAtBetweenAndProjectStatusIn(begin, end, projectStatuses, CommonUtils.getPageable(page, size, sortByField));
        } else if (byPageable) {
            projectsPage = projectRepository.findAllByCreatedAtBetweenAndCustomer_CompanyNameContainsIgnoreCaseAndProjectStatusInOrCreatedAtBetweenAndCustomer_FullNameContainsIgnoreCaseAndProjectStatusInOrCreatedAtBetweenAndCustomer_PhoneNumberAndProjectStatusIn(begin, end, search, projectStatuses, begin, end, search, projectStatuses, begin, end, search, projectStatuses, CommonUtils.getPageable(page, size, sortByField));
        } else {
            projectList = projectRepository.findAllByCreatedAtBetweenAndProjectStatusInOrderByCreatedAt(begin, end, projectStatuses);
        }
        if (projectsPage != null) {
            projectList = projectsPage.getContent();
        }
        return new ResPageable(
                projectList.stream().map(this::getProject).collect(Collectors.toList()),
                projectsPage == null ? null : projectsPage.getTotalElements(),
                projectsPage == null ? null : projectsPage.getNumber(),
                projectsPage == null ? null : projectsPage.getTotalPages()
        );

    }

    public void makeProjectStep(ReqProjectStep reqProjectStep, Project project) {
        ProjectStep projectStep = new ProjectStep();
        if (reqProjectStep.getId() != null)
            projectStepRepository.findById(reqProjectStep.getId()).orElseThrow(() -> new ResourceNotFoundException("add", "add", reqProjectStep.getId()));
        projectStep.setStep(stepRepository.findById(reqProjectStep.getStepId()).orElseThrow(() -> new ResourceNotFoundException("get", "", reqProjectStep.getStepId())));
        projectStep.setDeadline(reqProjectStep.getDeadline());
        projectStep.setStaffs(staffRepository.findAllById(reqProjectStep.getStaffsId()));
        projectStep.setStepByOrder(reqProjectStep.isStepByOrder());
        projectStep.setProject(project);
        if (reqProjectStep.getId() != null) {
            subStepRepository.deleteAllByProjectStep(projectStep);
        }
        projectStepRepository.save(projectStep);
        List<SubStep> subStepList = reqProjectStep.getSubSteps().stream().map(s -> makeSubStep(s, projectStep)).collect(Collectors.toList());
        subStepRepository.saveAll(subStepList);
    }

    public SubStep makeSubStep(ReqSubStep reqSubStep, ProjectStep projectStep) {
        return new SubStep(
                projectStep,
                reqSubStep.getName(),
                reqSubStep.isCompleted()
        );
    }

    public String getSimpleFormat(Timestamp timestamp) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
        return simpleDateFormat.format(timestamp);
    }

    public List<ResProject> getProjectSearchNameCustomer(String name) {
        return projectRepository.getAllByCustomerNameAndProjectName(name).stream().map(this::getProject).collect(Collectors.toList());
    }

    public List<ResProject> getProjectSearchName(String name) {
        return projectRepository.findAllByNameContainsIgnoreCase(name).stream().map(this::getProject).collect(Collectors.toList());
    }

    public List<ResProject> getInvoiceSearch(Integer invoiceId) {
        return projectRepository.getInvoiceSearch(invoiceId).stream().map(this::getResProjectByInvoice).collect(Collectors.toList());
    }

    public ResProject getResProjectByInvoice(Project project) {
        return new ResProject(
                project.getApplicationNumber(),
                project.getPrice(),
                project.getPrice() - paymentRepository.getPaidSumByProject(project.getApplicationNumber())
        );
    }

    public ApiResponse stretchProjectStepDeadline(ReqProjectStep reqProjectStep) {
        try {
            ProjectStep projectStep = projectStepRepository.findById(reqProjectStep.getId()).orElseThrow(() -> new ResourceNotFoundException("ProjectStep", "id", reqProjectStep.getId()));
            Project project = projectRepository.findById(reqProjectStep.getProjectId()).orElseThrow(() -> new ResourceNotFoundException("Project", "id", reqProjectStep.getProjectId()));
            if (reqProjectStep.getDeadline().getTime() > project.getDeadline().getTime()) {
                return new ApiResponse("Kiritilgan vaqt loyihaning tugash vaqtidan uzun", false);
            } else {
                projectStep.setDeadline(reqProjectStep.getDeadline());
                projectStepRepository.save(projectStep);
                return new ApiResponse("Loyiha bosqichi vaqti uzaytirildi!", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Xatolik", false);
        }
    }

    public ApiResponse stretchProjectDeadline(ReqProject reqProject) {
        try {
            Project project = projectRepository.findById(reqProject.getId()).orElseThrow(() -> new ResourceNotFoundException("Project", "id", reqProject.getId()));
            project.setDeadline(reqProject.getDeadline());
            projectRepository.save(project);
            return new ApiResponse("Loyiha tugash vaqti uzaytirildi!", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Xatolik", false);
        }
    }


    public ApiResponse completedSubStep(UUID subStepId, boolean undo) {
        SubStep subStep = subStepRepository.findById(subStepId).orElseThrow(() -> new ResourceNotFoundException("subStep", "id", subStepId));
        subStep.setCompleted(undo);
        checkCompletedProjectStep(subStepRepository.save(subStep), undo);
        return new ApiResponse("O'zgartirildi", true);
    }

    private void checkCompletedProjectStep(SubStep subStep, boolean undo) {
        ProjectStep projectStep = subStep.getProjectStep();
        if (projectStep.getCompletedDate() != null) {
            Project project = projectRepository.findById(projectStep.getProject().getId()).orElseThrow(() -> new ResourceNotFoundException("project", "id", projectStep.getProject().getId()));
            subStep.setCompleted(undo);
            subStepRepository.save(subStep);
            int count = (int) projectStep.getSubSteps().stream().filter(SubStep::isCompleted).count();
            if (count == projectStep.getSubSteps().size()) {
                projectStep.setComplete(true);
                projectStepRepository.save(projectStep);
            } else {
                projectStep.setComplete(false);
                projectStepRepository.save(projectStep);
            }

            int count1 = (int) project.getProjectSteps().stream().filter(ProjectStep::isComplete).count();
            if (count1 == project.getProjectSteps().size()) {
                project.setProjectStatus(ProjectStatus.COMPLETED);
                projectRepository.save(project);
            } else {
                project.setProjectStatus(ProjectStatus.IN_PROGRESS);
                projectRepository.save(project);
            }

        } else {
            int count = (int) projectStep.getSubSteps().stream().filter(SubStep::isCompleted).count();
            if (count == projectStep.getSubSteps().size()) {
                projectStep.setCompletedDate(new Timestamp(System.currentTimeMillis()));
                projectStep.setComplete(true);
                Project project = projectRepository.findById(projectStep.getProject().getId()).orElseThrow(() -> new ResourceNotFoundException("project", "id", projectStep.getProject().getId()));
                if (project.isByOrder()) {
                    ArrayList<ProjectStep> projectSteps = new ArrayList<>(project.getProjectSteps());
                    projectSteps.sort(Comparator.comparing(AbsEntity::getCreatedAt));
                    for (int i = 0; i < projectSteps.size(); i++) {
                        if (projectSteps.get(i).getId().equals(projectStep.getId()) && i + 1 != projectSteps.size()) {
                            projectSteps.get(i + 1).setStartDate(projectStep.getCompletedDate());
                        }
                    }
                } else {
                    if (projectStep.isStepByOrder()) {
                        List<ProjectStep> byOrder = project.getProjectSteps().stream().filter(ProjectStep::isStepByOrder).sorted(Comparator.comparing(AbsEntity::getCreatedAt)).collect(Collectors.toList());
                        for (int i = 0; i < byOrder.size(); i++) {
                            if (byOrder.get(i).getId().equals(projectStep.getId()) && i + 1 != byOrder.size()) {
                                byOrder.get(i + 1).setStartDate(projectStep.getCompletedDate());
                            }
                        }
                    } else {
                        List<ProjectStep> notByOrder = project.getProjectSteps().stream().filter(curProjectStep -> !curProjectStep.isStepByOrder()).sorted(Comparator.comparing(AbsEntity::getCreatedAt)).collect(Collectors.toList());
                        for (int i = 0; i < notByOrder.size(); i++) {
                            if (notByOrder.get(i).getId().equals(projectStep.getId()) && i + 1 != notByOrder.size()) {
                                notByOrder.get(i + 1).setStartDate(projectStep.getCompletedDate());
                            }
                        }
                    }
                }
                checkCompletedProject(projectStepRepository.save(projectStep));
            } else {
                projectStep.setCompletedDate(null);
                projectStepRepository.save(projectStep);
            }
        }
    }

    private void checkCompletedProject(ProjectStep projectStep) {
        Project project = projectStep.getProject();
        int count = (int) project.getProjectSteps().stream().filter(ProjectStep::isComplete).count();
        if (count == projectStep.getProject().getProjectSteps().size()) {
            project.setEndDate(new Timestamp(System.currentTimeMillis()));
            project.setProjectStatus(ProjectStatus.COMPLETED);
        } else {
            project.setEndDate(null);
        }
        projectRepository.save(project);
    }

    public ApiResponse startProject(UUID id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("project", "id", id));
        if (project.getProjectStatus().equals(ProjectStatus.NEW)) {
            project.setProjectStatus(ProjectStatus.IN_PROGRESS);
            project.setStartDate(new Timestamp(System.currentTimeMillis()));
            List<ProjectStep> projectSteps = project.getProjectSteps();
            projectSteps.sort(Comparator.comparing(AbsEntity::getCreatedAt));
            if (project.isByOrder()) {
                projectSteps.get(0).setStartDate(new Timestamp(System.currentTimeMillis()));
            } else {
                List<ProjectStep> byOrder = projectSteps.stream().filter(ProjectStep::isStepByOrder).collect(Collectors.toList());
                if (byOrder.size() > 0) {
                    byOrder.get(0).setStartDate(new Timestamp(System.currentTimeMillis()));
                }
                List<ProjectStep> notByOrder = projectSteps.stream().filter(projectStep -> !projectStep.isStepByOrder()).collect(Collectors.toList());
                if (notByOrder.size() > 0) {
                    notByOrder.forEach(projectStep -> projectStep.setStartDate(new Timestamp(System.currentTimeMillis())));
                }
            }
            projectRepository.save(project);
            return new ApiResponse("Loyihaga start berildi!", true);
        } else {
            return new ApiResponse("Ushbu loyihaga start berilgan!", false);
        }

    }

    public ApiResponse toArchive(ReqToArchive reqToArchive) {
        Project project = projectRepository.findById(reqToArchive.getProjectId()).orElseThrow(() -> new ResourceNotFoundException("project", "id", reqToArchive.getProjectId()));
        if (project.getProjectStatus().equals(ProjectStatus.COMPLETED) || project.getProjectStatus().equals(ProjectStatus.CLOSED)) {
            if (reqToArchive.isStatus()) {
                double paidSumByProject = paymentRepository.getPaidSumByProject(project.getApplicationNumber());
                if (paidSumByProject < project.getPrice()) {
                    return new ApiResponse("Loyihaning to'lashi kerak bo'lgan summasi: " + (project.getPrice() - paidSumByProject) + "UZS", true);
                }
                project.setProjectStatus(ProjectStatus.CLOSED);
                projectRepository.save(project);
                return new ApiResponse("Loyiha arxivga o'tkazildi!", true);
            } else {
                project.setProjectStatus(ProjectStatus.COMPLETED);
                projectRepository.save(project);
                return new ApiResponse("Loyiha arxivdan chiqarildi!", true);
            }
        } else {
            return new ApiResponse("Xatolik loyiha tugatilmagan!", false);
        }
    }

    public List<ResStepStatus> getProjectsStepStatus() {
        List<Object[]> allByStep = projectRepository.getAllByStep();
        return allByStep.stream().map(this::getProjectStepStatus).collect(Collectors.toList());
    }

    private ResStepStatus getProjectStepStatus(Object[] arr) {
        return new ResStepStatus(
                Integer.valueOf(arr[0].toString()),
                arr[1].toString(),
                arr[2].toString(),
                Integer.valueOf(arr[3].toString()),
                Integer.valueOf(arr[4].toString()),
                Integer.valueOf(arr[5].toString()),
                Integer.valueOf(arr[6].toString())
        );
    }

    public ApiResponse deleteAttachment(UUID attachmentId) {
        try {
            Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(() -> new ResourceNotFoundException("attachment", "id", attachmentId));
            AttachmentContent attachmentContent = attachmentContentRepository.findByAttachment(attachment).orElseThrow(() -> new ResourceNotFoundException("attachment", "id", attachmentId));
            ProjectStep projectStep = projectStepRepository.updateProjectAttachment(attachmentId);
            projectStep.setAttachment(null);
            projectStepRepository.save(projectStep);
            attachmentContentRepository.deleteById(attachmentContent.getId());
            attachmentRepository.deleteById(attachmentId);
            return new ApiResponse("Fayl o'chirildi!", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Xatolik", false);
        }
    }


    public List<ResProject> getPaymentSearchProjectNameOrCustomerName(String searchName) {
        return projectRepository.getAllByCustomerNameAndProjectNameSearch(searchName).stream().map(this::getProject).collect(Collectors.toList());
    }
}
