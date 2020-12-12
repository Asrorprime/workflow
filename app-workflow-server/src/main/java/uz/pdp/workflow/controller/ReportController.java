package uz.pdp.workflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.workflow.payload.ExcelRequestDynamic;
import uz.pdp.workflow.service.ReportService;
import uz.pdp.workflow.utils.AppConstants;

import java.sql.Timestamp;
@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
@RestController
@RequestMapping("api/report")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/debtClients")
    public HttpEntity<?> getReportDebtors(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.getReportDebtClients(page, size, dan, gacha));
    }

    @GetMapping("/ready")
    public HttpEntity<?> getReportReady(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.getReportReady(page, size, dan, gacha));
    }

    @GetMapping("/archived")
    public HttpEntity<?> getArchivedProjects(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.getReportArchive(page, size, dan, gacha));
    }

    @GetMapping("/payment")
    public HttpEntity<?> getReportPayment(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.getReportPayment(page, size, dan, gacha));
    }

    @GetMapping("/inComplete")
    public HttpEntity<?> getReportInComplete(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.geReportInComplete(page, size, dan, gacha));
    }

    @GetMapping("/onTimeComplete")
    public HttpEntity<?> getOnTimeCompletedProjects(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.getOnTimeCompletedProjects(page, size, dan, gacha));
    }

    @GetMapping("/inProgress")
    public HttpEntity<?> getReportInProcess(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "dan", defaultValue = AppConstants.BEGIN_DATE) Timestamp dan,
            @RequestParam(value = "gacha", defaultValue = AppConstants.END_DATE) Timestamp gacha
    ) {
        return ResponseEntity.ok().body(reportService.getReportInProcess(page, size, dan, gacha));
    }

    @PostMapping("/excel/debClients")
    public HttpEntity<?> downloadDebClients(@RequestParam ExcelRequestDynamic request){
        return reportService.getDebtClientsExcel(request);
    }

    @GetMapping("/debtClients/search")
    public HttpEntity<?> getDebtClientSearch(@RequestParam(value = "searchName", defaultValue = "") String searchName){
        return ResponseEntity.ok(reportService.getDebtClientSearch(searchName));
    }

//    @PostMapping("/excel/completedProjects")
//    public HttpEntity<?> downloadCompletedProjects(@RequestParam ExcelRequestDynamic request){
//        return reportService.getCompletedProjectsExcel(request);
//    }

//    @PostMapping("/excel/payments")
//    public HttpEntity<?> downloadPayments(@RequestBody ExcelRequestDynamic request) {
//        return reportService.getPaymentsExcel(request);
//    }
}
