package uz.pdp.workflow.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.workflow.entity.Staff;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.ReqStaff;
import uz.pdp.workflow.payload.ResStaff;
import uz.pdp.workflow.repository.StaffRepository;
import uz.pdp.workflow.service.StaffService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/staff")
public class StaffController {
    final
    StaffService staffService;
    final
    StaffRepository staffRepository;

    public StaffController(StaffService staffService, StaffRepository staffRepository) {
        this.staffService = staffService;
        this.staffRepository = staffRepository;
    }

    @GetMapping("{staffId}")
    public HttpEntity<?> getStaff(@PathVariable UUID staffId) {
        Staff staff = staffRepository.findById(staffId).orElseThrow(() -> new ResourceNotFoundException("staff", "id", staffId));
        return ResponseEntity.ok().body(staffService.getStaff(staff));
    }

    @GetMapping
    public HttpEntity<?> getStaffs() {
        return ResponseEntity.ok().body(staffService.getStaffs());
    }

    @PostMapping
    public HttpEntity<?> addStaff(@RequestBody ReqStaff reqStaff) {
        return ResponseEntity.ok().body(staffService.addStaff(reqStaff));
    }

    @PutMapping
    public HttpEntity<?> editStaff(@RequestBody ReqStaff reqStaff) {
        return ResponseEntity.ok().body(staffService.editStaff(reqStaff));
    }

    @DeleteMapping("{staffId}")
    public HttpEntity<?> deleteStaff(@PathVariable UUID staffId) {
        return ResponseEntity.ok().body(staffService.deleteStaff(staffId));
    }

    @GetMapping("/byFirstNameOrLastName")
    public List<ResStaff> getStaffSearch(@RequestParam(value = "staffSearch", defaultValue = "") String staffSearch){
        return staffRepository.getStaffSearch(staffSearch).stream().map(staffService::getStaff).collect(Collectors.toList());
    }


}
