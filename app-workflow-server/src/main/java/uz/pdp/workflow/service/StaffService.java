package uz.pdp.workflow.service;

import org.springframework.stereotype.Service;
import uz.pdp.workflow.entity.Staff;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.ApiResponse;
import uz.pdp.workflow.payload.ReqStaff;
import uz.pdp.workflow.payload.ResStaff;
import uz.pdp.workflow.repository.AttachmentRepository;
import uz.pdp.workflow.repository.SpecialtyRepository;
import uz.pdp.workflow.repository.StaffRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StaffService {

    final
    StaffRepository staffRepository;
    final
    AttachmentRepository attachmentRepository;
    final
    SpecialtyRepository specialtyRepository;

    public StaffService(StaffRepository staffRepository, AttachmentRepository attachmentRepository, SpecialtyRepository specialtyRepository) {
        this.staffRepository = staffRepository;
        this.attachmentRepository = attachmentRepository;
        this.specialtyRepository = specialtyRepository;
    }

    public ApiResponse addStaff(ReqStaff reqStaff) {
        Staff staff = new Staff(
                reqStaff.getFirstName(),
                reqStaff.getLastName(),
                reqStaff.getMiddleName(),
                reqStaff.getAddress(),
                reqStaff.getPhoneNumber(),
                reqStaff.getPhotoId() == null ? null : attachmentRepository.findById(reqStaff.getPhotoId()).orElseThrow(() -> new ResourceNotFoundException("file", "id", reqStaff.getPhotoId())),
                reqStaff.getDescription(),
                reqStaff.getSpecialtyId() == null ? null : specialtyRepository.findById(reqStaff.getSpecialtyId()).orElseThrow(() -> new ResourceNotFoundException("spec", "id", reqStaff.getSpecialtyId())));
        staffRepository.save(staff);
        return new ApiResponse("Muvaffaqiyatli qo'shildi!", true);
    }

    public ResStaff getStaff(Staff staff) {
        return new ResStaff(
                staff.getId(),
                staff.getFirstName(),
                staff.getLastName(),
                staff.getMiddleName(),
                staff.getAddress(),
                staff.getPhoneNumber(),
                staff.getPhoto() == null ? null : staff.getPhoto().getId(),
                staff.getDescription(),
                staff.getSpecialty() == null ? null : staff.getSpecialty().getId(),
                staff.getSpecialty() == null ? null : staff.getSpecialty().getNameUz(),
                staffRepository.projectCount(staff.getId())

        );
    }

    public List<ResStaff> getStaffs() {
        return staffRepository.findAll().stream().map(this::getStaff).collect(Collectors.toList());
    }

    public ApiResponse deleteStaff(UUID id) {
        try {
            staffRepository.deleteById(id);
            return new ApiResponse("O'chirildi!", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Xatolik", false);
        }
    }

    public ApiResponse editStaff(ReqStaff reqStaff) {
        if (reqStaff.getId() != null) {
            Staff staff = staffRepository.findById(reqStaff.getId()).orElseThrow(() -> new ResourceNotFoundException("staff", "id", reqStaff.getId()));
            staff.setFirstName(reqStaff.getFirstName());
            staff.setLastName(reqStaff.getLastName());
            staff.setMiddleName(reqStaff.getMiddleName());
            staff.setPhoneNumber(reqStaff.getPhoneNumber());
            staff.setAddress(reqStaff.getAddress());
            staff.setDescription(reqStaff.getDescription());
            staff.setPhoto(reqStaff.getPhotoId() == null ? null : attachmentRepository.findById(reqStaff.getPhotoId()).orElseThrow(() -> new ResourceNotFoundException("attachment", "id", reqStaff.getPhotoId())));
            staff.setSpecialty(reqStaff.getSpecialtyId() == null ? null : specialtyRepository.findById(reqStaff.getSpecialtyId()).orElseThrow(() -> new ResourceNotFoundException("spec", "id", reqStaff.getSpecialtyId())));
            staffRepository.save(staff);
            return new ApiResponse("O'zgartirildi!", true);
        } else {
            return new ApiResponse("Xatolik", false);
        }
    }

}
