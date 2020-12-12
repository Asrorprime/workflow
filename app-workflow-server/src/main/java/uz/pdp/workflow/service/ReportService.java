package uz.pdp.workflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.workflow.entity.Payment;
import uz.pdp.workflow.entity.Project;
import uz.pdp.workflow.entity.enums.ProjectStatus;
import uz.pdp.workflow.payload.ExcelRequestDynamic;
import uz.pdp.workflow.payload.ResPageable;
import uz.pdp.workflow.payload.ResProject;
import uz.pdp.workflow.repository.PaymentRepository;
import uz.pdp.workflow.repository.ProjectRepository;
import uz.pdp.workflow.utils.CommonUtils;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    ProjectService projectService;
    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    PaymentService paymentService;
    @Autowired
    ExportExcelService exportExcelService;

    public ResPageable getReportDebtClients(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> debtProject = projectRepository.getDebtProject(dan, gacha, CommonUtils.getPageableForNative(page, size));
        Page<Project> projects = projectRepository.findAllByOrderByCreatedAtAsc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                debtProject.getContent().stream().map(project -> projectService.getProject(project)).collect(Collectors.toList()),
                projects.getTotalElements(),
                page,
                projects.getTotalPages()
        );
    }


    public ResPageable getReportReady(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> projects = projectRepository.findAllByOrderByCreatedAtDesc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                projectRepository.findAllByEndDateBetweenAndProjectStatus(dan, gacha, ProjectStatus.COMPLETED).stream().map(project -> projectService.getProject(project)).collect(Collectors.toList()),
                projects.getTotalElements(),
                page,
                projects.getTotalPages()
        );
    }

    public ResPageable getReportArchive(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> projects = projectRepository.findAllByOrderByCreatedAtDesc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                projectRepository.findAllByUpdatedAtBetweenAndProjectStatus(dan, gacha, ProjectStatus.CLOSED).stream().map(project -> projectService.getProject(project)).collect(Collectors.toList()),
                projects.getTotalElements(),
                page,
                projects.getTotalPages()
        );
    }

    public ResPageable getReportPayment(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Payment> payments = paymentRepository.findAllByOrderByCreatedAtDesc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                paymentRepository.findAllByDateBetween(dan, gacha, CommonUtils.getPageable(page, size)).stream().map(payment -> paymentService.getPayment(payment)).collect(Collectors.toList()),
                payments.getTotalElements(),
                page,
                payments.getTotalPages()
        );
    }

    public ResPageable geReportInComplete(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> completeProject = projectRepository.getInCompleteProject(dan, gacha, CommonUtils.getPageableForNative(page, size));
        Page<Project> projects = projectRepository.findAllByOrderByCreatedAtAsc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                completeProject.getContent().stream().map(project -> projectService.getProject(project)).collect(Collectors.toList()),
                projects.getTotalElements(),
                page,
                projects.getTotalPages()
        );
    }

    public ResPageable getOnTimeCompletedProjects(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> completeProject = projectRepository.getOnTimeCompletedProjects(dan, gacha, CommonUtils.getPageableForNative(page, size));
        Page<Project> projects = projectRepository.findAllByOrderByCreatedAtAsc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                completeProject.getContent().stream().map(project -> projectService.getProject(project)).collect(Collectors.toList()),
                projects.getTotalElements(),
                page,
                projects.getTotalPages()
        );
    }

    public ResPageable getReportInProcess(int page, int size, Timestamp dan, Timestamp gacha) {
        Page<Project> processProject = projectRepository.getInProcessProject(dan, gacha, CommonUtils.getPageableForNative(page, size));
        Page<Project> projects = projectRepository.findAllByOrderByCreatedAtAsc(CommonUtils.getPageable(page, size));
        return new ResPageable(
                processProject.getContent().stream().map(project -> projectService.getProject(project)).collect(Collectors.toList()),
                projects.getTotalElements(),
                page,
                projects.getTotalPages()
        );
    }

    public ResponseEntity<?> getDebtClientsExcel(ExcelRequestDynamic request) {
        List<Object> debtClients = new ArrayList<>(getResProjects());
        String title = "Qarzdorlar ro'yxati" + LocalDate.now();
        request.setTitle(title);
        request.setObjects(debtClients);
        return exportExcelService.exportDataToExcel(request);
    }

    public ResponseEntity<?> getCompletedProjectsExcel(ExcelRequestDynamic request) {
        List<Object> completedProjects = new ArrayList<>(getResProjects());
        String title = "Yopilgan loyihalar ro'yxati : " + LocalDate.now();
        request.setTitle(title);
        request.setObjects(completedProjects);
        return exportExcelService.exportDataToExcel(request);
    }

    private List<ResProject> getResProjects() {
        return projectRepository.getDebtProjectList().stream().map(project -> projectService.getProject(project)).collect(Collectors.toList());
    }

    public List<ResProject> getDebtClientSearch(String searchName){
        return projectRepository.getAllByCustomerNameAndProjectNameSearch(searchName).stream().map(project -> projectService.getProject(project)).collect(Collectors.toList());

    }

}
