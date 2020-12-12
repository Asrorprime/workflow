package uz.pdp.workflow.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.workflow.entity.Payment;
import uz.pdp.workflow.entity.Project;
import uz.pdp.workflow.entity.enums.ProjectStatus;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.*;
import uz.pdp.workflow.repository.PayTypeRepository;
import uz.pdp.workflow.repository.PaymentRepository;
import uz.pdp.workflow.repository.ProjectRepository;
import uz.pdp.workflow.utils.CommonUtils;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService implements PaymentInterface {

    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final PayTypeRepository payTypeRepository;

    public PaymentService(PaymentRepository paymentRepository, ProjectRepository projectRepository, PayTypeRepository payTypeRepository) {
        this.paymentRepository = paymentRepository;
        this.projectRepository = projectRepository;
        this.payTypeRepository = payTypeRepository;
    }

    @Override
    public ApiResponse addPayment(ReqPayment request) {
        try {
            Project project = projectRepository.findByApplicationNumber(request.getApplicationNumber());
            if (!(project.getPrice() < request.getSum())) {
                if (!project.getProjectStatus().equals(ProjectStatus.CLOSED)) {
                    double paidSumByProject = paymentRepository.getPaidSumByProject(project.getApplicationNumber());
                    if ((project.getPrice() - paidSumByProject)!=0){
                        if (!(request.getSum() > project.getPrice() - paidSumByProject)) {
                            paymentRepository.save(new Payment(
                                    request.getApplicationNumber(),
                                    payTypeRepository.findById(request.getPayTypeId()).orElseThrow(() -> new ResourceNotFoundException("PayType", "id", request.getPayTypeId())),
                                    request.getSum(),
                                    request.getDate()
                            ));
                            return new ApiResponse("To'lov qilindi", true);
                        }
                        return new ApiResponse("Loyihaning qarzi: " + (project.getPrice() - paidSumByProject) + " UZS", false);
                    }
                    return new ApiResponse("Ushbu loyihaga to'lov to'liq to'lab bo'lingan!", false);
                }
                return new ApiResponse("Ushbu ariza uchun to'lov qabul qilish imkoni yo'q", false);
            } else {
                return new ApiResponse("Loyiha summasidan katta summa kiritish mumkin emas!", false);
            }
        } catch (Exception e) {
            return new ApiResponse("Xatolik!", false);
        }
    }

    @Override
    public ResPayment getPayment(Payment payment) {
        Project project = projectRepository.findByApplicationNumber(payment.getApplicationNumber());
        return getResPayment(payment, project);
    }


    private ResPayment getResPayment(Payment payment, Project project) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
        ResPayment resPayment = new ResPayment();
        resPayment.setId(payment.getId());
        resPayment.setApplicationNumber(payment.getApplicationNumber());
        resPayment.setPayTypeId(payment.getPayType().getId());
        resPayment.setPayTypeNameUz(payment.getPayType().getNameUz());
        resPayment.setSum(payment.getSum());
        resPayment.setDate(simpleDateFormat.format(payment.getDate()));
        resPayment.setCustomerName(project.getCustomer().getFullName());
        if (project.getApplicationNumber().equals(payment.getApplicationNumber())) {
            resPayment.setProjectName(project.getName());
            resPayment.setProjectPrice(project.getPrice());
        }
        return resPayment;
    }


    @Override
    public ResPageable getPayments(Integer page, Integer size, boolean sort) {
        if (sort) {
            Page<Payment> payments = paymentRepository.findAllByOrderByApplicationNumberDesc(CommonUtils.getPageable(page, size));
            return new ResPageable(
                    payments.getContent().stream().map(this::getPayment).collect(Collectors.toList()),
                    payments.getTotalElements(),
                    page,
                    payments.getTotalPages());
        } else {
            Page<Payment> payments = paymentRepository.findAllByOrderByApplicationNumberAsc(CommonUtils.getPageable(page, size));
            return new ResPageable(
                    payments.getContent().stream().map(this::getPayment).collect(Collectors.toList()),
                    payments.getTotalElements(),
                    page,
                    payments.getTotalPages());
        }
    }

    @Override
    public ResPageable getPaymentsDate(Integer page, Integer size, boolean dateSort) {
        if (dateSort) {
            Page<Payment> payments = paymentRepository.findAllByOrderByCreatedAtDesc(CommonUtils.getPageable(page, size));
            return new ResPageable(
                    payments.getContent().stream().map(this::getPayment).collect(Collectors.toList()),
                    payments.getTotalElements(),
                    page,
                    payments.getTotalPages());
        } else {
            Page<Payment> payments = paymentRepository.findAllByOrderByCreatedAtAsc(CommonUtils.getPageable(page, size));
            return new ResPageable(
                    payments.getContent().stream().map(this::getPayment).collect(Collectors.toList()),
                    payments.getTotalElements(),
                    page,
                    payments.getTotalPages());
        }
    }

    @Override
    public ApiResponse editPayment(ReqPayment request) {
        try {
            Payment payment = paymentRepository.findById(request.getId()).orElseThrow(() -> new ResourceNotFoundException("editPaymet", "id", request.getId()));
            payment.setApplicationNumber(request.getApplicationNumber());
            if (request.getPayTypeId() != null) {
                payment.setPayType(payTypeRepository.findById(request.getPayTypeId()).orElseThrow(() -> new ResourceNotFoundException("payType", "id", request.getPayTypeId())));
            }
            payment.setSum(request.getSum());
            payment.setDate(request.getDate());
            paymentRepository.save(payment);
            return new ApiResponse("To'lov tahrirlandi", true);

        } catch (Exception e) {
            return new ApiResponse("Xatolik!", false);
        }
    }

    @Override
    public ApiResponse deletePayment(UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("payment", "id", id));
        Project project = projectRepository.findByApplicationNumber(payment.getApplicationNumber());
        if (!project.getProjectStatus().equals(ProjectStatus.CLOSED)) {
            paymentRepository.deleteById(id);
            return new ApiResponse("To'lov o'chirildi!", true);
        }
        return new ApiResponse("O'chirishda xatolik! Ushbu loyiha tugatilgan ", false);
    }

    @Override
    public ResPageable getPaymentSearch(Integer page, Integer size, Integer appNumber) {
        Page<Payment> paymentPage = paymentRepository.getPaymentByAppNumber(appNumber, CommonUtils.getPageableForNative(page, size));
        return new ResPageable(
                paymentPage.getContent().stream().map(this::getPayment).collect(Collectors.toList()),
                paymentPage.getTotalElements(),
                page,
                paymentPage.getTotalPages());

    }


    public List<ResPayment> getPaymentList(Project project) {
        return paymentRepository.findAllByApplicationNumber(project.getApplicationNumber()).stream().map(payment -> getResPayment(payment, project)).collect(Collectors.toList());
    }
}
